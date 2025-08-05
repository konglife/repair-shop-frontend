## **Project Brief: Back-office Dashboard for Repair Shop**

### **Executive Summary**
This project involves creating a frontend application in the form of a back-office dashboard for a repair shop. The goal is to connect to an existing backend system on Strapi. The primary user is the sole owner of the shop. The system will summarize key business data, such as financials, product stock, income-expenses, and profits from repairs and sales. Additionally, it will have full data management (CRUD) capabilities and the ability to export summary reports as PDF files.

### **Problem Statement**
The repair shop owner currently manages crucial business data through a manual process using a notebook. This includes recording purchase orders, checking stock, logging repair and sales transactions, and summarizing daily/monthly income and expenses. These processes are not only time-consuming and labor-intensive but also lack a real-time overview, leading to delayed business decisions and risks from data inaccuracies.

### **Proposed Solution**
We will build a web application, a Back-office Dashboard, designed specifically for you. This application will serve as a central hub for managing and displaying all data from the existing backend system (Strapi API). The main approach is to have a summary dashboard, a digital data management system (CRUD) for all sections, and an automated reporting system to reduce manual workload and increase data accuracy.

### **Target Users**
**Primary User Segment: Shop Owner/Main User**
* **Profile:** The sole owner and operator of a small repair shop, responsible for all aspects of the business.
* **Needs & Pain Points:** Needs to reduce manual workload, wants a real-time overview of the business, and struggles with consolidating scattered information.
* **Goals:** To have a centralized data management system, save time, and gain insights for better decision-making.

### **Goals & Success Metrics**
* **Business Objectives:** Reduce data entry time, increase the accuracy of financial data, and enhance decision-making capabilities.
* **User Success Metrics:** Able to view the daily business overview in 1 minute, generate monthly reports in a few clicks, and quickly search for old data.
* **KPIs:** Reduce monthly report generation time (< 5 minutes), reduce manual data entry (Target: 0), increase data accuracy.

### **MVP Scope**
* **Core Features:** Login system, a simple Dashboard (summarizing income-expenses), and basic CRUD systems in the following order: 1. Products, 2. Stock, 3. Purchases, 4. RepairJobs, 5. Sales.
* **Out of Scope for MVP:** PDF export, advanced dashboard, and CRUD for supplementary data (Customers, Suppliers, etc.).
* **MVP Success Criteria:** Able to record repairs/sales through the system, the dashboard displays correct revenue figures, and the notebook is no longer needed.

### **Post-MVP Vision**
* **Phase 2:** Add PDF export feature, full CRUD for all sections, and an advanced dashboard.
* **Long-term:** Develop into a comprehensive repair shop management system that can track customer history.
* **Opportunities:** Automated stock alert system.

### **Technical Considerations**
* **Backend:** Strapi v5 (existing)
* **Frontend:** Next.js (React)
* **Styling:** MUI (Material-UI)
* **Integration:** Connect via REST API, authenticate with JWT, and manage Error Handling according to the attached documents.

### **Constraints & Assumptions**
* **Constraints:** Limited budget (focus on free resources), no clear timeline, the developer is the shop owner with assistance from Claude Code.
* **Assumptions:** The Strapi API is stable, the API documentation is correct, and the user is willing to learn development.

### **Risks & Open Questions**
* **Key Risks:** Developer's learning curve, potential complexity in API integration, and scope creep.
* **Open Questions (Answered):**
    * **Timeline:** No fixed timeline is set.
    * **Design:** Use a basic, modern, and beautiful design from MUI.
    * **Data Migration:** No old data will be imported; starting fresh with all new data.

### **Appendices**
* **References:** API_ENDPOINTS.md, AUTH_FLOW.md, ERROR_HANDLING.md