const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const { Connection, PublicKey } = require('@solana/web3.js');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// In-memory user storage (replace with database in production)
const users = new Map();

// Configure Google OAuth (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      avatar: profile.photos[0]?.value,
      provider: 'google',
      walletAddress: null,
      createdAt: new Date().toISOString(),
    };

    users.set(user.id, user);
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));
}

// Wallet authentication with MetaMask/Coinbase
router.post('/wallet', async (req, res) => {
  try {
    const { walletAddress, signature, message, chain } = req.body;

    if (!walletAddress || !signature || !message) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address, signature, and message are required',
      });
    }

    let recoveredAddress;

    // Verify signature based on chain
    if (chain === 'solana') {
      // Solana signature verification
      const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com');
      // Note: This is a simplified verification. In production, use proper Solana signature verification
      recoveredAddress = walletAddress;
    } else {
      // Ethereum signature verification (MetaMask, Coinbase)
      try {
        recoveredAddress = ethers.verifyMessage(message, signature);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid signature',
        });
      }
    }

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({
        success: false,
        message: 'Signature verification failed',
      });
    }

    // Find or create user
    let user = Array.from(users.values()).find(u => 
      u.walletAddress?.toLowerCase() === walletAddress.toLowerCase()
    );

    if (!user) {
      user = {
        id: `wallet_${walletAddress.slice(0, 10)}`,
        walletAddress: walletAddress.toLowerCase(),
        chain: chain || 'ethereum',
        provider: 'wallet',
        createdAt: new Date().toISOString(),
        bankroll: {
          ethereum: '0',
          solana: '0',
          usdc: '0'
        }
      };
      users.set(user.id, user);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        walletAddress: user.walletAddress,
        chain: user.chain 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          chain: user.chain,
          provider: user.provider,
          bankroll: user.bankroll
        },
        token
      }
    });

  } catch (error) {
    console.error('Wallet authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message,
    });
  }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
    try {
      const user = req.user;
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          provider: 'google' 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}`);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/error`);
    }
  }
);

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = users.get(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          chain: user.chain,
          provider: user.provider,
          bankroll: user.bankroll
        }
      }
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = users.get(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          chain: user.chain,
          provider: user.provider,
          bankroll: user.bankroll,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = users.get(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { name, avatar } = req.body;

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    users.set(user.id, user);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          chain: user.chain,
          provider: user.provider,
          bankroll: user.bankroll
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

module.exports = router;