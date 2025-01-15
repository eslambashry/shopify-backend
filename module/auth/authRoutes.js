import express from 'express';
import { shopify } from '../../config/shopify.js';

const router = express.Router();

// Initiate OAuth
router.get('/auth', async (req, res) => {
  const { shop } = req.query;

  if (!shop || !/^[a-zA-Z0-9\-]+\.myshopify\.com$/.test(shop)) {
      return res.status(400).send('Invalid or missing shop parameter.');
  }

  console.log('Starting OAuth for shop:', shop);

  try {
      await shopify.auth.begin({
          shop,
          callbackPath: '/auth/callback',
          isOnline: true,
          rawRequest: req,
          rawResponse: res,
      });
  } catch (error) {
      console.error('Error during OAuth redirect:', error);
      res.status(500).send('Failed to initiate OAuth');
  }
});


// Handle OAuth Callback
router.get('/auth/callback', async (req, res) => {
  console.log('OAuth callback triggered');
  console.log('Query parameters:', req.query);

  try {
      const session = await shopify.auth.callback({
          rawRequest: req,
          rawResponse: res,
      });

      console.log('OAuth session created:', session);

      // Store session data
      req.session.shopify = session;

      res.redirect(`/?shop=${session.shop}`);
  } catch (error) {
      console.error('Error during OAuth callback:', error.message);
      console.error('Error details:', error.stack);
      res.status(500).send('Failed to authenticate');
  }
});

export default router;
