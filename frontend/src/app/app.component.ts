import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  activeTab: 'upload' | 'paste' = 'upload';
  viewMode: 'form-view' | 'loading-view' | 'results-view' = 'form-view';
  
  pdfBase64: string | null = null;
  resumeText: string = '';
  jdText: string = '';
  roleText: string = '';
  fileName: string | null = null;
  errorBox: string | null = null;

  loadingMsgs = [
    'Lendo o currículo...',
    'Identificando palavras-chave...',
    'Calculando score ATS...',
    'Gerando sugestões...',
  ];
  loadingMsg = this.loadingMsgs[0];
  msgInterval: any;

  results: any = null;

  switchTab(tab: 'upload' | 'paste') {
    this.activeTab = tab;
  }

  handleFile(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.fileName = file.name;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.pdfBase64 = e.target.result.split(',')[1];
    };
    reader.readAsDataURL(file);
  }

  startLoading() {
    let msgIdx = 0;
    this.loadingMsg = this.loadingMsgs[0];
    this.viewMode = 'loading-view';
    this.msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % this.loadingMsgs.length;
      this.loadingMsg = this.loadingMsgs[msgIdx];
    }, 2500);
  }

  goBack() {
    clearInterval(this.msgInterval);
    this.viewMode = 'form-view';
  }

  async analyze() {
    this.errorBox = null;

    if (this.activeTab === 'paste' && !this.resumeText.trim()) {
      this.errorBox = 'Cole o texto do currículo antes de analisar.';
      return;
    }
    if (this.activeTab === 'upload' && !this.pdfBase64) {
      this.errorBox = 'Selecione um arquivo PDF antes de analisar.';
      return;
    }

    this.startLoading();

    const systemPrompt = `Você é um especialista em recrutamento e sistemas ATS. Analise o currículo fornecido e retorne SOMENTE um objeto JSON válido, sem markdown, sem backticks, sem texto extra.

Estrutura obrigatória:
{
  "ats_score": <inteiro 0-100>,
  "readability_score": <inteiro 0-100>,
  "job_match_score": <inteiro 0-100 ou null se não houver JD>,
  "dimensions": [
    {"name": "Formatação e parseabilidade", "score": <0-100>},
    {"name": "Uso de palavras-chave", "score": <0-100>},
    {"name": "Estrutura e seções", "score": <0-100>},
    {"name": "Quantificação de resultados", "score": <0-100>},
    {"name": "Clareza e objetividade", "score": <0-100>}
  ],
  "keywords_found": [<até 12 palavras-chave presentes>],
  "keywords_missing": [<até 12 palavras-chave ausentes importantes para o cargo>],
  "job_match_details": <string descritiva ou null>,
  "suggestions": [
    {"priority": "critical"|"warning"|"tip", "title": "<título curto>", "body": "<explicação>"}
  ]
}

REGRA CRÍTICA: NUNCA sugira que o candidato invente, minta ou crie dados/métricas irreais para melhorar o currículo. Se faltar algo, oriente-o a buscar em suas experiências reais passadas ou a focar em adquirir a habilidade necessária.

Inclua 2-3 itens de cada prioridade. Responda em português brasileiro. Retorne APENAS o JSON.`;

    let userContent: any[] = [];
    const role = this.roleText.trim();
    const jd = this.jdText.trim();

    if (this.activeTab === 'upload' && this.pdfBase64) {
      userContent.push({
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data: this.pdfBase64,
        },
      });
      userContent.push({
        type: 'text',
        text: `Analise este currículo.${role ? '\nCargo alvo: ' + role : ''}${jd ? '\nDescrição da vaga:\n' + jd : ''}`,
      });
    } else {
      userContent.push({
        type: 'text',
        text: `Analise este currículo:\n\n${this.resumeText.trim()}${role ? '\n\nCargo alvo: ' + role : ''}${jd ? '\n\nDescrição da vaga:\n' + jd : ''}`,
      });
    }

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1500,
          system: systemPrompt,
          messages: [{ role: 'user', content: userContent }],
        }),
      });

      const raw = await res.json();
      if (!res.ok) throw new Error(raw.error || `HTTP ${res.status}`);

      const text = (raw.content || [])
        .map((b: any) => b.text || '')
        .join('')
        .trim();
      const clean = text
        .replace(/^```json\s*/, '')
        .replace(/^```\s*/, '')
        .replace(/```\s*$/, '')
        .trim();
      const data = JSON.parse(clean);
      
      clearInterval(this.msgInterval);
      this.results = data;
      this.viewMode = 'results-view';
    } catch (e: any) {
      clearInterval(this.msgInterval);
      this.viewMode = 'form-view';
      this.errorBox = 'Erro ao analisar: ' + e.message;
    }
  }

  colorClass(s: number) {
    if (s === null || s === undefined) return '';
    return s >= 75 ? 'good' : s >= 50 ? 'ok' : 'bad';
  }

  barClass(s: number) {
    if (s === null || s === undefined) return '';
    return s >= 75 ? 'green' : s >= 50 ? 'amber' : 'red';
  }

  async exportImage() {
    const resultsView = document.getElementById('results-view');
    if (!resultsView) return;
    
    const header = document.querySelector('.results-header') as HTMLElement;
    if (header) header.style.display = 'none';

    try {
      const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#ffffff';
      const canvas = await html2canvas(resultsView, {
        scale: 2,
        backgroundColor: bg,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = 'analise-curriculo.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Erro ao gerar imagem:', e);
      alert('Não foi possível gerar a imagem.');
    } finally {
      if (header) header.style.display = 'flex';
    }
  }

  async exportPDF() {
    const resultsView = document.getElementById('results-view');
    if (!resultsView) return;

    const header = document.querySelector('.results-header') as HTMLElement;
    if (header) header.style.display = 'none';

    try {
      const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#ffffff';
      const canvas = await html2canvas(resultsView, {
        scale: 2,
        backgroundColor: bg,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save('analise-curriculo.pdf');
    } catch (e) {
      console.error('Erro ao gerar PDF:', e);
      alert('Não foi possível gerar o PDF.');
    } finally {
      if (header) header.style.display = 'flex';
    }
  }
}
