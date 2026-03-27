# ImageAI — Generador de Imágenes con IA

App web para generar imágenes únicas con inteligencia artificial usando **DALL-E 3** de OpenAI. Construida con Next.js 16 y Tailwind CSS.

## Características

- Genera imágenes a partir de un prompt de texto
- Selección de tamaño: cuadrado (1:1), apaisado (16:9) o vertical (9:16)
- Calidad estándar o HD
- Estilo vívido o natural
- Galería de imágenes generadas en la sesión
- Descarga directa de imágenes
- UI oscura y responsive

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Estilos | Tailwind CSS |
| IA | OpenAI DALL-E 3 |
| Deploy | Vercel |

## Instalación local

```bash
npm install
```

Crea un archivo `.env.local` con tu API key de OpenAI:

```env
OPENAI_API_KEY=sk-...
```

Luego corre el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Deploy en Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com)
2. Agrega la variable de entorno `OPENAI_API_KEY` en el dashboard de Vercel
3. Deploy automático en cada push a `main`

> Obtén tu API key en [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
