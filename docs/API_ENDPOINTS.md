# API Endpoint Summary (Strapi v5)

> **Date: 2025-07-09**

## Complete Endpoints List (REST API)

| Content Type   | List                | Single (documentId)         | Create            | Update               | Delete               |
|---------------|---------------------|-----------------------------|-------------------|----------------------|----------------------|
| Category      | GET /api/categories | GET /api/categories/{documentId} | POST /api/categories | PUT /api/categories/{documentId} | DELETE /api/categories/{documentId} |
| Customer      | GET /api/customers  | GET /api/customers/{documentId}  | POST /api/customers  | PUT /api/customers/{documentId}  | DELETE /api/customers/{documentId}  |
| Product       | GET /api/products   | GET /api/products/{documentId}   | POST /api/products   | PUT /api/products/{documentId}   | DELETE /api/products/{documentId}   |
| Purchase      | GET /api/purchases  | GET /api/purchases/{documentId}  | POST /api/purchases  | PUT /api/purchases/{documentId}  | DELETE /api/purchases/{documentId}  |
| PurchaseItem  | GET /api/purchase-items | GET /api/purchase-items/{documentId} | POST /api/purchase-items | PUT /api/purchase-items/{documentId} | DELETE /api/purchase-items/{documentId} |
| RepairJob     | GET /api/repair-jobs| GET /api/repair-jobs/{documentId}| POST /api/repair-jobs| PUT /api/repair-jobs/{documentId}| DELETE /api/repair-jobs/{documentId}|
| Sale          | GET /api/sales      | GET /api/sales/{documentId}      | POST /api/sales      | PUT /api/sales/{documentId}      | DELETE /api/sales/{documentId}      |
| SaleItem      | GET /api/sale-items | GET /api/sale-items/{documentId} | POST /api/sale-items | PUT /api/sale-items/{documentId} | DELETE /api/sale-items/{documentId} |
| Stock         | GET /api/stocks     | GET /api/stocks/{documentId}     | POST /api/stocks     | PUT /api/stocks/{documentId}     | DELETE /api/stocks/{documentId}     |
| Supplier      | GET /api/suppliers  | GET /api/suppliers/{documentId}  | POST /api/suppliers  | PUT /api/suppliers/{documentId}  | DELETE /api/suppliers/{documentId}  |
| Unit          | GET /api/units      | GET /api/units/{documentId}      | POST /api/units      | PUT /api/units/{documentId}      | DELETE /api/units/{documentId}      |
| UsedPart      | GET /api/used-parts | GET /api/used-parts/{documentId} | POST /api/used-parts | PUT /api/used-parts/{documentId} | DELETE /api/used-parts/{documentId} |


## Important Notes (Strapi v5)
- **documentId**: Used as a path parameter for a single entry (e.g., `/api/products/{documentId}`)
- **Numeric id**: If you need to search by the old numeric id, use a query filter, e.g., `/api/products?filters[id][$eq]=1`
- Other query filters can be used as per the Strapi docs, such as sort, pagination, populate.

## Usage Examples
- **Get a list of products:**
  - `GET /api/products`
- **Get a specific product:**
  - `GET /api/products/{documentId}`
- **Search by old id:**
  - `GET /api/products?filters[id][$eq]=1`
- **Create a new customer:**
  - `POST /api/customers`
- **Update a purchase order:**
  - `PUT /api/purchases/{documentId}`
- **Delete a Supplier:**
  - `DELETE /api/suppliers/{documentId}`

## Additional Information
- All endpoints support query strings for filtering, pagination, and populating relations according to Strapi standards.
- For permission settings (Public/Authenticated), refer to the Strapi Admin Panel > Settings > Roles.
- For Authenticated usage, use JWT (login via `/api/auth/local`).

---

> **This information is for the Frontend and Fullstack teams for connecting to the Strapi Backend.**
