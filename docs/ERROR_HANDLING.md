# Error Handling (Strapi v5)

## 1. example Error Response
### Validation Error
```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "name must be defined",
    "details": { ... }
  }
}
```

### Unauthorized (401)
```json
{
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "Invalid identifier or password"
  }
}
```

### Forbidden (403)
```json
{
  "error": {
    "status": 403,
    "name": "ForbiddenError",
    "message": "You are not allowed to perform this action"
  }
}
```

## 2. Best Practices
- Always check `error.status` and `error.message` on the frontend.
- Display an appropriate message to the user.
- In case of 401/403, redirect to the login page or display a notification.
