 
# Pharmacy POS — Frontend UI

A modern, responsive Point of Sale (POS) frontend for a single retail pharmacy or drug shop in Uganda. The interface is designed to simplify medicine sales, stock management, expiry tracking, supplier management, and pharmacy reporting.

## 1. Project Overview

The Pharmacy POS frontend provides an intuitive interface for pharmacy staff to manage daily operations efficiently.

### Objectives

- Provide a clear dashboard showing pharmacy performance.
- Support fast medicine search and checkout.
- Display medicine stock levels and expiry alerts.
- Provide interfaces for suppliers, purchases, and inventory.
- Support role-based navigation for pharmacy staff.
- Generate sales and inventory reports.
- Provide a responsive interface for desktop, tablet, and mobile devices.

## 2. Technology Stack

| Technology | Purpose |
|---|---|
| React | Build reusable UI components |
| JavaScript (ES6+) | Application logic |
| Vite | Development server and build tool |
| React Router | Page navigation |
| CSS3 | Styling and responsive layouts |
| Lucide React | Interface icons |
| Bootstrap 5 (optional) | Responsive UI utilities |
| Recharts (optional) | Dashboard charts |
| Fetch API | Communicate with an application API |

**Database note:** SQLite is not accessed directly by a browser-based React frontend. When real data storage is introduced, the frontend must communicate with a backend API or another trusted application layer.

## 3. Main UI Features

### 3.1 Login Page

- Username or email input.
- Password input with show/hide option.
- Login button.
- Validation and error messages.
- Loading indicator.
- Access control based on user role.

### 3.2 Dashboard

The dashboard provides an overview of pharmacy operations.

Summary cards:
- Today's sales.
- Number of sales transactions.
- Total medicines.
- Low-stock medicines.
- Medicines nearing expiry.
- Expired stock requiring attention.

Additional sections:
- Recent sales.
- Low-stock medicine list.
- Expiry alerts.
- Sales chart.
- Quick actions for new sale, adding medicine, and recording stock.

### 3.3 Medicine Management

The medicine management page should include:

- Medicine search.
- Search by name, code, or barcode.
- Category and status filters.
- Medicine table.
- Add medicine form.
- Edit medicine form.
- Medicine details view.
- Pagination.
- Empty, loading, and error states.

Suggested columns:

| Column | Description |
|---|---|
| Medicine | Name of the medicine |
| Code | Unique medicine or product code |
| Category | Medicine classification |
| Unit price | Selling price |
| Stock | Available quantity |
| Status | In stock, low stock, or out of stock |
| Actions | View, edit, or manage |

### 3.4 Inventory Management

The inventory UI should support:

- Stock overview.
- Batch management.
- Batch number and expiry date display.
- Stock adjustment forms.
- Stock movement history.
- Low-stock alerts.
- Expired and near-expiry stock filters.

Use clear status labels and never rely on colour alone to communicate stock status.

### 3.5 Point of Sale (POS)

The POS page is the main sales interface.

It should include:

- Medicine search or barcode entry.
- Search results.
- Shopping cart.
- Quantity adjustment.
- Item removal.
- Subtotal and total calculation.
- Payment method selection.
- Amount received and change calculation for cash payments.
- Checkout confirmation.
- Receipt preview and printing.

The interface should make common sales tasks quick and straightforward.

### 3.6 Suppliers

The suppliers page should provide:

- Supplier list.
- Supplier search.
- Add supplier form.
- Edit supplier form.
- Supplier contact details.
- Purchase history.
- Supplier details view.

### 3.7 Purchases

The purchases interface should support:

- Recording stock purchases.
- Selecting a supplier.
- Adding medicine items.
- Entering quantities and unit costs.
- Recording batch numbers and expiry dates.
- Reviewing purchase totals.
- Displaying purchase history.

### 3.8 Prescriptions

The prescription interface should provide:

- Prescription record search.
- Patient and prescription reference fields.
- Prescriber details.
- Prescribed medicine details.
- Dispensing status.
- Prescription history.

Prescription-only medicines must follow applicable dispensing rules. The interface should not permit a user to bypass required authorization.

### 3.9 Reports

The reports section should include:

- Daily sales.
- Sales by date range.
- Best-selling medicines.
- Inventory valuation.
- Low-stock report.
- Expiring medicines.
- Expired stock.
- Purchase history.

Provide date filters, summary figures, tables, and export or print controls where appropriate.

### 3.10 User Management

