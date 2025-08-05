# Fullstack Architecture Document: Back-office Dashboard for Repair Shop

**Version:** 1.0
**Date:** 2025-08-04

-----

## 1\. Introduction

This document is the complete technical blueprint for the Back-office Dashboard project. It specifies the project structure, database design, API integration, and all development standards to guide future development.

-----

## 2\. High Level Architecture

### Technical Summary

The project's architecture will be a Decoupled Fullstack Application. The frontend, built with Next.js (React) and MUI as the UI Library, will function as a complete Client-side Application. The frontend will connect to the existing Strapi v5 Backend via a REST API to manage all data. Deployment will focus on the Vercel platform for the frontend to facilitate easy development and to take advantage of the free tier for getting started.

### High Level Project Diagram

```mermaid
graph LR
    A[👤 User] --> B[🌐 Vercel / CDN];
    B --> C[💻 Next.js Frontend App <br>(in Browser)];
    C -- HTTPS REST API Request --> D[🚀 Strapi Backend <br>(Deployed Service)];
    D <--> E[🗄️ Database];
```

### Platform and Infrastructure Choice

  * **Platform:** Vercel for deploying the frontend project.
  * **Infrastructure:** The backend is an already deployed, separate Strapi service. The frontend will run on Vercel's Edge Network.

### Repository Structure

  * **Polyrepo:** The frontend project will be in its own repository, completely separate from the backend.

### Architectural Patterns

  * **Overall Architecture:** Decoupled (Headless) Architecture
  * **Frontend Patterns:** Component-Based UI, Client-Side State Management (React Hooks)
  * **Integration Pattern:** REST API Consumption

-----

## 3\. Tech Stack - (Updated)

| Category | Technology | Version | Purpose | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Language** | TypeScript | 5.8 | Primary development language | Increases code safety and improves IDE code suggestions. |
| **Frontend Framework**| Next.js | 15.4.5| Main application framework | Automatically handles routing, performance, and complex configurations. |
| **UI Library** | MUI (Material-UI) | 7.2.0 | Pre-built UI components | Speeds up dashboard development; has powerful components. |
| **State Management** | React | 19.1 | Manages application state | Is the current standard method in React (Hooks). |
| **API Style** | REST | - | Communication format with the backend | It is the standard format provided by the Strapi Backend. |
| **Charting Library** | Recharts | 3.1.0 | Creates charts on the Dashboard | Popular, easy to use, and highly compatible with React. |
| **Frontend Testing** | Jest & React Testing Library | latest | Tests Unit Tests | Is the standard toolset that comes with Next.js. |
| **Deployment** | Vercel | - | Deployment platform | Connects easily with Next.js and has a free plan. |

-----

## 4\. Data Models

The initial data structures in the form of TypeScript Interfaces to be used in the project.

### Product

```typescript
interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
}
```

### Sale

```typescript
interface Sale {
  id: string;
  saleDate: Date;
  saleItems: SaleItem[];
  totalAmount: number;
}
interface SaleItem {
  id: string;
  product: Product;
  quantity: number;
  pricePerUnit: number;
}
```

### RepairJob

```typescript
interface RepairJob {
  id:string;
  customerName: string;
  jobDescription: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  cost: number;
  usedParts: UsedPart[];
}
interface UsedPart {
  id: string;
  product: Product;
  quantityUsed: number;
}
```

-----

## 5\. Unified Project Structure

```plaintext
/repair-shop-frontend
├── /public/
│   ├── /images/
├── /src/
│   ├── /app/
│   │   ├── (auth)/
│   │   │   └── /login/
│   │   │       └── page.tsx
│   │   ├── (main)/
│   │   │   ├── /layout.tsx
│   │   │   ├── /page.tsx      # Dashboard
│   │   │   └── ... (products, stock, sales, etc.)
│   ├── /components/
│   │   ├── /ui/
│   │   └── /common/
│   ├── /contexts/
│   ├── /hooks/
│   ├── /lib/
│   ├── /styles/
│   └── /types/
├── next.config.mjs
├── package.json
└── tsconfig.json
```

-----

## 6\. Development and Operational Standards

### Coding Standards

  * **TypeScript First:** Use explicit types for all Props, State, and API data.
  * **Component Reusability:** Always create components to be reusable.
  * **Environment Variables:** Store sensitive information (like API URLs) in `.env.local`.

### Testing Strategy

  * Start by writing Unit Tests for complex logic and components.

### Security Principles

  * Manage JWT Tokens securely and attach them to every API request that requires authentication.

### Deployment

  * Deployment will be connected to the Git Repository and automated through the Vercel platform.
  
  <!-- end list -->