import session from 'express-session';

// Initialize session middleware
export const sessionHandler = session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: true,
 });
 
 console.log(sessionHandler);
 
