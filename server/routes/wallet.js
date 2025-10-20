const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');

// In-memory storage for demo (replace with database in production)
let wallets = new Map();

// Initialize demo wallets
function initializeDemoWallets() {
  // Demo wallet data
  const demoWallets = [
    {
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      type: 'ethereum',
      balance: {
        ETH: '2.5',
        USDC: '1500.00'
      },
      transactions: []
    },
    {
      address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      type: 'solana',
      balance: {
        SOL: '15.5',
        USDC: '2500.00'
      },
      transactions: []
    }
  ];
  
  demoWallets.forEach(wallet => {
    wallets.set(wallet.address, wallet);
  });
}

// Initialize demo data
initializeDemoWallets();

// GET /api/wallet/balance/:address - Get wallet balance
router.get('/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    // Check if wallet exists in demo data
    let wallet = wallets.get(address);
    
    if (!wallet) {
      // For demo purposes, create a new wallet entry
      wallet = {
        address,
        type: address.length === 44 ? 'solana' : 'ethereum',
        balance: {
          ETH: '0.0',
          SOL: '0.0',
          USDC: '0.00'
        },
        transactions: []
      };
      wallets.set(address, wallet);
    }
    
    res.json({
      success: true,
      data: {
        address: wallet.address,
        type: wallet.type,
        balance: wallet.balance,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet balance',
      error: error.message
    });
  }
});

// POST /api/wallet/connect - Connect wallet
router.post('/connect', async (req, res) => {
  try {
    const { address, type, signature, message } = req.body;
    
    if (!address || !type) {
      return res.status(400).json({
        success: false,
        message: 'Address and wallet type are required'
      });
    }
    
    // Verify signature for Ethereum wallets
    if (type === 'ethereum' && signature && message) {
      try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
          return res.status(401).json({
            success: false,
            message: 'Invalid signature'
          });
        }
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Signature verification failed'
        });
      }
    }
    
    // Create or update wallet entry
    let wallet = wallets.get(address);
    if (!wallet) {
      wallet = {
        address,
        type,
        balance: {
          ETH: '0.0',
          SOL: '0.0',
          USDC: '0.00'
        },
        transactions: [],
        connectedAt: new Date().toISOString()
      };
      wallets.set(address, wallet);
    }
    
    // Update connection status
    wallet.lastConnected = new Date().toISOString();
    wallet.isConnected = true;
    
    res.json({
      success: true,
      data: {
        address: wallet.address,
        type: wallet.type,
        balance: wallet.balance,
        connected: true,
        message: 'Wallet connected successfully'
      }
    });
  } catch (error) {
    console.error('Error connecting wallet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect wallet',
      error: error.message
    });
  }
});

// POST /api/wallet/disconnect - Disconnect wallet
router.post('/disconnect', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }
    
    const wallet = wallets.get(address);
    if (wallet) {
      wallet.isConnected = false;
      wallet.lastDisconnected = new Date().toISOString();
    }
    
    res.json({
      success: true,
      data: {
        address,
        connected: false,
        message: 'Wallet disconnected successfully'
      }
    });
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect wallet',
      error: error.message
    });
  }
});

// GET /api/wallet/transactions/:address - Get wallet transactions
router.get('/transactions/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    
    const wallet = wallets.get(address);
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }
    
    const transactions = wallet.transactions
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    res.json({
      success: true,
      data: {
        address,
        transactions,
        count: transactions.length,
        total: wallet.transactions.length
      }
    });
  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet transactions',
      error: error.message
    });
  }
});

