# GuidHéHo

GuidHéHo is a web platform that connects travelers with local guides. Travelers can search for guides by city, theme, language, date, capacity and price, then book an available slot, contact a guide, save favorites, and leave reviews after an accepted booking. Guides can create and manage their profile, availabilities, bookings, and public information from their dashboard.

## Table of contents

<details>
  <summary>
    CLICK TO ENLARGE ⬇️

  </summary>
  <a href="#description">Description</a>
  <br>
  <a href="#objectives">Objectives</a>
  <br>
  <a href="#tech-stack">Tech stack</a>
  <br>
  <a href="#files-description">Files description</a>
  <br>
  <a href="#installation">Installation</a>
  <br>
  <a href="#whats-next">What's next?</a>
  <br>
  <a href="#thanks">Thanks</a>
  <br>
  <a href="#authors">Authors</a>
</details>

## <span id="description">Description</span>

GuidHéHo is an MVP built around two user roles:

- **Travelers** can create an account, verify their email, search for guides, view guide details, manage favorite guides, request bookings, contact guides, and publish reviews.
- **Guides** can become guides, define their city, biography, hourly price, languages, themes, availabilities, and booking capacity, then manage booking requests from their dashboard.

The application is split into a React frontend and a Django REST API backend. Authentication is handled with JWT tokens, data is stored in PostgreSQL, and guide locations can be geocoded/displayed with Mapbox.

## <span id="objectives">Objectives</span>

- Build a marketplace-style MVP for booking local guide experiences.
- Provide a clear traveler journey: register, verify email, search, compare, book, contact, review.
- Provide a clear guide journey: create a guide profile, configure availabilities, receive and manage booking requests.
- Use a REST API architecture with separated frontend and backend applications.
- Protect role-based actions, authenticated routes, bookings, favorites, and reviews.
- Keep the project ready for demonstration, iteration, and future deployment.

## <span id="tech-stack">Tech stack</span>

<p align="left">
  <img src="https://img.shields.io/badge/React-61dafb?logo=react&logoColor=black&style=for-the-badge" alt="React badge">
  <img src="https://img.shields.io/badge/Vite-646cff?logo=vite&logoColor=white&style=for-the-badge" alt="Vite badge">
  <img src="https://img.shields.io/badge/JavaScript-f7df1e?logo=javascript&logoColor=black&style=for-the-badge" alt="JavaScript badge">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38bdf8?logo=tailwindcss&logoColor=white&style=for-the-badge" alt="Tailwind CSS badge">
  <img src="https://img.shields.io/badge/DaisyUI-5a0ef8?logo=daisyui&logoColor=white&style=for-the-badge" alt="DaisyUI badge">
  <img src="https://img.shields.io/badge/Django-092e20?logo=django&logoColor=white&style=for-the-badge" alt="Django badge">
  <img src="https://img.shields.io/badge/Django_REST_Framework-a30000?logo=django&logoColor=white&style=for-the-badge" alt="Django REST Framework badge">
  <img src="https://img.shields.io/badge/PostgreSQL-4169e1?logo=postgresql&logoColor=white&style=for-the-badge" alt="PostgreSQL badge">
  <img src="https://img.shields.io/badge/Mapbox-000000?logo=mapbox&logoColor=white&style=for-the-badge" alt="Mapbox badge">
</p>

## <span id="files-description">Files description</span>

| **FILE / FOLDER**              | **DESCRIPTION**                                                       |
| :----------------------------: | --------------------------------------------------------------------- |
| `GuidHeHo_frontend_react/`     | React/Vite frontend application.                                      |
| `GuidHeHo_frontend_react/src`  | Frontend source code: pages, components, hooks, services, context.    |
| `GuidHeHo_frontend_react/src/config/apiConfig.js` | API base URL configuration for frontend requests.        |
| `GuidHeHo_frontend_react/public/` | Public assets, favicon, icons, and GuidHéHo logo.                  |
| `GuideHéHo_backend/`           | Django backend and REST API.                                          |
| `GuideHéHo_backend/config/`    | Django project settings, root URLs, ASGI/WSGI configuration.          |
| `GuideHéHo_backend/apps/accounts/` | Custom user model, authentication, email verification, password reset. |
| `GuideHéHo_backend/apps/guides/` | Guide profiles, search filters, availabilities, favorites, Mapbox geocoding. |
| `GuideHéHo_backend/apps/bookings/` | Booking creation, traveler bookings, guide booking management.     |
| `GuideHéHo_backend/apps/reviews/` | Review creation, guide ratings, traveler and guide review lists.    |
| `GuideHéHo_backend/apps/messaging/` | Contact messages between travelers and guides.                    |
| `Docs/`                        | Project documentation, diagrams and mockups.         |
| `.gitignore`                   | Specifies files and folders to be ignored by Git.                     |
| `README.md`                    | The README file you are currently reading 😉.                         |

## <span id="installation">Installation</span>

### Prerequisites

- Python 3.12 or newer
- Node.js and npm
- PostgreSQL
- A Mapbox access token, if you want map/geocoding features

### 1. Clone this repository

```bash
git clone https://github.com/Thorgalix/GuidHeHo.git
cd GuidHeHo
```

### 2. Backend setup

Open a terminal from the repository root:

```bash
cd GuideHéHo_backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create a PostgreSQL database matching the development settings, or update `GuideHéHo_backend/config/settings.py` with your own local database credentials.

Default development database configuration:

```text
Database: guidheho
User: postgres
Password: 1234
Host: localhost
Port: 5432
```

Create a `.env` file in `GuideHéHo_backend/` if needed:

```env
MAPBOX_ACCESS_TOKEN=your_mapbox_token
FRONTEND_URL=http://localhost:5173

# Optional SMTP configuration.
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@example.com
EMAIL_HOST_PASSWORD=your_app_password
DEFAULT_FROM_EMAIL=your_email@example.com
```

If no SMTP credentials are provided in development, Django sends emails to the console.

Run migrations and start the API:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The backend runs at:

```text
http://127.0.0.1:8000
```

### 3. Frontend setup

Open another terminal from the repository root:

```bash
cd GuidHeHo_frontend_react
npm install
```

Create a `.env` file in `GuidHeHo_frontend_react/`:

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_MAPBOX_TOKEN=your_mapbox_token
```

Start the frontend:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

### 4. Useful commands

Backend:

```bash
python manage.py runserver
python manage.py makemigrations
python manage.py migrate
python manage.py test
```

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## <span id="whats-next">What's next?</span>

- Add a filter to the search results.
- Add online payment and booking confirmation workflows.
- Improve messaging with a real conversation inbox.
- Add notifications for booking status changes.
- Improve deployment configuration for production environments.
- Implementing Docker for deployment.

## <span id="thanks">Thanks</span>

Thanks to everyone who tested, reviewed, challenged, or helped shape this MVP during development.

## <span id="authors">Authors</span>

**Lucas Podevin**

- GitHub: [@lpodevin](https://github.com/Thorgalix)
- LinkedIn: [@lpodevin](https://www.linkedin.com/in/lucas-podevin-thoisy)

**Mahmoud Bouate**

- GitHub: [@mbouate](https://github.com/Mahmoud-BOUATE)
- LinkedIn: [@mbouate](https://www.linkedin.com/in/mahmoud-bouate-72a365252/)
