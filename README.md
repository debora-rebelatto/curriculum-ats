# Analisador ATS

Analisa currículos contra sistemas ATS: score, palavras-chave, compatibilidade com vaga e sugestões de melhoria.

## Estrutura

```
ats-analyzer/
├── server/
│   └── index.js      # Proxy Express → LLM Local (Ollama)
├── public/
│   └── index.html    # Frontend completo
└── package.json
```

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o Ollama (Pré-requisito)

Certifique-se de que o **Ollama** está instalado e rodando localmente (comumente na porta `11434`) com o modelo que será utilizado (`gemma3:4b` ou o que estiver configurado em `server/index.js`).

### 3. Rodar

```bash
npm start
```

Acesse: [http://localhost:3000](http://localhost:3000)

### Dev (com auto-reload)

```bash
npm run dev
```

> Requer nodemon: `npm install -D nodemon`

## Como usar

1. Cole o texto do currículo **ou** faça upload de um PDF
2. Opcionalmente cole a descrição da vaga e o cargo alvo
3. Clique em **Analisar currículo**

## O que é analisado

- **Score ATS geral** — compatibilidade global com parsers ATS
- **Legibilidade** — clareza e objetividade do texto
- **Compatibilidade com vaga** — match com o job description (se fornecido)
- **5 dimensões** — formatação, palavras-chave, estrutura, quantificação, clareza
- **Keywords** — encontradas e faltantes/recomendadas
- **Sugestões** — priorizadas em crítico, atenção e dica
