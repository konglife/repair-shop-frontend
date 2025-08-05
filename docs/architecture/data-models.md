# Data Models

The initial data structures in the form of TypeScript Interfaces to be used in the project.

## Product

```typescript
interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
}
```

## Sale

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

## RepairJob

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