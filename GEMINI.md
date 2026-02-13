# Gemini Project Context: Nastya's Tutoring Site

This document provides instructional context about the project for AI assistants.

## Project Overview

This is a modern, single-page portfolio and business website for a math tutor. It is built using the latest web technologies to be fast, responsive, and easy to maintain.

The key technologies used are:

*   **Framework**: Next.js 15 (with App Router)
*   **Language**: TypeScript
*   **UI Library**: React 19
*   **Styling**: Tailwind CSS, supplemented with shadcn/ui components for a consistent and modern look and feel.
*   **Linting**: ESLint is configured for code quality.

The site features several sections including "About", "Pricing", "Process", and "Success Stories". It also includes a functional contact form powered by a Next.js API route (`app/api/contact/route.ts`).

## Building and Running

The project is managed with npm.

### Local Development

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The site will be available at `http://localhost:3000`.

### Production

1.  **Build the project:**
    ```bash
    npm run build
    ```
2.  **Start the production server:**
    ```bash
    npm start
    ```

### Code Quality

*   **Linting:** To check for code style and potential errors, run:
    ```bash
    npm run lint
    ```

## Development Conventions

*   **Project Structure**: The code is organized following Next.js App Router conventions:
    *   `app/`: Contains the main pages, layouts, and API routes.
    *   `components/`: Contains reusable React components.
        *   `components/landing/`: High-level components specific to the landing page sections.
        *   `components/ui/`: Generic UI components from shadcn/ui.
    *   `lib/`: Contains utility functions.
    *   `public/`: Contains static assets like images.
*   **Styling**: The project uses Tailwind CSS for utility-first styling. Custom styles and component primitives are managed via `globals.css` and the `tailwind.config.ts` file.
*   **Components**: New UI elements should be created as reusable React components. For general-purpose UI, prefer using or extending the existing `shadcn/ui` components in `components/ui/`.

## Docker Deployment

The project includes a `Dockerfile` and `docker-compose.yml` for containerized deployment.

1.  **Build the Docker image:**
    ```bash
    docker-compose build
    ```
2.  **Run the container:**
    ```bash
    docker-compose up -d
    ```
    The application will be accessible on port 8000.
