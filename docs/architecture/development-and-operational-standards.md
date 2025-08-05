# Development and Operational Standards

## Coding Standards

  * **TypeScript First:** Use explicit types for all Props, State, and API data.
  * **Component Reusability:** Always create components to be reusable.
  * **Environment Variables:** Store sensitive information (like API URLs) in `.env.local`.

## Testing Strategy

  * Start by writing Unit Tests for complex logic and components.

## Security Principles

  * Manage JWT Tokens securely and attach them to every API request that requires authentication.

## Deployment

  * Deployment will be connected to the Git Repository and automated through the Vercel platform.