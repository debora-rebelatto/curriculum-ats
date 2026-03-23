import { Injectable } from '@angular/core';
import { AnalyzerResult } from '../models/analyze.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {
  latestResult: AnalyzerResult | null = null;

  async analyzeResume(pdfBase64: string | null, resumeText: string, jdText: string, roleText: string): Promise<AnalyzerResult> {
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
    const role = roleText.trim();
    const jd = jdText.trim();

    if (pdfBase64) {
      userContent.push({
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data: pdfBase64,
        },
      });
      userContent.push({
        type: 'text',
        text: `Analise este currículo.${role ? '\nCargo alvo: ' + role : ''}${jd ? '\nDescrição da vaga:\n' + jd : ''}`,
      });
    } else {
      userContent.push({
        type: 'text',
        text: `Analise este currículo:\n\n${resumeText.trim()}${role ? '\n\nCargo alvo: ' + role : ''}${jd ? '\n\nDescrição da vaga:\n' + jd : ''}`,
      });
    }

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

    this.latestResult = JSON.parse(clean) as AnalyzerResult;
    return this.latestResult;
  }
}
