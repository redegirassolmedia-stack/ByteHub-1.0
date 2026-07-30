import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API endpoint for AI task generation based on activity/program
app.post('/api/generate-task', async (req, res) => {
  try {
    const { programOrActivity, additionalContext, tag } = req.body;

    if (!programOrActivity) {
      return res.status(400).json({ error: 'É necessário informar o programa ou actividade.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Smart fallback generator if Gemini API key is not present or if API call fails
    const generateFallbackTask = (prog: string, context?: string, defaultTag?: string) => {
      const isReels = context?.toLowerCase().includes('reels') || context?.toLowerCase().includes('vídeo');
      const cleanTag = defaultTag && defaultTag !== 'Geral' ? defaultTag : (isReels ? 'Audiovisual' : 'Editorial');

      return {
        title: context
          ? `Produção & Conteúdo: ${prog} (${context})`
          : `Cobertura & Recortes de Produção — ${prog}`,
        tag: cleanTag,
        priority: 'Alta',
        dueDate: 'Hoje às 17:30',
        description: `1. Selecionar os melhores momentos e destaques de "${prog}".\n` +
          `2. Elaborar texto descritivo/legenda adaptada com hashtags oficiais da Rede Girassol.\n` +
          (context ? `3. Executar foco específico: ${context}.\n` : '3. Montar artes/vídeo no formato vertical (1080x1920).\n') +
          `4. Submeter para validação da coordenação de emissão.\n` +
          `5. Agendar publicação no Instagram, Facebook e Portal Girassol.`
      };
    };

    if (!apiKey) {
      console.warn('GEMINI_API_KEY não encontrada. A utilizar gerador inteligente local.');
      const taskData = generateFallbackTask(programOrActivity, additionalContext, tag);
      return res.json({ success: true, task: taskData, fallback: true });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `Você é o assistente executivo de inteligência artificial da Rede Girassol (mídia de TV, Rádio e Digital em Angola).
Sua tarefa é gerar uma tarefa de produção/trabalho detalhada, profissional e acionável com base no programa de TV/Rádio ou na actividade informada.

Programa ou Actividade de Origem: ${programOrActivity}
Categoria/Tag Preferencial: ${tag || 'Geral'}
Instruções / Detalhes Adicionais: ${additionalContext || 'Nenhum detalhe extra fornecido'}

Sua resposta DEVE ser estritamente em formato JSON com a seguinte estrutura:
- "title": Título conciso, profissional e atrativo para a tarefa (ex: "Recorte & Edição de Melhores Momentos — Jornal do Meio-Dia" ou "Cobertura Fotográfica da Emissão de Manhã Viva Rádio").
- "tag": Uma das opções exatas: ["Editorial", "Audiovisual", "Design", "Métricas", "Emissão", "Portal", "Geral"].
- "priority": Uma das opções exatas: ["Baixa", "Média", "Alta", "Urgente"].
- "dueDate": Data/hora amigável sugerida (ex: "Hoje às 17:00", "Amanhã às 11:30" ou "Sexta-Feira às 15:00").
- "description": Passo a passo detalhado e organizado em lista com marcadores para a equipa executante (ex: 1. Selecionar trechos; 2. Inserir vinheta Girassol; 3. Validar áudio; 4. Agendar publicação no Instagram e Facebook).`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              tag: { type: Type.STRING },
              priority: { type: Type.STRING },
              dueDate: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ['title', 'tag', 'priority', 'dueDate', 'description']
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Sem resposta do modelo Gemini');
      }

      const taskData = JSON.parse(responseText);
      return res.json({ success: true, task: taskData });
    } catch (geminiErr: any) {
      console.error('Erro na chamada Gemini, a usar fallback local:', geminiErr);
      const taskData = generateFallbackTask(programOrActivity, additionalContext, tag);
      return res.json({ success: true, task: taskData, fallback: true });
    }
  } catch (err: any) {
    console.error('Erro ao processar endpoint /api/generate-task:', err);
    return res.status(500).json({
      error: 'Não foi possível gerar a tarefa com IA.',
      details: err?.message
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
