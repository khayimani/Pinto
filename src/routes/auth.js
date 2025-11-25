const express = require('express');
const router = express.Router();
const prisma = require('../lib/db');
const config = require('../lib/config');
const axios = require('axios');
const { AuthorizationCode } = require('simple-oauth2'); // Library for OAuth flows

// --- Helper Functions for OAuth Client Setup ---

// Note: Ensure your config.js contains the google structure
function getOAuthClient(provider) {
    const providerConfig = config[provider];
    if (!providerConfig) {
        throw new Error(`Configuration missing for provider: ${provider}`);
    }
    return new AuthorizationCode(providerConfig);
}

// --- Route Handlers ---

// 1. Initial Connect: Returns provider-specific authorize URL
router.get('/connect/:provider', (req, res) => {
    const { provider } = req.params;
    const redirectUri = `${process.env.BASE_URL}/auth/callback/${provider}`;

    if (provider === 'notion') {
        // Notion (Manual Axios/Basic Auth Flow)
        const url = `https://api.notion.com/v1/oauth/authorize?client_id=${process.env.NOTION_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(redirectUri)}`;
        return res.redirect(url);
    } 
    
    if (provider === 'google') {
        // Google (Simple-oauth2 Flow)
        const client = getOAuthClient('google');
        
        // Define scopes (permissions) needed for Google Notes/Drive access
        const scopes = [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/drive.readonly' // Example scope
        ];

        const authorizationUri = client.authorizeURL({
            redirect_uri: redirectUri,
            scope: scopes.join(' '),
            state: 'pinto-dev-state', // Use a real CSRF token in production
        });
        
        return res.redirect(authorizationUri);
    }

    return res.status(400).send('Unsupported provider.');
});

// 2. Callback Handlers
router.get('/callback/:provider', async (req, res) => {
    const { provider } = req.params;
    const { code } = req.query;
    const redirectUri = `${process.env.BASE_URL}/auth/callback/${provider}`;
    
    if (!code) {
        return res.status(400).json({ error: 'Authorization code missing.' });
    }

    try {
        let tokens;
        let providerId = null;

        if (provider === 'notion') {
            // Notion (Manual Token Exchange)
            const authHeader = Buffer.from(`${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`).toString('base64');
            const response = await axios.post('https://api.notion.com/v1/oauth/token', 
                { grant_type: 'authorization_code', code, redirect_uri: redirectUri },
                { headers: { Authorization: `Basic ${authHeader}` } }
            );
            tokens = response.data;
            providerId = tokens.workspace_id; // Notion uses workspace_id

        } else if (provider === 'google') {
            // Google (Simple-oauth2 Token Exchange)
            const client = getOAuthClient('google');
            const tokenParams = { code, redirect_uri: redirectUri };
            
            // Get raw tokens object
            const accessTokenObject = await client.getToken(tokenParams);
            tokens = accessTokenObject.token;
            
            // Fetch basic user info to get a stable providerId (user's Google ID)
            const userResp = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
                headers: { 'Authorization': `Bearer ${tokens.access_token}` }
            });
            providerId = userResp.data.id; // Google User ID

        } else {
            return res.status(400).json({ error: 'Unsupported provider.' });
        }

        // --- Common Storage Logic ---
        const account = await prisma.account.create({
            data: {
                provider: provider,
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null,
                providerId: providerId, 
            }
        });

        res.json({ 
            success: true, 
            provider: provider,
            connection_id: account.id, 
            message: `Connection successful. Use this connection_id to fetch data.`
        });

    } catch (error) {
        console.error(`OAuth Callback Failed for ${provider}:`, error.response?.data || error.message);
        res.status(500).json({ error: `OAuth failed for ${provider}`, detail: error.message });
    }
});

module.exports = router;