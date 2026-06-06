# Nutech Integrasi Backend Test

## Deskripsi

Project ini merupakan implementasi Backend API menggunakan ExpressJS dan PostgreSQL berdasarkan dokumentasi Swagger yang diberikan oleh Nutech Integrasi.

API yang diimplementasikan meliputi:

* Registrasi User
* Login User (JWT Authentication)
* Profile User
* Update Profile
* Upload Profile Image
* Banner
* Services
* Balance
* Top Up Balance
* Transaction
* Transaction History

---

## Tech Stack

* Node.js
* ExpressJS
* PostgreSQL
* JWT (JSON Web Token)
* bcrypt
* Multer

---

## Struktur Project

```text
.
├── config
│   └── db.js
│
├── controllers
│   ├── authController.js
│   ├── profileController.js
│   ├── infoController.js
│   └── transactionController.js
│
├── middleware
│   └── authMiddleware.js
│   └── uploadMiddleware.js
│
├── routes
│   ├── authRoute.js
│   ├── profileRoute.js
│   ├── infoRoute.js
│   └── transactionRoute.js
│
├── uploads
│
├── sql
│   └── schema.sql
│
├── .env.example
├── .env
├── app.js
├── server.js
├── package.json
└── README.md
```

---

## Instalasi

Clone repository:

```bash
git clone https://github.com/adam6518/nutech_backend_test
```

Masuk ke project:

```bash
cd nutech-integrasi-backend-test
```

Install dependency:

```bash
npm install
```

## Setup Database

Jalankan file:

```sql
sql/schema.sql
```

untuk membuat seluruh tabel yang dibutuhkan.

---

## Menjalankan Project

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

---

## Authentication

Endpoint private menggunakan JWT Bearer Token.

Contoh Header:

```http
Authorization: Bearer <jwt_token>
```

Token diperoleh dari endpoint:

```http
POST /login
```

---

## Endpoint API

### Auth

| Method | Endpoint      |
| ------ | ------------- |
| POST   | /registration |
| POST   | /login        |

### Profile

| Method | Endpoint        |
| ------ | --------------- |
| GET    | /profile        |
| PUT    | /profile/update |
| PUT    | /profile/image  |

### Banner

| Method | Endpoint |
| ------ | -------- |
| GET    | /banner  |

### Services

| Method | Endpoint  |
| ------ | --------- |
| GET    | /services |

### Balance

| Method | Endpoint |
| ------ | -------- |
| GET    | /balance |

### Top Up

| Method | Endpoint |
| ------ | -------- |
| POST   | /topup   |

### Transaction

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | /transaction         |
| GET    | /transaction/history |

---

## Postman Collection

Postman Collection tersedia pada folder:

```text
docs/
```

File:

```text
Nutech Backend Test.postman_collection.json
```

---

## Database Design

Database schema tersedia pada:

```text
sql/schema.sql
```

---