For authorized administrators:

- View users.
- Create user accounts.
- Edit user details.
- Assign roles.
- Activate or deactivate accounts.
- Display account status.

Suggested roles include System Administrator, Pharmacist or Authorized Dispenser, Cashier, Storekeeper, and Pharmacy Manager.

### 3.11 Audit Logs

The audit interface should display important activities such as:

- User login events.
- Medicine changes.
- Stock adjustments.
- Completed sales.
- Voided or reversed transactions.
- User and role changes.

Audit records should be protected against unauthorized modification.

## 4. UI Design System

### Colour palette

| Purpose | Colour |
|---|---|
| Primary blue | `#2563EB` |
| Dark navy | `#0F172A` |
| Page background | `#F8FAFC` |
| Card background | `#FFFFFF` |
| Primary text | `#1E293B` |
| Secondary text | `#64748B` |
| Success | `#16A34A` |
| Warning | `#D97706` |
| Danger | `#DC2626` |
| Borders | `#E2E8F0` |

### Layout

Use a dashboard layout with:

- A fixed or collapsible sidebar on desktop.
- A top navigation bar.
- A main content area.
- A page title and short description.
- Search and filter controls.
- Summary cards where useful.
- Consistent tables, forms, dialogs, and buttons.

On mobile devices, the sidebar should collapse into a navigation drawer and tables should remain usable through responsive layouts or horizontal scrolling.

### UI principles

1. Keep navigation consistent across pages.
2. Use readable typography and adequate spacing.
3. Keep forms simple and provide validation feedback.
4. Confirm destructive actions such as deleting or voiding records.
5. Show loading, success, error, and empty states.
6. Use accessible labels, keyboard navigation, and visible focus indicators.
7. Avoid displaying unnecessary information on operational screens.
8. Clearly distinguish expired, low-stock, and available medicines.

## 5. Frontend Architecture

The application uses a feature-based folder structure. Each feature owns its pages and feature-specific components.

```text
pharmacy-pos/
├── public/
│   ├── images/
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── App.jsx
│   │   ├── router.jsx
│   │   └── providers.jsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Topbar.jsx
│   │   │   └── PageHeader.jsx
│   │   └── feedback/
│   │       ├── EmptyState.jsx
│   │       └── ErrorMessage.jsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── authService.js
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.jsx
│   │   │   └── components/
│   │   ├── medicines/
│   │   │   ├── MedicinesPage.jsx
│   │   │   ├── MedicineForm.jsx
│   │   │   └── medicineService.js
│   │   ├── inventory/
│   │   │   ├── InventoryPage.jsx
│   │   │   ├── BatchesPage.jsx
│   │   │   └── inventoryService.js
│   │   ├── sales/
│   │   │   ├── POSPage.jsx
│   │   │   ├── SalesHistoryPage.jsx
│   │   │   └── salesService.js
│   │   ├── suppliers/
│   │   ├── purchases/
│   │   ├── prescriptions/
│   │   ├── reports/
│   │   ├── users/
│   │   └── audit/
│   ├── services/
│   │   └── apiClient.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   │   ├── global.css
│   │   ├── variables.css
│   │   └── layout.css
│   ├── mocks/
│   │   └── mockData.js
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── index.html
└── README.md
```

Keep components reusable and small. Feature-specific logic belongs inside the relevant feature folder, while shared buttons, tables, layout elements, and form controls belong in `components/`.

## 6. Navigation and Routes

| Route | Page |
|---|---|
| `/login` | Login |
| `/dashboard` | Dashboard |
| `/medicines` | Medicine management |
| `/inventory` | Inventory overview |
| `/inventory/batches` | Batch and expiry management |
| `/inventory/movements` | Stock movement history |
| `/sales/new` | Point of Sale |
| `/sales/history` | Sales history |
| `/suppliers` | Supplier management |
| `/purchases` | Purchase management |
| `/prescriptions` | Prescription records |
| `/reports/sales` | Sales reports |
| `/reports/inventory` | Inventory reports |
| `/users` | User management |
| `/audit-logs` | Audit logs |
| `*` | Not found page |

Protect restricted routes with authentication and role-based authorization. Hiding a navigation item is not sufficient security; the backend must independently enforce permissions.

## 7. Installation and Setup

### Prerequisites

Install:

- Node.js, preferably a current LTS release.
- npm.
- Visual Studio Code or another code editor.
- A modern web browser.

### Create the project

