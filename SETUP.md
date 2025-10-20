# World Cup 2026 Betting App - Setup Guide

## 🚀 Quick Start

### 1. Environment Configuration

Copy the `env.example` file to `.env` in the root directory:

```bash
cp env.example .env
```

### 2. Install Dependencies

```bash
# Install all dependencies (root, server, and frontend)
npm run install:all

# Or install individually:
npm install                    # Root dependencies
cd server && npm install      # Server dependencies
cd ../front-end && npm install --legacy-peer-deps  # Frontend dependencies
```

### 3. Environment Variables

Edit the `.env` file with your configuration:

#### Essential Variables (Required)
```env
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Security
CORS_ORIGIN=http://localhost:3000
SESSION_SECRET=your-session-secret-key
```

#### Optional Variables (For Full Features)

**Google OAuth (for Google login):**
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

**OpenAI (for AI predictions):**
```env
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o
```

**Blockchain (for crypto payments):**
```env
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/your-infura-project-id
SOLANA_RPC_URL=https://api.devnet.solana.com
```

### 4. Run the Application

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately:
npm run server:dev    # Backend only (port 5000)
npm run client:dev    # Frontend only (port 3000)
```

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ 
- npm 8+

### Project Structure
```
epl-betting-app/
├── front-end/          # React frontend
├── server/            # Express.js backend
├── package.json       # Root package.json
├── env.example        # Environment template
└── SETUP.md          # This file
```

### Available Scripts

**Root Directory:**
- `npm run dev` - Start both frontend and backend
- `npm run server:dev` - Start backend only
- `npm run client:dev` - Start frontend only
- `npm run build` - Build frontend for production
- `npm run install:all` - Install all dependencies

**Server Directory:**
- `npm run dev` - Start server with nodemon
- `npm start` - Start server in production mode
- `npm test` - Run tests

**Frontend Directory:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/wallet` - Wallet-based login
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/profile` - Get user profile

### Games
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get specific game
- `GET /api/games/upcoming` - Get upcoming games
- `GET /api/games/live` - Get live games

### Bets
- `POST /api/bets/place` - Place a bet
- `GET /api/bets/my-bets` - Get user's bets
- `GET /api/bets/:id` - Get specific bet
- `POST /api/bets/:id/cancel` - Cancel a bet

### Predictions
- `POST /api/predictions/generate/:gameId` - Generate AI prediction
- `GET /api/predictions/upcoming` - Get upcoming predictions
- `GET /api/predictions/history/:userId` - Get prediction history

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/deposit` - Deposit funds
- `POST /api/wallet/withdraw` - Withdraw funds
- `GET /api/wallet/transactions` - Get transaction history

### Analytics
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/analytics/performance-chart` - Get performance data
- `GET /api/analytics/patterns` - Get betting patterns

## 🔐 Security Features

- JWT-based authentication
- Wallet signature verification
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- Error handling

## 🎨 Frontend Features

- Modern React 18 with hooks
- Vite for fast development
- Tailwind CSS for styling
- Framer Motion for animations
- TanStack Query for data fetching
- Wallet integration (MetaMask, Phantom, Coinbase)
- Responsive design
- Dark/light theme support

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
# Build frontend
npm run build

# Start production server
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=80
HOST=0.0.0.0
CORS_ORIGIN=https://yourdomain.com
JWT_SECRET=your-production-jwt-secret
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Kill process on port 5000
   npx kill-port 5000
   # Kill process on port 3000
   npx kill-port 3000
   ```

2. **Dependency conflicts:**
   ```bash
   # Clear npm cache
   npm cache clean --force
   # Reinstall with legacy peer deps
   npm install --legacy-peer-deps
   ```

3. **Environment variables not loading:**
   - Ensure `.env` file exists in root directory
   - Check variable names match exactly
   - Restart the development server

4. **Wallet connection issues:**
   - Ensure MetaMask/Phantom is installed
   - Check if wallet is connected to correct network
   - Clear browser cache and try again

## 📝 Notes

- The application uses mock data by default for development
- Real API keys are only needed for production features
- All blockchain interactions are simulated in development
- Google OAuth requires setup in Google Cloud Console
- OpenAI API requires an account and API key

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 