# BidWork — Merchandising & Printing Marketplace

Plataforma de licitación para trabajos de merchandising e impresión. Las empresas publican proyectos y los proveedores compiten con sus mejores ofertas.

## Características

- **Clientes** publican trabajos de merchandising o impresión con presupuesto y fecha límite
- **Proveedores** exploran trabajos abiertos y envían propuestas con precio y tiempo de entrega
- **Adjudicación de contratos** — el cliente elige al mejor proveedor y cierra el trato
- **Panel de administración** vía Django Admin para gestión completa del marketplace
- **Filtros** por categoría (merchandising / impresión) y rango de presupuesto

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | Django 5.2 |
| Admin | Django Admin |
| Base de datos | PostgreSQL (producción) / SQLite (desarrollo) |
| Archivos estáticos | WhiteNoise |
| Deploy | Vercel |

## Estructura del proyecto

```
first-app-claude/
├── backend/              # Django app principal
│   ├── marketplace/      # App de licitación (modelos, vistas, templates)
│   ├── api/              # API REST existente (DRF)
│   ├── backend/          # Configuración Django
│   ├── requirements.txt
│   ├── vercel.json
│   └── build_files.sh
└── merch-mockup/         # Frontend Vue/Vite (mockup)
```

## Modelos principales

- **Company** — perfil de empresa (cliente o proveedor)
- **Job** — trabajo publicado (categoría, presupuesto, fecha límite, estado)
- **Bid** — oferta de un proveedor sobre un trabajo

## Instalación local

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Deploy en Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com)
2. Configura **Root Directory** → `backend`
3. Configura **Build Command** → `bash build_files.sh`
4. Agrega las variables de entorno:

```env
DJANGO_SETTINGS_MODULE=backend.settings_production
SECRET_KEY=tu-clave-secreta
DATABASE_URL=postgresql://...
ALLOWED_HOSTS=.vercel.app
```

## Admin

El panel de administración está disponible en `/admin/`. Crea un superusuario con:

```bash
python manage.py createsuperuser
```
