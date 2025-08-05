# High Level Architecture

## Technical Summary

The project's architecture will be a Decoupled Fullstack Application. The frontend, built with Next.js (React) and MUI as the UI Library, will function as a complete Client-side Application. The frontend will connect to the existing Strapi v5 Backend via a REST API to manage all data. Deployment will focus on the Vercel platform for the frontend to facilitate easy development and to take advantage of the free tier for getting started.

## High Level Project Diagram

```mermaid
graph LR
    A[👤 User] --> B[🌐 Vercel / CDN];
    B --> C[💻 Next.js Frontend App <br>(in Browser)];
    C -- HTTPS REST API Request --> D[🚀 Strapi Backend <br>(Deployed Service)];
    D <--> E[🗄️ Database];
```

## Platform and Infrastructure Choice

  * **Platform:** Vercel for deploying the frontend project.
  * **Infrastructure:** The backend is an already deployed, separate Strapi service. The frontend will run on Vercel's Edge Network.

## Repository Structure

  * **Polyrepo:** The frontend project will be in its own repository, completely separate from the backend.

## Architectural Patterns

  * **Overall Architecture:** Decoupled (Headless) Architecture
  * **Frontend Patterns:** Component-Based UI, Client-Side State Management (React Hooks)
  * **Integration Pattern:** REST API Consumption