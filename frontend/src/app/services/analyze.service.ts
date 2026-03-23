import { Injectable } from '@angular/core';
import { AnalyzerResult } from '../models/analyze.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {
  latestResult: AnalyzerResult | null = null;

  async analyzeResume(pdfBase64: string | null, resumeText: string, jdText: string, roleText: string): Promise<AnalyzerResult> {
    const systemPrompt = `Você é um especialista sênior em recrutamento, sistemas ATS e desenvolvimento de carreira, com mais de 15 anos de experiência avaliando currículos para empresas de todos os portes. Sua análise deve ser precisa, construtiva e acionável.

Analise o currículo fornecido e retorne SOMENTE um objeto JSON válido, sem markdown, sem backticks, sem texto extra.

=== CRITÉRIOS DE AVALIAÇÃO ===

ATS Score (ats_score): Avalie parseabilidade técnica — ausência de tabelas/colunas complexas, headers/footers, imagens com texto, fontes exóticas, uso correto de seções padrão (Experiência, Educação, Habilidades), e densidade de palavras-chave relevantes.

Readability Score (readability_score): Avalie clareza da comunicação — verbos de ação no início das frases, ausência de jargão excessivo, concisão, progressão lógica das informações e ausência de erros gramaticais evidentes.

Job Match Score (job_match_score): Somente se uma Job Description for fornecida. Avalie sobreposição de habilidades técnicas, soft skills, nível de senioridade e setor. Se não houver JD, retorne null.

Nível de Senioridade Inferido (seniority_level): Se nenhuma vaga ou nível de senioridade for fornecido, analise o currículo em busca de indicadores internos — anos de experiência total, complexidade das responsabilidades descritas, escopo de liderança, nível das empresas/projetos, progressão de carreira e vocabulário utilizado. Com base nisso, infira o nível mais provável do candidato e indique o grau de confiança dessa inferência.

=== ESTRUTURA OBRIGATÓRIA ===

{
  "ats_score": <inteiro 0-100>,
  "readability_score": <inteiro 0-100>,
  "job_match_score": <inteiro 0-100 ou null>,
  "dimensions": [
    {
      "name": "Formatação e parseabilidade",
      "score": <0-100>,
      "rationale": "<1-2 frases explicando o score desta dimensão>"
    },
    {
      "name": "Uso de palavras-chave",
      "score": <0-100>,
      "rationale": "<1-2 frases explicando o score desta dimensão>"
    },
    {
      "name": "Estrutura e seções",
      "score": <0-100>,
      "rationale": "<1-2 frases explicando o score desta dimensão>"
    },
    {
      "name": "Quantificação de resultados",
      "score": <0-100>,
      "rationale": "<1-2 frases explicando o score desta dimensão>"
    },
    {
      "name": "Clareza e objetividade",
      "score": <0-100>,
      "rationale": "<1-2 frases explicando o score desta dimensão>"
    }
  ],
  "keywords_found": [<até 12 palavras-chave presentes — priorize termos técnicos e de alto valor>],
  "keywords_missing": [<até 12 palavras-chave ausentes — baseie-se no cargo inferido ou na JD fornecida>],
  "job_match_details": "<parágrafo objetivo de 2-3 frases descrevendo alinhamento com a vaga, ou null>",
  "strengths": [
    "<ponto forte concreto do currículo — ex: forte histórico de progressão de carreira>",
    "<ponto forte concreto>",
    "<ponto forte concreto>"
  ],
  "suggestions": [
    {
      "priority": "critical" | "warning" | "tip",
      "title": "<título curto e direto — máx. 8 palavras>",
      "body": "<explicação com: (1) qual é o problema, (2) por que impacta negativamente, (3) como corrigir com base em experiências reais do candidato>",
      "example": "<exemplo concreto de como a correção ficaria no currículo, quando aplicável, ou null>"
    }
  ],
  "seniority_level": {
    "inferred": "<nível inferido: junior | pleno | senior | especialista | lideranca | null se não for possível inferir>",
    "confidence": <0-100>,  // grau de confiança na inferência
    "reasoning": "<1-2 frases explicando os principais indicadores que levaram a essa conclusão>"
  }
}

=== REGRAS DE QUALIDADE ===

1. HONESTIDADE ACIMA DE TUDO: Jamais sugira inventar dados, métricas ou experiências. Se faltam números, oriente o candidato a resgatar resultados reais (ex: "Tente lembrar o volume de atendimentos diários que você gerenciava").
2. ESPECIFICIDADE: Evite sugestões genéricas como "adicione mais palavras-chave". Aponte quais palavras-chave, em qual seção e por quê.
3. CALIBRAÇÃO DOS SCORES: Reserve a faixa 90-100 para currículos excepcionais. A maioria dos currículos deve cair entre 40-75. Seja rigoroso.
4. DISTRIBUIÇÃO DAS SUGESTÕES: Gere entre 4 e 8 sugestões no total, priorizando sempre impacto real na taxa de chamadas para entrevista. Classifique cada uma como "critical" (problema que provavelmente está eliminando o currículo), "warning" (problema que reduz as chances) ou "tip" (melhoria incremental). Só inclua uma sugestão se ela for genuinamente aplicável ao perfil e contexto profissional analisado — prefira menos sugestões relevantes a mais sugestões genéricas.
5. STRENGTHS: Identifique pontos genuinamente fortes — não elogie o óbvio. Seja específico ao cargo/área.
6. INFERÊNCIA DE SENIORIDADE: Quando não houver JD ou indicação explícita de nível, sempre preencha seniority_inference. Baseie-se em evidências concretas do currículo — nunca assuma. Se os sinais forem contraditórios (ex: muitos anos de experiência mas responsabilidades limitadas), sinalize isso no rationale e use confiança "baixa" ou "média".

Responda em português brasileiro. Retorne APENAS o JSON.`;

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
