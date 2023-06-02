const whitelist = [process.env.FRONTEND_URL, process.env.FRONTEND_URL_ALT];

const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  };

module.exports = corsOptions;