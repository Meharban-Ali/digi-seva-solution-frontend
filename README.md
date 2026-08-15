# Digi Seva Solution - Web Frontend

Production-grade React + TypeScript frontend web application for **Digi Seva Solution** (CSC Jan Seva Kendra in New Ashok Nagar, Delhi).

---

## Technical Stack
- **Build Tool**: Vite
- **UI Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS + ShadCN UI
- **Data Fetching & Caching**: TanStack Query v5
- **HTTP Client**: Axios
- **State Management**: Zustand *(configured in Phase 5)*
- **Forms & Validation**: React Hook Form + Zod *(configured in Phase 3)*
- **Bilingual i18n**: `react-i18next` *(configured in Phase 2)*

---

## Project Folder Structure

```
src/
├── assets/         # Static images, logos, icons
├── components/
│   ├── ui/         # ShadCN generated base components (Button, Card)
│   ├── layout/     # Page layout frames (Navbar, Footer, Sidebar)
│   └── common/     # Shared application UI widgets
├── pages/          # View pages (HomePage, ServicesPage, AdminDashboard)
├── features/       # Modular feature domains
├── lib/
│   ├── utils.ts    # cn() class merger utility
│   ├── axios.ts    # Configured Axios HTTP client instance
│   └── queryClient.ts # TanStack Query client configuration
├── hooks/          # Custom React hooks
├── schemas/        # Zod validation schemas
├── i18n/           # react-i18next bilingual configuration (EN/HI)
├── routes/         # React Router navigation and route guards
└── types/          # TypeScript interface definitions (ApiResponse<T>, etc.)
```

---

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `VITE_API_BASE_URL` points to your running backend:
```env
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Start Development Server
```bash
npm run dev
```
The application will launch on **[http://localhost:5173](http://localhost:5173)**.
