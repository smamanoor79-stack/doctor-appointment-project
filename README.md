# Dr. Ahsan Malik — Clinic Appointment Booking Platform

A full-stack dermatology clinic website with a guided patient booking flow and a complete admin dashboard for managing appointments, payments, services, and patient messages.

---

## ✨ Overview

This project is a two-in-one system built for a dermatology clinic:

- **Public website** — A modern, patient-facing site showcasing services, doctor info, before/after results, testimonials, Blogs , Contact and FAQs.
- **Admin dashboard** — A private, password-protected control panel where the clinic can manage appointments, track revenue, review payments, and reply to patient messages in real time.

---

## 🩺 Patient-Facing Features

- Clean, responsive landing page with service highlights and doctor profile
- Interactive before/after result sliders
- Testimonials and FAQ sections
- Multi-step booking wizard:
  1. Select Service
  2. Basic Info
  3. Date & Time
  4. Appointment Type (Chat / Audio Call / Video Call / Clinic Visit)
  5. Payment
  6. Confirmation
- Contact form for general inquiries

## 🔐 Admin Dashboard Features

- **Secure login** — password-protected access with cookie-based sessions
- **Overview page** — live KPIs (today's appointments, pending payments, monthly revenue, new patients), today's queue, upcoming appointments table, and a 7-day revenue chart
- **Appointments management** — search, filter by status/service, create, edit, mark complete, archive, restore, and delete bookings
- **Payment tracking** — inline payment status updates (Verified / Pending / Pay at clinic / Rejected) with transaction reference numbers
- **Messages inbox** — view and reply to patient contact form submissions, with live polling for new messages
- **Services management** — add, edit, and remove clinic services shown on the public site
- **New booking notifications** — bell icon with live unread count and dropdown preview

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Database | [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Charts | [Recharts](https://recharts.org/) |
| Auth | Cookie-based admin session (password protected) |
| Deployment | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (public site pages — Home, About, Services, Blog, Contact, Book)
│   ├── admin/
│   │   ├── layout.jsx          # Sidebar + auth-aware admin shell
│   │   ├── page.jsx            # Dashboard overview
│   │   ├── login/               # Admin login page
│   │   ├── appointments/        # Appointments management
│   │   ├── patients/
│   │   ├── payments/
│   │   ├── services/
│   │   ├── messages/            # Patient messages inbox
│   │   └── settings/
│   └── api/
│       ├── admin/
│       │   ├── login/
│       │   ├── logout/
│       │   └── contact/
│       └── bookings/
├── components/                  # Shared public-site components
├── lib/
│   ├── db.js                    # MongoDB connection helper
│   └── email.js
├── models/                      # Mongoose schemas (Booking, Service, ContactMessage, etc.)
└── proxy.js                     # Route protection for /admin/*
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/smamanoor79-stack/doctor-appointment-project.git
cd <doctor-appointment-project>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
ADMIN_PASSWORD=your_admin_password
```

> ⚠️ Never commit `.env.local` — it's already excluded via `.gitignore`.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public site, and [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin dashboard.

---

## ☁️ Deployment (Vercel)

1. Push this repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/new).
3. Add the environment variables (`MONGODB_URI`, `ADMIN_PASSWORD`) under **Project Settings → Environment Variables**.
4. In MongoDB Atlas, allow network access from anywhere (`0.0.0.0/0`) so Vercel's serverless functions can connect.
5. Deploy 🚀

---

## 📄 License

This project was built by Smama Noor as a personal practice project. All rights reserved.