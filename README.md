# LuxuryStay Hotel Management System

## How to Run the Project

This project consists of a **Client** (Frontend) and a **Server** (Backend). You need to run them in **two separate terminals**.

### 1. Start the Server (Backend)

Open a terminal and run:

```bash
cd server
npm run dev
```

_The server will start on [http://localhost:5000](http://localhost:5000)_

### 2. Start the Client (Frontend)

Open a **new** terminal and run:

```bash
cd client
npm run dev
```

_The client will start on [http://localhost:5173](http://localhost:5173)_

---

## How to Operate

### 1. Default Login Credentials

I have created an admin account for you to log in immediately:

- **Email**: `admin@example.com`
- **Password**: `password123`

### 2. Features Overview

Once logged in, you can access the following modules via the sidebar:

- **Dashboard**: Overview of hotel statistics (Guests, Bookings, Revenue).
- **Users**: Manage system users (Admins, Managers, Staff).
- **Rooms**: View and manage hotel rooms.
- **Bookings**: Manage guest reservations.
- **Billing / Housekeeping**: (Placeholder pages for future implementation).

### 3. Troubleshooting

- **Connection Error**: If you see connection errors, ensure `npm run dev` is running in **BOTH** `server` and `client` folders in separate terminals.
- **White Screen**: If the client shows a white screen, check the browser console (F12) or the terminal for errors.
