# Igreja Evangélica Fiéis a Cristo

Projeto React + Vite no frontend e Node.js + Express no backend.

## Requisitos
- Node.js 20 ou superior
- npm

## Rodar localmente

Abra dois terminais.

### Terminal 1 — backend
```bash
cd backend
npm install
npm run dev
```
API disponível em http://localhost:3001/api/health

### Terminal 2 — frontend
```bash
cd frontend
npm install
npm run dev
```
Abra http://localhost:5173

A programação de cultos funciona no fuso de São Paulo e o destaque muda automaticamente. A confirmação de presença é uma interação no frontend; não coleta nem envia dados pessoais.

## Logo
A logo enviada foi colocada em `frontend/public/logo-igreja.png`. Para trocar, substitua esse arquivo mantendo o mesmo nome.

## Publicação
O frontend está preparado para Vercel. O backend pode ser publicado em uma hospedagem Node compatível; defina `VITE_API_URL` no frontend se quiser apontar para uma API hospedada. O site funciona sem depender da API para as seções visuais.
