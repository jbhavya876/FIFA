// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error(err.stack);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // OpenAI API errors
  if (err.code === 'insufficient_quota') {
    const message = 'OpenAI API quota exceeded';
    error = { message, statusCode: 429 };
  }

  if (err.code === 'invalid_api_key') {
    const message = 'Invalid OpenAI API key';
    error = { message, statusCode: 401 };
  }

  // Web3/Ethers errors
  if (err.code === 'INSUFFICIENT_FUNDS') {
    const message = 'Insufficient funds for transaction';
    error = { message, statusCode: 400 };
  }

  if (err.code === 'UNPREDICTABLE_GAS_LIMIT') {
    const message = 'Transaction failed - gas limit issue';
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler }; 