// POST /api/wallet/transfer - Transfer funds
router.post('/transfer', async (req, res) => {
  try {
    const { fromAddress, toAddress, amount, currency, signature, message } = req.body;
    
    if (!fromAddress || !toAddress || !amount || !currency) {
      return res.status(400).json({
        success: false,
        message: 'From address, to address, amount, and currency are required'
      });
    }
    
    // Verify signature
    if (signature && message) {
      try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        if (recoveredAddress.toLowerCase() !== fromAddress.toLowerCase()) {
          return res.status(401).json({
            success: false,
            message: 'Invalid signature'
          });
        }
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Signature verification failed'
        });
      }
    }
    
    // Get source wallet
    const sourceWallet = wallets.get(fromAddress);
    if (!sourceWallet) {
      return res.status(404).json({
        success: false,
        message: 'Source wallet not found'
      });
    }
    
    // Check balance
    const currentBalance = parseFloat(sourceWallet.balance[currency] || 0);
    const transferAmount = parseFloat(amount);
    
    if (currentBalance < transferAmount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }
    
    // Get destination wallet (create if doesn't exist)
    let destWallet = wallets.get(toAddress);
    if (!destWallet) {
      destWallet = {
        address: toAddress,
        type: toAddress.length === 44 ? 'solana' : 'ethereum',
        balance: {
          ETH: '0.0',
          SOL: '0.0',
          USDC: '0.00'
        },
        transactions: []
      };
      wallets.set(toAddress, destWallet);
    }
    
    // Update balances
    sourceWallet.balance[currency] = (currentBalance - transferAmount).toFixed(2);
    destWallet.balance[currency] = (parseFloat(destWallet.balance[currency] || 0) + transferAmount).toFixed(2);
    
    // Create transaction records
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    const outboundTx = {
      id: transactionId,
      type: 'outbound',
      from: fromAddress,
      to: toAddress,
      amount: transferAmount.toString(),
      currency,
      timestamp,
      status: 'completed'
    };
    
    const inboundTx = {
      id: transactionId,
      type: 'inbound',
      from: fromAddress,
      to: toAddress,
      amount: transferAmount.toString(),
      currency,
      timestamp,
      status: 'completed'
    };
    
    sourceWallet.transactions.push(outboundTx);
    destWallet.transactions.push(inboundTx);
    
    res.json({
      success: true,
      data: {
        transactionId,
        from: fromAddress,
        to: toAddress,
        amount: transferAmount.toString(),
        currency,
        status: 'completed',
        timestamp
      }
    });
  } catch (error) {
    console.error('Error processing transfer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process transfer',
      error: error.message
    });
  }
});

// POST /api/wallet/deposit - Simulate deposit
router.post('/deposit', async (req, res) => {
  try {
    const { address, amount, currency } = req.body;
    
    if (!address || !amount || !currency) {
      return res.status(400).json({
        success: false,
        message: 'Address, amount, and currency are required'
      });
    }
    
    let wallet = wallets.get(address);
    if (!wallet) {
      wallet = {
        address,
        type: address.length === 44 ? 'solana' : 'ethereum',
        balance: {
          ETH: '0.0',
          SOL: '0.0',
          USDC: '0.00'
        },
        transactions: []
      };
      wallets.set(address, wallet);
    }
    
    // Update balance
    const currentBalance = parseFloat(wallet.balance[currency] || 0);
    const depositAmount = parseFloat(amount);
    wallet.balance[currency] = (currentBalance + depositAmount).toFixed(2);
    
    // Create transaction record
    const transactionId = `deposit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    const depositTx = {
      id: transactionId,
      type: 'deposit',
      from: 'external',
      to: address,
      amount: depositAmount.toString(),
      currency,
      timestamp,
      status: 'completed'
    };
    
    wallet.transactions.push(depositTx);
    
    res.json({
      success: true,
      data: {
        transactionId,
        address,
        amount: depositAmount.toString(),
        currency,
        newBalance: wallet.balance[currency],
        status: 'completed',
        timestamp
      }
    });
  } catch (error) {
    console.error('Error processing deposit:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process deposit',
      error: error.message
    });
  }
});

// GET /api/wallet/supported - Get supported wallet types
router.get('/supported', async (req, res) => {
  try {
    const supportedWallets = [
      {
        name: 'MetaMask',
        type: 'ethereum',
        description: 'Ethereum wallet for ETH and ERC-20 tokens',
        icon: 'metamask',
        supported: true
      },
      {
        name: 'Phantom',
        type: 'solana',
        description: 'Solana wallet for SOL and SPL tokens',
        icon: 'phantom',
        supported: true
      },
      {
        name: 'Coinbase Wallet',
        type: 'multi',
        description: 'Multi-chain wallet supporting Ethereum and Solana',
        icon: 'coinbase',
        supported: true
      }
    ];
    
    res.json({
      success: true,
      data: supportedWallets
    });
  } catch (error) {
    console.error('Error fetching supported wallets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch supported wallets',
      error: error.message
    });
  }
});

// GET /api/wallet/status - Get wallet connection status
router.get('/status', async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }
    
    const wallet = wallets.get(address);
    const status = {
      address,
      connected: wallet ? wallet.isConnected || false : false,
      type: wallet ? wallet.type : null,
      lastConnected: wallet ? wallet.lastConnected : null,
      lastDisconnected: wallet ? wallet.lastDisconnected : null
    };
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Error fetching wallet status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet status',
      error: error.message
    });
  }
});

module.exports = router; 