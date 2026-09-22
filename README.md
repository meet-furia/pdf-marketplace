# PDF Marketplace Platform

A full-stack digital marketplace for buying and selling PDF-based interview preparation resources. The project was built around the idea of creating a platform where sellers can upload interview question PDFs, admins can review the content before publishing, and customers can securely purchase and access the PDFs from their personal library.

This is more than a simple CRUD application. It includes authentication, role-based authorization, seller workflows, admin moderation, cart and checkout flows, payment verification, secure file storage, and controlled digital access after purchase.

## Project Idea

The goal of this project is to solve a practical problem: interview preparation material is often scattered across different sources, and creators do not always have a simple way to sell curated PDF resources.

This platform provides a marketplace-style solution where:

- Sellers can upload PDF resources such as interview questions, notes, guides, and preparation material.
- Admins can verify uploaded products before they become publicly available.
- Customers can browse approved PDFs, add them to cart, complete payment, and access purchased content securely.

## Key Features

### Customer

- Browse approved PDF products.
- View product details.
- Add products to cart.
- Complete checkout using Razorpay.
- Access purchased PDFs from a personal library.
- Download purchased files through backend-controlled access.

### Seller

- Upload digital products with metadata, product files, and thumbnails.
- Manage uploaded products.
- View seller dashboard details.
- Add payment details for future seller payout workflows.
- Submit products for admin approval before public listing.

### Admin

- View products pending approval.
- Approve valid products.
- Reject products with a reason.
- Control what becomes visible in the marketplace.

## Tech Stack

### Backend

- Java 17
- Spring Boot
- Spring Security
- OAuth2 Resource Server
- Supabase JWT authentication
- Spring Data JPA
- PostgreSQL
- Razorpay Java SDK
- Cloudflare R2 using S3-compatible APIs
- Maven

### Frontend

- React
- Vite
- React Router
- Supabase JavaScript client
- Tailwind CSS

## High-Level Architecture

```text
React + Vite Frontend
        |
        | REST API calls with Supabase JWT
        v
Spring Boot Backend
        |
        |-- Spring Security validates Supabase JWT
        |-- Controllers expose customer, seller, and admin APIs
        |-- Services contain marketplace business logic
        |-- Repositories persist data using JPA
        |
        |------------------> PostgreSQL Database
        |
        |------------------> Razorpay Payment Gateway
        |
        |------------------> Cloudflare R2 Storage
        |
        v
Secure PDF Access After Purchase
```

## Backend Architecture

The backend follows a layered Spring Boot architecture:

```text
Controller Layer
   |
Service Layer
   |
Repository Layer
   |
PostgreSQL Database
```

### Controller Layer

The controller layer exposes REST APIs for different user flows:

- Customer APIs for products, cart, checkout, orders, and library access.
- Seller APIs for product uploads, product management, dashboard data, and payment details.
- Admin APIs for reviewing, approving, and rejecting products.

### Service Layer

The service layer contains the main business logic:

- User registration and current user resolution.
- Product upload and update logic.
- File validation for product files and thumbnails.
- Cart and checkout processing.
- Razorpay order creation and payment verification.
- Invoice generation.
- Purchased PDF access creation.
- Secure download URL generation.
- Admin product approval and rejection.

### Repository Layer

Spring Data JPA repositories manage persistence for:

- Users
- Products
- Cart and cart items
- Orders and order items
- Payments
- Razorpay payment records
- Invoices
- Purchased PDF records
- Purchased PDF access
- Seller payment details

## Authentication And Authorization

Authentication is handled using Supabase Auth. When a user logs in, Supabase issues a JWT. The frontend sends this token to the backend with API requests:

```text
Authorization: Bearer <supabase_jwt>
```

The backend uses Spring Security as a stateless OAuth2 resource server. It validates Supabase JWTs using the Supabase JWK set URL and protects all private APIs.

Authorization is enforced based on user context and role-specific workflows:

- Public users can browse approved products.
- Customers can access cart, checkout, orders, and purchased PDFs.
- Sellers can manage only their own uploaded products.
- Admins can approve or reject seller-submitted products.
- Download access is granted only after successful purchase verification.

## Product Upload Flow

```text
Seller uploads product details, PDF file, and thumbnail
        |
Backend validates file type and size
        |
File is uploaded to Cloudflare R2
        |
Product metadata is saved in PostgreSQL
        |
Product status is set to PENDING
        |
Admin reviews the product
        |
Approved products become visible to customers
```

This ensures that sellers cannot directly publish content without review.

## Checkout And Payment Flow

