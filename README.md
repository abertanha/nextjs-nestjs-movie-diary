# Movie Diary

A full-stack, multi-user web application that allows users to create, view, edit, and delete entries in a personal movie journal. The project features a secure JWT authentication system with email verification and is fully bilingual (English/Portuguese). It integrates with The Movie Database (TMDB) API to automatically retrieve movie information and images.

**[Access the Live Application (Note: Render's backend may have a cold start)](https://diario-filmes-entrega.vercel.app/)**
#### For testing use the following acc: 
```
user: esther.auer33@ethereal.email
password: 12345678
```
## Key Features

#### Core Functionality
- **Complete Movie CRUD:** Add, view, edit, and delete movies from a personal collection.
- **External API Integration:** Real-time movie search on the TMDB API to auto-complete the movie creation form.
- **Dynamic Background:** An immersive, animated background that is randomly selected on session start.
- **Responsive Design:** A fully adaptable interface for both desktop and mobile devices.

#### Authentication & Security
- **User Registration & Login:** A complete sign-up and sign-in system using JWT (JSON Web Tokens).
- **Secure Password Hashing:** User passwords are securely hashed using `scrypt` with a unique salt for each user.
- **Email Verification:** New users receive a verification email to activate their account before they can log in.
- **Protected Routes:** Both backend API routes and frontend pages are protected, ensuring users can only access their own data.

#### Internationalization (i18n)
- **Bilingual Support:** The entire user interface is available in English (en-US) and Portuguese (pt-BR).
- **Language Switcher:** A simple UI component allows users to switch the language dynamically.
- **Locale-Aware Routing:** Utilizes `next-intl` with path-based routing (`/en-US/...`, `/pt-BR/...`) for clear, shareable, and SEO-friendly URLs.

## Screenshots / Demo

![Login Page](link_para_seu_screenshot.png)
![Movie Collection](link_para_seu_screenshot.png)
![Add Movie Form](link_para_seu_screenshot.png)

## Technologies Used

- **Frontend:**
  - Framework: [Next.js](https://nextjs.org/) / [React](https://react.dev/)
  - Language: [TypeScript](https://www.typescriptlang.org/)
  - Styling: [Tailwind CSS](https://tailwindcss.com/)
  - Internationalization: [next-intl](https://next-intl.dev/)
  - Data Fetching: [Axios](https://axios-http.com/)

- **Backend:**
  - Framework: [NestJS](https://nestjs.com/) (Node.js)
  - Language: [TypeScript](https://www.typescriptlang.org/)
  - ORM: [TypeORM](https://typeorm.io/)
  - Authentication: [Passport.js](http://www.passportjs.org/) (JWT & Local Strategies)
  - Security: [bcrypt](https://www.npmjs.com/package/bcrypt) / `crypto`
  - Emailing: [Nodemailer](https://nodemailer.com/) via `@nestjs-modules/mailer`

- **Infrastructure & Deployment:**
  - Database: [PostgreSQL](https://www.postgresql.org/) hosted on [Neon](https://neon.tech/)
  - Backend Deployment: [Render](https://render.com/)
  - Frontend Deployment: [Vercel](https://vercel.com/)
  - CI/CD: Automated deployments from GitHub commits.

## Future Enhancements
- [ ] **Two-Factor Authentication (2FA):** Implement 2FA using authenticator apps for an extra layer of security.
- [ ] **User Profile Page:** Allow users to change their password or delete their account.

## How to Run Locally

Follow the steps below to run the project in your development environment.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/abertanha/nextjs-nestjs-movie-diary.git](https://github.com/abertanha/nextjs-nestjs-movie-diary.git)
    cd nextjs-nestjs-movie-diary
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory and add the following variables. Use the Ethereal service for mail testing.
    ```env
    # .env (backend)
    DATABASE_URL="YOUR_POSTGRESQL_URL_FROM_NEON"
    API_KEY="YOUR_TMDB_API_KEY"
    JWT_SECRET="YOUR_RANDOM_JWT_SECRET"
    FRONTEND_URL="http://localhost:3000"
    
    # Ethereal Credentials
    MAIL_HOST="smtp.ethereal.email"
    MAIL_PORT=587
    MAIL_USER="YOUR_ETHEREAL_USER"
    MAIL_PASS="YOUR_ETHEREAL_PASSWORD"
    MAIL_FROM_NAME="Movie Diary"
    MAIL_FROM_EMAIL="noreply@moviediary.com"
    ```
    Then, run the database migrations and start the server:
    ```bash
    npm run migration:run
    npm run start:dev
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    ```
    Create a `.env.local` file in the `frontend` directory:
    ```env
    # .env.local (frontend)
    NEXT_PUBLIC_API_URL="http://localhost:3001"
    ```
    Then, start the development server:
    ```bash
    npm run dev
    ```

## Links

- **Live Application:** `https://diario-filmes-entrega.vercel.app/`
- **Backend API:** `https://diario-filmes-api.onrender.com`
