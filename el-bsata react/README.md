# 🍲 Elbasata Restaurant & Order Hub ('البساطة`)

Elbasata (Midst of Simplicity) is a premium, full-stack, single-page web application built with **React**, **Vite**, **Express**, and **Tailwind CSS**. It combines traditional heritage culinary experiences with a seamless, highly animated online ordering engine. It features dynamic cart calculation, user geolocation capturing, automated email workflow generation, and a secure, password-protected real-time administrative monitoring panel.

---

## ✨ Features

- **🎨 Modern Aesthetic Design**: Authentic warm thematic colors, elegant typography with spacious negative space, and smooth, purpose-driven micro-animations powered by `motion`.
- **🛒 Dynamic Cart System**: Fluid addition, subtraction, deletion, and real-time computation of order pricing and custom client preferences.
- **📍 Precise Geolocation Pinning**: On checkout, clients can automatically attach their exact GPS coordinates (`latitude` and `longitude`), mapping directly to Google Maps for delivery accuracy.
- **✉️ Automated email-Drafting System**: An advanced automated backend drafting module that designs beautiful, responsive HTML emails to alert the restaurant kitchen of incoming orders.
- **🔒 Secure Admin Portal**: A clean, stylish gateway page protecting the administrative monitoring dashboard, requiring username/password authentication (`admin` / `123`).
- **📊 Interactive Double-Pane Logs Dashboard**: 
  - **Left Pane:** Comprehensive lists of incoming system orders, user details, and active GPS coordinates with a map router button.
  - **Right Pane:** Real-time visual iframe preview of the accurate HTML email rendered for the kitchen staff, detailing standard recipient logs.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, `motion/react` (for fluid transitions), `lucide-react` (for icons).
- **Backend (Server)**: Node.js, Express, `tsx`, and `esbuild` for fast production packaging.
- **Module System**: Full-stack integration combining front-end asset-serving and back-end routers on Port `3000`.

---

## 🚀 Getting Started Locally

Follow these steps to run the application on your computer:

### 1. Prerequisite
Ensure you have **Node.js** (v18 or higher) and **npm** installed.

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/wasat-elbasata.git
cd wasat-elbasata
npm install