```text
Customer adds products to cart
        |
Customer starts checkout
        |
Backend creates or reuses a pending order
        |
Backend creates Razorpay payment details
        |
Customer completes payment on frontend
        |
Backend verifies Razorpay payment
        |
Order is marked successful
        |
Invoice is generated
        |
Purchased PDF access is created
        |
Customer can access PDFs from library
```

Payment success is verified on the backend, which is important because frontend payment responses should not be trusted directly.

## Secure PDF Access Flow

Purchased PDFs are not exposed as public files. Access is controlled through the backend:

```text
Customer requests PDF download
        |
Backend checks authentication
        |
Backend checks whether the user purchased the product
        |
Backend generates a secure download response
        |
Customer receives access to the file
```

This protects paid content from unauthorized downloads.

## Database Design Overview

The database is designed around marketplace entities:

- `UserEntity` stores user profile and role/status data.
- `ProductEntity` stores seller-uploaded product metadata and approval status.
- `CartEntity` and `CartItemEntity` manage customer cart state.
- `OrderEntity` and `OrderItemEntity` track purchases.
- `PaymentEntity` and `RazorpayPaymentEntity` track payment attempts and verification data.
- `InvoiceEntity` stores invoice information after checkout.
- `PurchasedPdfEntity` and `PurchasedPdfAccessEntity` control post-purchase access.
- `SellerPaymentDetailsEntity` stores seller payout-related details.

## Folder Structure

```text
pdf-marketplace
|
|-- backend/pdf-marketplace
|   |-- src/main/java/com/meet/pdf_marketplace
|   |   |-- config
|   |   |-- controller
|   |   |-- dto
|   |   |-- entity
|   |   |-- enums
|   |   |-- exception
|   |   |-- repository
|   |   |-- service
|   |   |-- util
|   |
|   |-- src/main/resources
|   |-- src/test/java
|   |-- pom.xml
|
|-- frontend/pdf-marketplace
|   |-- src
|   |   |-- app
|   |   |-- components
|   |   |-- hooks
|   |   |-- lib
|   |   |-- pages
|   |   |-- services
|   |
|   |-- package.json
```

## Local Setup

### Backend

1. Go to the backend folder:

```bash
cd backend/pdf-marketplace
```

2. Configure local properties:

```bash
cp src/main/resources/application-local.properties.example src/main/resources/application-local.properties
```

3. Update the local configuration with:

- PostgreSQL database URL, username, and password
- Supabase project URL and JWK set URL
- Cloudflare R2 credentials
- Razorpay key ID and key secret

4. Run the backend:

```bash
mvn spring-boot:run
```

By default, the backend runs on:

```text
http://localhost:8081
```

### Frontend

1. Go to the frontend folder:

```bash
cd frontend/pdf-marketplace
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend:

```bash
npm run dev
```

## Environment Variables

The backend expects configuration for:

- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `SUPABASE_URL`
- `SUPABASE_JWT_ISSUER_URI`
- `CLOUDFLARE_R2_ACCOUNT_ID`
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `CLOUDFLARE_R2_BUCKET_NAME`
- `CLOUDFLARE_R2_ENDPOINT`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_CURRENCY`

## Testing

The backend includes tests for important service-level behavior such as:

- Product service logic
- Seller payment details validation
- File upload validation
- Spring Boot application context loading

Run backend tests with:

```bash
cd backend/pdf-marketplace
mvn test
```

## Interview Explanation

A concise way to explain this project in an interview:

> I built a full-stack digital marketplace for interview preparation PDFs. The frontend is built with React and Vite, while the backend is a Spring Boot REST API. Authentication is handled through Supabase, and the backend validates Supabase JWTs using Spring Security. The platform supports customer, seller, and admin workflows. Sellers can upload PDF products, admins can approve or reject them, and customers can purchase products using Razorpay. After successful backend payment verification, the system creates purchased PDF access and allows secure file downloads from Cloudflare R2.

## What This Project Demonstrates

- Full-stack application development
- REST API design
- Authentication and authorization using Supabase JWTs
- Role-based user workflows
- Payment gateway integration
- Secure digital file storage and delivery
- Database modeling with JPA entities and relationships
- Clean service-layer business logic
- Admin moderation workflow
- Real-world marketplace architecture

## Future Improvements

- Add seller payout automation.
- Add product ratings and reviews.
- Add search, filtering, and category-based discovery.
- Add email notifications for purchases and product approval status.
- Add analytics for sellers and admins.
- Add production deployment using Docker and CI/CD.
