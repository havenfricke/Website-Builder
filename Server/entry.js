require('dotenv').config(); 
const express = require('express');
const app = express();
const port = process.env.LISTENING_PORT;
const serverOrigin = process.env.SERVER_ORIGIN;

// EXPRESS MIDDLEWARE: Body parsers should come first!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files middleware (if needed)
app.use(express.static('Public')); 

// Security, CORS, and other headers middleware
app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  let allowedDomains = [];

  try {
    allowedDomains = process.env.CORS_ALLOWED_DOMAINS || [];
  } catch (error) {
    console.error('[CORS_ALLOWED_DOMAINS]:', error);
  }

  if (process.env.NODE_ENV !== 'production') {
    allowedDomains = ['*'];
  }

  if (allowedDomains.includes('*') || allowedDomains.includes(requestOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', allowedDomains.includes('*') ? '*' : requestOrigin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  let cspSources;
  if (process.env.NODE_ENV !== 'production') {
    cspSources = "*"; 
  } else {
    cspSources = [`'self'`, ...allowedDomains.filter(url => url !== '*')].join(' ');
  }

  res.setHeader(
    'Content-Security-Policy',
    process.env.NODE_ENV !== 'production' ? 
    "default-src * 'unsafe-inline' 'unsafe-eval'" : 
    `default-src ${cspSources}; script-src ${cspSources}; style-src ${cspSources}`
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
});

// Register your controllers after the body parsing middleware
const PageController = require('./Controllers/PageController');
const pageController = new PageController();
app.use(pageController.mount, pageController.router);

app.listen(port, () => {
  console.log(`Server is running on ${serverOrigin}:${port}`);
});
