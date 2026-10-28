import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3001;
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'igreja-fieis-a-cristo-api' });
});

app.get('/api/programacao', (_req, res) => {
  res.json([
    { dia: 'Domingo', tipo: 'Culto', inicio: '09:30', fim: '11:30' },
    { dia: 'Terça-feira', tipo: 'Oração', inicio: '09:00', fim: '10:00' },
    { dia: 'Quarta-feira', tipo: 'Culto', inicio: '19:30', fim: '21:00' },
    { dia: 'Sábado', tipo: 'Oração', inicio: '09:00', fim: '10:00' }
  ]);
});

app.get('/', (_req, res) => res.json({ service: 'Igreja Fiéis a Cristo API', health: '/api/health' }));
app.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada' }));

app.listen(PORT, () => console.log(`API da igreja rodando na porta ${PORT}`));
