# Analisador ATS

Analisa currículos contra sistemas ATS: score, palavras-chave, compatibilidade com vaga e sugestões de melhoria.

## Estrutura

```
ats-analyzer/
├── server/
│   └── index.js      # Proxy Express → Anthropic API
├── public/
│   └── index.html    # Frontend completo
└── package.json
```

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar a API key

Crie um arquivo `.env` na raiz (ou exporte a variável antes de rodar):

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

Ou crie `.env`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

> Se usar .env, instale dotenv: `npm install dotenv`  
> E adicione `require('dotenv').config()` no topo do `server/index.js`.

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
