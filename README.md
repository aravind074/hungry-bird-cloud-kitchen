# 🐦 Hungry Bird – AI Powered Cloud Kitchen

> **Production-ready full-stack cloud kitchen platform** with AI-powered meal personalization, subscription management, real-time order tracking, and multi-role dashboards.

![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Express%20%7C%20MongoDB%20%7C%20Redis%20%7C%20Python-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Features

### Customer
- 📱 Browse menu with filters (dietary, price, category, meal type)
- 🛒 Cart with coupon codes and saved items
- 📅 Subscription plans (Breakfast/Lunch/Dinner – 15/30/90 days)
- 💳 Payments via Razorpay (INR) + Stripe (USD)
- 🗺️ Live GPS delivery tracking (Google Maps)
- ⭐ Ratings & Reviews
- 🔔 Push notifications (FCM)
- 🤖 AI-personalised meal recommendations
- 💰 Loyalty points & referral system

### Admin Dashboard
- 📊 Revenue analytics with charts
- 🍽️ Menu CRUD + inventory management
- 📦 Order management (all statuses)
- 🎟️ Coupon creation & tracking
- 👥 User management with role assignment
- 📈 Demand forecasting powered by AI

### Kitchen Dashboard
- 🔄 Real-time order queue (WebSocket)
- ✅ Order status management
- 📋 Daily subscription schedule
- ⚠️ Low-stock alerts

### Delivery Dashboard
- 📍 Real-time location sharing
- 🗺️ Route optimisation
- 📱 OTP-based delivery confirmation
- 💵 Earnings summary

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Zustand, React Query |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB + Mongoose |
| Cache | Redis (ioredis) |
| Auth | Firebase Auth + JWT (HTTP-only cookies) |
| Payments | Razorpay + Stripe |
| Real-time | Socket.IO |
| Maps | Google Maps API |
| Notifications | Firebase Cloud Messaging |
| AI/ML | Python 3.11, FastAPI, scikit-learn, Prophet, BERT |
| DevOps | Docker, Docker Compose |

---

## 📁 Project Structure

```
hungry-bird/
├── apps/
│   ├── web/          # Next.js 15 frontend
│   └── ai-service/   # Python FastAPI AI service
├── backend/          # Node.js + Express API
├── packages/         # Shared TypeScript types
├── docker/           # Docker utilities
├── docker-compose.yml
└── .env.example
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js ≥ 20
- Python ≥ 3.11
- Docker + Docker Compose

### 1. Clone & Configure
```bash
git clone https://github.com/your-org/hungry-bird.git
cd hungry-bird

# Copy and fill environment variables
cp .env.example .env
```

### 2. Fill Required Keys in `.env`
- Firebase project credentials (from Firebase Console)
- Razorpay/Stripe API keys
- Google Maps API key
- MongoDB URI (Atlas or local)

### 3. Start with Docker
```bash
docker-compose up -d
```

### 4. Or Run Locally
```bash
# Terminal 1: Backend
cd backend && npm install && npm run dev

# Terminal 2: Frontend
cd apps/web && npm install && npm run dev

# Terminal 3: AI Service
cd apps/ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 5. Open
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Service Docs**: http://localhost:8000/docs
- **MongoDB UI**: http://localhost:8081 (with `--profile dev-tools`)

---

## 🔐 Authentication

| Method | Description |
|--------|-------------|
| Email/Password | Standard registration with bcrypt |
| Google OAuth | Firebase one-click sign in |
| Phone OTP | Firebase phone verification |
| JWT | HTTP-only cookies + refresh token rotation |

### Roles
| Role | Access |
|------|--------|
| `customer` | Menu, cart, orders, subscriptions |
| `admin` | All + analytics, user management |
| `kitchen_staff` | Order queue, inventory |
| `delivery_partner` | Assignments, location updates |

---

## 💰 Subscription Plans

| Plan | 15 Days | 30 Days | 90 Days |
|------|---------|---------|---------|
| Breakfast | ₹1,799 | ₹2,999 | ₹7,499 |
| Lunch | ₹2,699 | ₹4,499 | ₹11,999 |
| Dinner | ₹2,699 | ₹4,499 | ₹11,999 |
| Full Day | ₹5,999 | ₹9,999 | ₹24,999 |

---

## 🤖 AI/ML Modules

| Module | Algorithm | Status |
|--------|-----------|--------|
| Recommendations | Collaborative + Content-Based Filtering | Scaffold ready |
| ETA Prediction | Random Forest | Placeholder (distance-based) |
| Demand Forecasting | Prophet | Placeholder |
| Sentiment Analysis | DistilBERT | Placeholder |
| Inventory Prediction | LSTM | Placeholder |
| Dynamic Pricing | Gradient Boosting | Placeholder |

---

## 📡 API Endpoints

See [API Documentation](http://localhost:5000/api-docs) when running locally.

---

## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Next.js app |
| Backend | 5000 | Express API |
| AI Service | 8000 | FastAPI ML |
| MongoDB | 27017 | Database |
| Redis | 6379 | Cache |
| Mongo UI | 8081 | Dev tool |

---

## 📄 License

MIT License © 2026 Hungry Bird Team

---

*Built with ❤️ in India 🇮🇳*
