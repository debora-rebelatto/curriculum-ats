const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv').config();
const { PDFParse } = require('pdf-parse');

// Polyfill for DOMMatrix in Node.js (needed for pdfjs-dist used by pdf-parse)
if (typeof global.DOMMatrix === 'undefined') {
  global.DOMMatrix = class DOMMatrix {
    constructor(init) {
      this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
      if (Array.isArray(init) && init.length >= 6) {
        [this.a, this.b, this.c, this.d, this.e, this.f] = init.slice(0, 6);
      }
    }
    multiply() { return this; }
    translate() { return this; }
    scale() { return this; }
    rotate() { return this; }
    inverse() { return this; }
    transformPoint(p) { return p; }
  };
}

const app = express();
const PORT = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../frontend/dist/frontend/browser')));

app.post('/api/analyze', async (req, res) => {
  if (!GROQ_API_KEY) {
    return res
      .status(500)
      .json({ error: 'GROQ_API_KEY não configurada no servidor.' });
  }

  try {
    const { system, messages } = req.body;
    const userMsg = messages?.[0]?.content;

    let userText = '';

    if (Array.isArray(userMsg)) {
      for (const block of userMsg) {
        if (block.type === 'text') {
          userText += block.text + '\n';
        } else if (
          block.type === 'document' &&
          block.source?.type === 'base64'
        ) {
          const buffer = Buffer.from(block.source.data, 'base64');
          const pdfInstance = new PDFParse({ data: buffer });
          const data = await pdfInstance.getText();
          userText += data.text + '\n';
        }
      }
    } else {
      userText = userMsg || '';
    }

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.3,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: userText },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: data.error?.message || 'Erro na API Groq' });
    }

    res.json({
      content: [
        { type: 'text', text: data.choices?.[0]?.message?.content || '' },
      ],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
