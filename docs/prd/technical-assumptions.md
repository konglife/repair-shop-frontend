# Technical Assumptions

## Repository Structure
* **Polyrepo:** The frontend will be in its own repository, clearly separated from the backend.

## Service Architecture
* **Decoupled Frontend/Backend:** The Frontend (Next.js) will act as a client that consumes data from the Backend (Strapi) via REST API.

## Testing Requirements
* **Unit + Integration:** Focus on writing Unit Tests and potentially Integration Tests for the API connection part.

## Additional Technical Assumptions and Requests
* **Frontend Stack:** Next.js (React) and MUI
* **Deployment:** The goal is to deploy on Vercel's free plan.
* **State Management:** Use React's basic state management (Hooks) in the MVP version.
* **Reusable Components:** Focus on creating reusable components.