# PHANTASMAGORIA Alumni Platform

This project is a web-based API developed using Express.js for managing an alumni influencer platform. It enables alumni to create professional profiles, participate in a blind bidding system, and be featured daily.

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/seniya23/Aserver-side-cw1-back-end.git
cd Aserver-side-cw-back-end
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Copy the example file (or create `.env` manually if example does not exist):

```bash
cp .env.example .env
```

Then update `.env` with your values:

```env
PORT=3000
JWT_SECRET="ASScw#2026webapp"
GMAIL_APP_PASSWORD="poyx hqam eceh bsal"
API_KEY_HEADER="X-API-Key"
```

### 4. Run backend server

```bash
npm start
```

Server will run on:

`http://localhost:3000`

## Frontend Setup (React - Vite)

### 1. Navigate to frontend

```bash
cd ../Aserver-side-cw-front-end
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup frontend env

Create `.env`:

```env
VITE_BACKEND_URL=http://localhost:3000/api
VITE_API_KEY_HEADER=x-api-key
```

### 4. Run the React app

```bash
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## Swagger API Documentation

Access Swagger UI:

`http://localhost:3000/api-docs`

You can:

- View all endpoints
- Test APIs directly
- Authenticate using JWT where required

## Authentication (Swagger)

1. Call `/api/users/login`
2. Copy the returned token
3. Click **Authorize** in Swagger
4. Enter:

```text
Bearer your_token_here
```

## Technologies Used

### Backend

- Node.js
- Express.js
- SQLite3
- JWT Authentication
- Node-cron (scheduled tasks)
- Nodemailer (OTP/bid notifications)
- Swagger (API documentation)

### Frontend

- React (Vite)
- Axios
- Chart.js / react-chartjs-2 (analytics)
- html2canvas + jsPDF (PDF export)

## Notes

- CORS is enabled for frontend usage
- JWT is required for protected routes
- API key scoped routes are enforced via permission middleware
- Midnight winner selection runs via cron (`0 0 * * *`)
- API key header name must match in backend and frontend (`API_KEY_HEADER` / `VITE_API_KEY_HEADER`)
