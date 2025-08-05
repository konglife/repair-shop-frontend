# Authentication & Registration Flow (Strapi v5)

## 1. Register User (POST /api/auth/local/register)
### Request
```json
{
  "username": "frontenduser",
  "email": "frontend@example.com",
  "password": "password123"
}
```
### Response
```json
{
  "jwt": "eyJhbGci...",
  "user": {
    "id": "clx...",
    "username": "frontenduser",
    "email": "frontend@example.com"
  }
}
```

## 2. Login (POST /api/auth/local)
### Request
```json
{
  "identifier": "frontenduser",
  "password": "password123"
}
```
### Response
```json
{
  "jwt": "eyJhbGci...",
  "user": {
    "id": "clx...",
    "username": "frontenduser",
    "email": "frontend@example.com"
  }
}
```

## 3. use JWT
- For every request that requires auth, attach the header:
  - `Authorization: Bearer {jwt}`

## 4. Example Error (401 Unauthorized)
```json
{
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "Invalid identifier or password"
  }
}
```
