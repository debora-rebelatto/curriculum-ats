let pdfBase64 = null;
let activeTab = 'upload';
let msgInterval;
const loadingMsgs = [
  'Lendo o currículo...',
  'Identificando palavras-chave...',
  'Calculando score ATS...',
  'Gerando sugestões...',
];
let msgIdx = 0;

function switchTab(tab) {
  activeTab = tab;
  document
    .querySelectorAll('.tab')
    .forEach((t, i) =>
      t.classList.toggle('active', ['paste', 'upload'][i] === tab)
    );
  document.getElementById('paste-panel').style.display =
    tab === 'paste' ? 'block' : 'none';
  document.getElementById('upload-panel').style.display =
    tab === 'upload' ? 'block' : 'none';
}

function handleFile(input) {
  const file = input.files[0];
  if (!file) return;
  document.getElementById('upload-label').textContent = file.name;
  document.getElementById('drop-zone').classList.add('has-file');
  const reader = new FileReader();
  reader.onload = (e) => {
    pdfBase64 = e.target.result.split(',')[1];
  };
  reader.readAsDataURL(file);
}

function show(id) {
  const display = {
    'form-view': 'block',
    'loading-view': 'flex',
    'results-view': 'flex',
  };
  Object.keys(display).forEach((v) => {
    document.getElementById(v).style.display = v === id ? display[v] : 'none';
  });
}

function goBack() {
  clearInterval(msgInterval);
  show('form-view');
}

function startLoading() {
  msgIdx = 0;
  document.getElementById('loading-msg').textContent = loadingMsgs[0];
  msgInterval = setInterval(() => {
    msgIdx = (msgIdx + 1) % loadingMsgs.length;
    document.getElementById('loading-msg').textContent = loadingMsgs[msgIdx];
  }, 2500);
  show('loading-view');
}

function colorClass(s) {
  return s >= 75 ? 'good' : s >= 50 ? 'ok' : 'bad';
}
function barClass(s) {
  return s >= 75 ? 'green' : s >= 50 ? 'amber' : 'red';
}

function renderResults(data) {
  clearInterval(msgInterval);
  const metrics = [
    { label: 'Score ATS geral', value: data.ats_score },
    { label: 'Legibilidade', value: data.readability_score },
    { label: 'Compatibilidade com vaga', value: data.job_match_score },
  ];
  document.getElementById('score-row').innerHTML = metrics
    .map((m) => {
      const v =
        m.value !== null && m.value !== undefined ? m.value + '%' : 'N/A';
      const cls = typeof m.value === 'number' ? colorClass(m.value) : '';
      return `<div class="metric-card"><div class="metric-label">${m.label}</div><div class="metric-value ${cls}">${v}</div></div>`;
    })
    .join('');

  document.getElementById('dimensions').innerHTML = (data.dimensions || [])
    .map(
      (d) =>
        `<div class="bar-wrap"><div class="bar-label"><span>${d.name}</span><span>${d.score}%</span></div><div class="bar-bg"><div class="bar-fill ${barClass(d.score)}" style="width:${d.score}%"></div></div></div>`
    )
    .join('');

  document.getElementById('kw-found').innerHTML =
    (data.keywords_found || [])
      .map((k) => `<span class="tag found">${k}</span>`)
      .join('') ||
    '<span style="font-size:13px;color:var(--text3)">Nenhuma identificada</span>';
  document.getElementById('kw-missing').innerHTML =
    (data.keywords_missing || [])
      .map((k) => `<span class="tag missing">${k}</span>`)
      .join('') ||
    '<span style="font-size:13px;color:var(--text3)">Nenhuma</span>';

  const jdCard = document.getElementById('jd-compat-card');
  if (data.job_match_details) {
    jdCard.style.display = 'block';
    document.getElementById('jd-compat').innerHTML =
      `<p style="font-size:14px;line-height:1.7;color:var(--text2)">${data.job_match_details}</p>`;
  } else {
    jdCard.style.display = 'none';
  }

  document.getElementById('suggestions').innerHTML = (data.suggestions || [])
    .map(
      (s) =>
        `<div class="suggestion ${s.priority}"><strong>${s.title}</strong>${s.body}</div>`
    )
    .join('');

  show('results-view');
}

async function analyze() {
  const errBox = document.getElementById('error-box');
  errBox.style.display = 'none';
  const resumeText = document.getElementById('resume-text').value.trim();

  if (activeTab === 'paste' && !resumeText) {
    errBox.textContent = 'Cole o texto do currículo antes de analisar.';
    errBox.style.display = 'block';
    return;
  }
  if (activeTab === 'upload' && !pdfBase64) {
    errBox.textContent = 'Selecione um arquivo PDF antes de analisar.';
    errBox.style.display = 'block';
    return;
  }

  startLoading();

  const jd = document.getElementById('jd-text').value.trim();
  const role = document.getElementById('role-text').value.trim();

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

  let userContent = [];
  if (activeTab === 'upload' && pdfBase64) {
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
      text: `Analise este currículo:\n\n${resumeText}${role ? '\n\nCargo alvo: ' + role : ''}${jd ? '\n\nDescrição da vaga:\n' + jd : ''}`,
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
      .map((b) => b.text || '')
      .join('')
      .trim();
    const clean = text
      .replace(/^```json\s*/, '')
      .replace(/^```\s*/, '')
      .replace(/```\s*$/, '')
      .trim();
    const data = JSON.parse(clean);
    renderResults(data);
  } catch (e) {
    clearInterval(msgInterval);
    show('form-view');
    errBox.textContent = 'Erro ao analisar: ' + e.message;
    errBox.style.display = 'block';
  }
}

async function exportImage() {
  const header = document.querySelector('.results-header');
  if (header) header.style.display = 'none';
  const resultsView = document.getElementById('results-view');

  try {
    const bg =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--bg')
        .trim() || '#ffffff';
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

async function exportPDF() {
  const header = document.querySelector('.results-header');
  if (header) header.style.display = 'none';
  const resultsView = document.getElementById('results-view');

  try {
    const bg =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--bg')
        .trim() || '#ffffff';
    const canvas = await html2canvas(resultsView, {
      scale: 2,
      backgroundColor: bg,
      useCORS: true,
    });
    const imgData = canvas.toDataURL('image/png');

    if (typeof window.jspdf === 'undefined') {
      throw new Error('jsPDF não está carregado');
    }
    const { jsPDF } = window.jspdf;
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
