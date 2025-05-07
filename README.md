# 🔥 Phoenix: IMF-Gadget-API

A TypeScript-based RESTful API for managing **gadgets** and **user accounts**, built for secure operations like lifecycle management and controlled self-destruction. Includes full user authentication and session handling.

## Live-Link 

---

## 📬 Postman Collection

Import and test all endpoints using the official Postman collection:
[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://www.postman.com/payload-participant-73420966/workspace/the-wee-lad-public-workspace/collection/40788084-4083b8be-9f13-43ec-a767-7f7c0f19a095?action=share&creator=40788084&active-environment=40788084-e4e66640-3fbc-43f6-a930-3b861f6afc56)
---

## 📦 API Endpoints

### 📁 Gadget Routes

`Base Path: /gadgets`

| Method | Route                           | Description                           |
|--------|----------------------------------|---------------------------------------|
| GET    | `/`                              | Get all gadgets                       |
| POST   | `/`                              | Add a new gadget                      |
| PATCH  | `/`                              | Update an existing gadget             |
| DELETE | `/`                              | Decommission a gadget                 |
| POST   | `/:id/self-destruct`            | Initiate self-destruct (irreversible) |
| POST   | `/:id/request-self-destruct`    | Request self-destruct (reviewable)    |

---

### 👤 User Routes

`Base Path: /users`

| Method | Route       | Description                     |
|--------|-------------|---------------------------------|
| POST   | `/`         | Register a new user             |
| PUT    | `/`         | Update user profile             |
| GET    | `/`         | Get current user info           |
| DELETE | `/`         | Delete user account             |
| POST   | `/login`    | User login (returns JWT)        |
| POST   | `/logout`   | User logout (invalidate token)  |

> 🔐 Protected routes require a valid JWT in the `Authorization: Bearer <token>` header.

---

Based on your `package.json`, project structure, and development setup using TypeScript, Prisma, `tsx`, and `nodemon`, here’s an **improved and professional `🚀 Getting Started` section** tailored for your `Phoenix: IMF-Gadget-API` repo:

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

---

### 1. **Clone the Repository**

```bash
git clone https://github.com/your-username/phoenix-imf-gadget-api.git
cd phoenix-imf-gadget-api
````

---

### 2. **Install Dependencies**

Make sure you have **Node.js** and **npm** installed (recommended Node.js v18+).

```bash
npm install
```

---

### 3. **Set Up Environment Variables**

Create a `.env` file at the root of the project and add the following:

```env
PORT=3000
JWT_SECRET=your_jwt_secret
DB_URI=your_postgresql_database_uri
```

You can also include Prisma-specific configs if needed (e.g. `DATABASE_URL`).

---

### 4. **Run Migrations & Generate Prisma Client**

```bash
npm run migrate     # Runs `prisma migrate dev`
npm run generate    # Generates the Prisma client
```

---

### 5. **Start the Development Server**

```bash
npm run dev
```

Runs the app in development mode using `nodemon` + `tsx`.

---

### 6. **Build for Production (optional)**

```bash
npm run build
npm start
```

Compiles TypeScript into JavaScript (in `dist/`) and starts the server.

---

### 📦 Useful Scripts

| Script            | Description                                 |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Run development server with live reload     |
| `npm run build`   | Generate Prisma client & compile TypeScript |
| `npm start`       | Start compiled JavaScript from `dist/`      |
| `npm run migrate` | Run development DB migrations via Prisma    |
| `npm run write`   | Format code using Prettier                  |

---

Now you're ready to start building with **Phoenix: IMF-Gadget-API**!

```


