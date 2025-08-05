# Unified Project Structure

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