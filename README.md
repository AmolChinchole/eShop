# eShop - MERN E-commerce Platform

Full-stack e-commerce application built with MongoDB, Express, React, and Node.js.

## 🚀 Live Demo

- **Frontend:** [Add your Render URL here after deployment]
- **Backend API:** [Add your Render backend URL here]

## 📋 Features

- 🛍️ Product browsing with search and category filters
- 🛒 Shopping cart functionality
- ❤️ Wishlist management
- 🔐 User authentication (JWT + OTP login)
- 💳 Stripe payment integration
- 📱 Responsive design with Tailwind CSS
- 🖼️ Dynamic image loading with fallbacks

## 🛠️ Tech Stack

### Frontend
- React 18.2.0
- Vite 7.1.10
- React Router v7
- Axios
- Tailwind CSS
- React Toastify

### Backend
- Node.js (>=18)
- Express 4.21
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt
- Stripe
- Nodemailer

## 📦 Project Structure

```
eShop/
├── backend/              # Express API server
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Entry point
│   └── package.json
├── my-app/              # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React Context (Auth, Cart, Wishlist)
│   │   ├── api/         # API client
│   │   └── utils/       # Utilities
│   ├── public/
│   └── package.json
└── render.yaml          # Render deployment config
```

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Render.

### Quick Deploy Steps:

1. **Backend:**
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
   - Add environment variables (MONGO_URI, JWT_SECRET, etc.)

2. **Frontend:**
   - Root Directory: `my-app`
   - Build: `npm install && npm run build`
   - Publish Directory: `dist`
   - Add VITE_API_URL environment variable

## 💻 Local Development

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account
- Git

### Backend Setup

```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env

# Edit .env with your credentials
# Add: MONGO_URI, JWT_SECRET, STRIPE_SECRET_KEY

# Start development server
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```powershell
# Navigate to frontend
cd my-app

# Install dependencies
npm install

# Create .env file
$env:VITE_API_URL="http://localhost:5000/api"

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🔐 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=sk_test_your_stripe_key
PORT=5000
```

### Frontend
```env
VITE_API_URL=http://localhost:5000/api
```

## 📚 API Endpoints

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `POST /api/users/send-otp` - Send OTP
- `POST /api/users/verify-otp` - Verify OTP

### Wishlist
- `GET /api/wishlist/my-wishlist` - Get user wishlist
- `POST /api/wishlist/add/:productId` - Add to wishlist
- `DELETE /api/wishlist/remove/:productId` - Remove from wishlist

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders

### Payment
- `POST /api/payment/create-payment-intent` - Create Stripe payment

## 🧪 Testing

```powershell
# Test backend health
curl http://localhost:5000/health

# Test products endpoint
curl http://localhost:5000/api/products
```

## 📝 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🐛 Common Issues

### Port Already in Use
```powershell
# Find and kill process on port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
```

### MongoDB Connection Failed
- Check MongoDB Atlas whitelist (allow 0.0.0.0/0)
- Verify credentials in MONGO_URI
- Check network connectivity

### CORS Errors
- Verify frontend URL in backend CORS config
- Check VITE_API_URL matches backend URL

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Amol Chinchole**
- GitHub: [@AmolChinchole](https://github.com/AmolChinchole)
- Repository: [eShop](https://github.com/AmolChinchole/eShop)

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Render for deployment platform
- Stripe for payment processing
- Amazon for product images

---

**Built with ❤️ using the MERN Stack**
