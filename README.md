# Analisador ATS (Curriculum Analyzer)

Analise currículos contra sistemas ATS (Candidate Tracking Systems): receba feedback detalhado sobre score, palavras-chave, compatibilidade com vagas e sugestões de melhoria guiadas por IA.

**Demo:** [curriculum-ats.up.railway.app](https://curriculum-ats.up.railway.app)

## 🚀 Tecnologias

- **Frontend**: Angular 18+, Tailwind CSS, @ngx-translate (i18n), html2canvas/jsPDF para exportação.
- **Backend**: Node.js, Express, Groq API (Llama 3.3 70b), pdf-parse.

## 📂 Estrutura do Projeto

```text
ats-analyzer/
├── server/
│   └── index.js      # Proxy API → Groq API
├── frontend/
│   ├── src/          # Código fonte Angular
│   └── public/       # Ativos estáticos e traduções
├── package.json      # Scripts globais
└── .env              # Variáveis de ambiente
```

## 🛠️ Configuração e Instalação

### 1. Pré-requisitos

- **Node.js**: v18 ou superior.
- **Groq API Key**: Obtenha em [console.groq.com](https://console.groq.com).

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
GROQ_API_KEY="sua_chave_aqui"
GROQ_MODEL="llama-3.3-70b-versatile"
PORT=3000
```

### 3. Instalar Dependências

```bash
# Instala dependências do servidor e do frontend
npm run build
```

*Nota: O comando `npm run build` instalará as dependências do frontend e gerará o build de produção.*

## 🏃 Executando o Projeto

### Modo de Desenvolvimento (Frontend + Backend)

```bash
npm run dev
```

O frontend estará disponível em [http://localhost:4200](http://localhost:4200) (ou via proxy no 3000).

### Modo de Produção

```bash
npm start
```
Acesse: [http://localhost:3000](http://localhost:3000)

## 📝 Como Usar

1. Escolha entre **Upload PDF** ou **Colar Texto**.
2. Opcionalmente, adicione a **Descrição da Vaga** e o **Cargo Alvo** para uma análise de aderência.
3. Clique em **✨ Gerar Análise Inteligente**.
4. Visualize o relatório detalhado e **exporte como Imagem ou PDF**.

## 📊 O que é analisado

- **Score ATS Geral**: Compatibilidade técnica com parsers tradicionais.
- **Legibilidade e Sinérgia**: Clareza do texto e adequação ao cargo.
- **Palavras-chave**: Identificação automática de termos técnicos (encontrados vs. sugeridos).
- **Plano de Ação**: Sugestões categorizadas por prioridade (Crítico, Atenção, Dica).
