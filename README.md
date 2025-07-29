# Movie diary

A full-stack web application that allows users to create, view, edit, and delete entries in a personal movie journal. The project integrates with The Movie Database (TMDB) API to automatically retrieve movie information and images.

- **[Access the live app (Note: Cold Start)](https://diario-filmes-entrega.vercel.app/)**

## Screenshots / Demo

#TO DO <PC and mobile screenshots, demos>
![Screenshot da Coleção](link_para_seu_screenshot.png)
![Screenshot do Formulário com Autocompletar](link_para_seu_screenshot.png)
![Screenshot da Tela de inicio](link_para_seu_screenshot.png)

## Technologies Used

- **Frontend:**

  - [Next.js](https://nextjs.org/) (React Framework)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/) for styling
  - [Heroicons](https://heroicons.com/) for icons

- **Backend:**

  - [NestJS](https://nestjs.com/) (Node.js Framework)
  - [TypeScript](https://www.typescriptlang.org/)
  - [TypeORM](https://typeorm.io/) for object-relational mapping (ORM)
  - [PostgreSQL](https://www.postgresql.org/)

- **Infrastructure & Deployment:**
  - Frontend hosted in [Vercel](https://vercel.com/)
  - Backend hosted in [Render](https://render.com/)
  - Database hosted on [Neon](https://neon.tech/)

## Features

- [x] **Complete CRUD:** Add, consult, edit and delete movies from the diary.
- [x] **Integration with External API:** Real-time movie search on the TMDB API for form auto-complete.
- [x] **Dynamic background:** Interface with a cinematic and animated background that is randomly selected.
- [x] **Responsive Design:** Adaptable interface for different screen sizes.
- [x] **Continuous Deployment:** Configured to automatically deploy from commits on GitHub.

## Next features
- [ ] **Login and auth system:** So everyone can have your own diary.
- [ ] **Advanced Search and Filters:** Implement a filter system to refine the visualization of the film collection by different attributes.

## How to Run Locally

Follow the steps below to run the project in your development environment.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/abertanha/nextjs-nestjs-movie-diary
    cd nextjs-nestjs-movie-diary
    ```

2.  **Backend Setup:**

    ```bash
    cd backend
    npm install
    # Create a file .env and add the variables DATABASE_URL and API_KEY
    npm run start:dev
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    # Create a file .env and add the variable NEXT_PUBLIC_API_URL
    npm run dev
    ```

## Links

- **Front-end Prototype:** `https://prototipo-jade.vercel.app/`
- **Backend API:** `https://diario-filmes-api.onrender.com`

---
