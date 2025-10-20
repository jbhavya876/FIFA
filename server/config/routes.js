const authCheck = require('../config/auth-check')

const authRoutes = require('../routes/auth');
const standingsRoutes = require('../routes/standings');
const adminRoutes = require('../routes/admin');
const betsRoutes = require('../routes/bets')

module.exports = (app) => {
  app.use('/auth', authRoutes);
  app.use('/standings', standingsRoutes);
  app.use('/admin', authCheck, adminRoutes);
  app.use('/bets', authCheck, betsRoutes);
}
