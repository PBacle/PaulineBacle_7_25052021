require('dotenv').config();

module.exports = {
    authentication: {
      jwtSecret: process.env.JWT_SECRET || 'secret',
    },
    security: {
      cipher:process.env.CIPHER || 'secret',
    },
    admin:{
      email :  process.env.DEFAULT_ADMIN_EMAIL || 'admin@gmail.com',
      password: process.env.DEFAULT_ADMIN_PASSWORD || 'M0d3rateur',
    }
  };
  