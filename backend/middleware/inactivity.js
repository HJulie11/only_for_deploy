// middleware/inactivity.js
const inactivityTimeout = 600000; // 10 minutes in milliseconds

let userActivityTimeouts = {};

const inactivityMiddleware = (req, res, next) => {
  const userId = req.session.userId;
  
  if (!userId) return next();

  if (userActivityTimeouts[userId]) {
    clearTimeout(userActivityTimeouts[userId]);
  }

  userActivityTimeouts[userId] = setTimeout(() => {
    req.session.destroy(err => {
      if (err) console.error('Session destruction error:', err);
    });
  }, inactivityTimeout);

  next();
};

module.exports = inactivityMiddleware;