```bash
npm create vite@latest pharmacy-pos -- --template react
cd pharmacy-pos
npm install
```

### Install dependencies

```bash
npm install react-router-dom lucide-react
```

Optional packages:

```bash
npm install bootstrap
npm install recharts
```

### Start the development server

```bash
npm run dev
```

Open the local address displayed by Vite in your browser.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## 8. Environment Configuration

Create a `.env.example` file:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

If using an API, create a local `.env` file with the appropriate development URL.

The example above does not require a particular backend framework. Replace the URL with the address of the application API you eventually choose.

**Security:** Never place database passwords, private API keys, or other server secrets in frontend environment variables. Variables prefixed with `VITE_` are exposed to the browser.

## 9. Frontend Data Handling

The frontend should separate the UI from data access.

Example structure:

```text
MedicinePage
    |
    v
MedicineService
    |
    v
API Client
    |
    v
Application API
    |
    v
SQLite Database
```

For the first UI prototype, use mock data from `src/mocks/mockData.js`. This allows the dashboard, tables, forms, and POS layout to be developed before the database is connected.

When the application is connected to real storage, replace the mock services with API calls while preserving the same component interfaces where practical.

For sales, stock adjustments, and prescription dispensing, the application layer must validate and commit related changes consistently. Frontend calculations alone cannot guarantee stock accuracy.

## 10. Development Guidelines

- Use functional React components and hooks.
- Use consistent naming conventions.
- Keep page components separate from reusable UI components.
- Avoid duplicating styles and business logic.
- Use controlled form inputs where appropriate.
- Validate user input and show useful error messages.
- Keep money values formatted consistently in Uganda shillings (UGX).
- Display dates consistently and clearly.
- Provide confirmation before risky actions.
- Use mock data only for development and demonstrations.
- Add tests for important calculations and workflows.

## 11. Responsive Design Requirements

The UI should support:

- Desktop: full sidebar and multi-column dashboard.
- Tablet: compact navigation and flexible card layouts.
- Mobile: collapsible navigation, stacked forms, readable summaries, and usable sales controls.

The POS interface should prioritize the medicine search, cart, totals, and checkout controls on smaller screens.

## 12. Testing Checklist

Before considering the frontend ready for integration, verify:

- [ ] Login page displays validation errors.
- [ ] Sidebar links navigate to the correct pages.
- [ ] Unauthorized users cannot access restricted UI routes.
- [ ] Search and filters work with sample data.
- [ ] Forms validate required fields.
- [ ] Tables show loading, empty, and error states.
- [ ] POS totals update when quantities change.
- [ ] Cash payment change is calculated correctly.
- [ ] Expiry and low-stock indicators display correctly.
- [ ] Layout works at desktop, tablet, and mobile widths.
- [ ] Production build completes without errors.
- [ ] No sensitive data is stored in browser-visible code.

## 13. Current Limitations

Until the application layer and database are integrated:

- Data may be temporary or mock data.
- Login may be simulated.
- Sales may not persist after a refresh.
- Reports may use sample values.
- User permissions are not secure unless enforced by a trusted application layer.

Do not use a mock-only prototype for real pharmacy transactions.

## 14. Future Improvements

- Barcode scanner integration.
- Receipt printing.
- Real-time inventory updates.
- CSV or PDF report exports.
- Low-stock notifications.
- Offline-capable workflows where appropriate.
- Automated database backups.
- Automated tests and deployment pipelines.
- Integration with approved pharmacy and regulatory workflows.

## 15. Important Pharmacy Considerations

The software should support safe dispensing and traceable inventory management. Expired or quarantined batches must not be sold. Where multiple batches exist, stock selection should follow the configured First-Expiry-First-Out (FEFO) policy.

Verify applicable Ugandan pharmacy, medicines, prescription, recordkeeping, and data-protection requirements before using the software operationally.

## 16. Project Status

**Current phase:** Frontend UI development and prototyping.

**Next milestones:**
1. Set up the React and Vite project.
2. Build the shared dashboard layout.
3. Create the login and dashboard pages.
4. Implement medicine and inventory screens.
5. Build the POS interface.
6. Complete suppliers, purchases, prescriptions, and reports.
7. Integrate the trusted application layer and database.
8. Test security, workflows, and responsive layouts.

---

**Project:** Pharmacy POS  
**Frontend:** React + JavaScript + Vite  
**Database:** SQLite through a trusted application layer  
**Purpose:** Pharmacy and drug-shop sales and inventory management
