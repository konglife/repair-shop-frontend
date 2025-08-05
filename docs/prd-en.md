# Product Requirements Document (PRD): Back-office Dashboard for Repair Shop
**Version:** 1.0
**Date:** 2025-08-03

## 1. Goals and Background Context

### Goals
* To reduce the time spent on manually recording and summarizing business data.
* To increase the accuracy of financial and product stock data.
* To enable the shop owner to access insights and make faster business decisions.
* To create a centralized system for managing all of the shop's data (repairs, sales, purchases, stock).

### Background Context
This project was initiated to solve the problem of a repair shop owner who manages all business data through a manual process using a notebook, which results in delays, risks of error, and a lack of a real-time business overview. This frontend application will be built to connect with the existing Strapi API, serving as a dashboard for displaying summaries and as a tool for managing all data digitally.

### Change Log
| Date       | Version | Description   | Author    |
| :--------- | :------ | :------------ | :-------- |
| 2025-08-03 | 1.0     | Initial draft | John (PM) |

## 2. Requirements

### Functional Requirements
* **FR1:** The user must be able to log into the system through an authentication screen.
* **FR2:** The system must have a Dashboard page to display a summary of basic income-expense data.
* **FR3:** The system must be able to manage (Create, Read, Update, Delete) **Products** data.
* **FR4:** The system must be able to manage **Stock** data.
* **FR5:** The system must be able to manage **Purchases** data.
* **FR6:** The system must be able to manage **RepairJobs** data.
* **FR7:** The system must be able to manage **Sales** data.
* **FR8:** The system must calculate summary data from raw data fetched from the API to display on the Dashboard.

### Non-Functional Requirements
* **NFR1:** The frontend must be developed using the Next.js (React) framework and the MUI library.
* **NFR2:** The system must be deployable on a free service like Vercel.
* **NFR3:** The UI/UX design must be simple and user-friendly, primarily based on MUI components.
* **NFR4:** JWT management for authentication on the frontend must be handled securely.
* **NFR5:** The system must have a fast-loading response when displaying the Dashboard page.

## 3. User Interface Design Goals

### Overall UX Vision
Create a user experience that is Minimalist, Efficient, and User-friendly. The user must be able to access data and manage tasks quickly without a steep learning curve.

### Key Interaction Paradigms
* Use Data Tables that support searching, sorting, and filtering.
* Use Forms and Modals/Dialogs for adding and editing data.
* The main Dashboard will be Card-based to display summaries for each section and will include Charts for key statistical data.

### Core Screens and Views
* Login Page
* Main Dashboard
* Products Management Page
* Stock Management Page
* Purchases Management Page
* Repair Jobs Management Page
* Sales Management Page

### Accessibility
* **None:** In this MVP version, we will not specifically focus on WCAG requirements but will rely on the basic accessibility standards that come with MUI.

### Branding
* Primarily use the basic, modern, and beautiful design of MUI (Material Design). No specific colors or logos will be used yet.

### Target Device and Platforms
* **Web Responsive (Desktop-first):** Designed with a primary focus on Desktop Browser usage, but it must also be usable on Tablets and Mobile devices.

## 4. Technical Assumptions

### Repository Structure
* **Polyrepo:** The frontend will be in its own repository, clearly separated from the backend.

### Service Architecture
* **Decoupled Frontend/Backend:** The Frontend (Next.js) will act as a client that consumes data from the Backend (Strapi) via REST API.

### Testing Requirements
* **Unit + Integration:** Focus on writing Unit Tests and potentially Integration Tests for the API connection part.

### Additional Technical Assumptions and Requests
* **Frontend Stack:** Next.js (React) and MUI
* **Deployment:** The goal is to deploy on Vercel's free plan.
* **State Management:** Use React's basic state management (Hooks) in the MVP version.
* **Reusable Components:** Focus on creating reusable components.

## 5. Epic List

* **Epic 1: Project Foundation & Authentication**
    * **Goal:** Set up the Next.js + MUI project, create the Login page, and manage login state.
* **Epic 2: Product & Stock Management**
    * **Goal:** Create a CRUD system for Products and Stock.
* **Epic 3: Core Operations - Purchases & Repairs**
    * **Goal:** Create a CRUD system for recording Purchases and RepairJobs.
* **Epic 4: Sales & Dashboard Foundation**
    * **Goal:** Create a CRUD system for Sales and display summary data on the Dashboard.

## 6. Epic Details

### Epic 1: Project Foundation & Authentication
**Expanded Goal:** Set up the Next.js project, install MUI, and build a complete authentication system.
* **Story 1.1: Initial Project Setup** (Initial Next.js project setup and dependency installation)
* **Story 1.2: Create Basic App Layout** (Create the main Layout component)
* **Story 1.3: Develop Login Page UI** (Develop the UI for the Login page)
* **Story 1.4: Implement Login Authentication Logic** (Implement login authentication logic with the API)
* **Story 1.5: Implement Logout and Global Auth State** (Implement logout and global auth state management)
* **Story 1.6: Create Protected Routes** (Create protected routes for logged-in users only)

### Epic 2: Product & Stock Management
**Expanded Goal:** Create a system to manage product and spare part data, including tracking inventory levels.
* **Story 2.1: Develop Product List Page UI** (Develop the Product List Page UI)
* **Story 2.2: Develop Create/Edit Product Form** (Develop the Create/Edit Product Form)
* **Story 2.3: Implement Create/Update/Delete Product Logic** (Implement Create/Update/Delete Product logic with the API)
* **Story 2.4: Develop Stock List Page UI** (Develop the Stock List Page UI)
* **Story 2.5: Implement Stock Adjustment Logic** (Implement Stock Adjustment Logic)

### Epic 3: Core Operations - Purchases & Repairs
**Expanded Goal:** Create a system to record product purchases and repair job data.
* **Story 3.1: Develop Purchase Order List Page UI** (Develop the Purchase Order List Page UI)
* **Story 3.2: Develop Create/Edit Purchase Order Form** (Develop the Create/Edit Purchase Order Form)
* **Story 3.3: Implement Create Purchase Logic & Update Stock** (Implement Create Purchase logic & Update Stock)
* **Story 3.4: Develop Repair Job List Page UI** (Develop the Repair Job List Page UI)
* **Story 3.5: Develop Create/Edit Repair Job Form** (Develop the Create/Edit Repair Job Form)
* **Story 3.6: Implement Create Repair Job Logic & Update Stock** (Implement Create Repair Job logic & Update Stock)

### Epic 4: Sales & Dashboard Foundation
**Expanded Goal:** Create a sales recording system and display all data on the Dashboard.
* **Story 4.1: Develop Sales List Page UI** (Develop the Sales List Page UI)
* **Story 4.2: Develop Create/Edit Sale Form** (Develop the Create/Edit Sale Form)
* **Story 4.3: Implement Create Sale Logic & Update Stock** (Implement Create Sale logic & Update Stock)
* **Story 4.4: Develop Simple Dashboard UI** (Develop a Simple Dashboard UI)
* **Story 4.5: Implement Dashboard Data Calculation & Display** (Implement Dashboard data calculation and display logic)