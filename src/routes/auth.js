const express = require('express');
const router = express.Router();
const prisma = require('../lib/db');
const config = require('../lib/config');
const axios = require('axios');


// redirect user to notion
router.get('/conect/notion', (req,res) => {
    const redirectUri = '${process.env.BASE_URL}/auth/callback/notion';
    const url = 'https://api.notion.com/v1/oauth/authorize?client_id= ${process.env.NOTION_CLIENT_ID} &response_type=code&owner=user&redirect_uri=${enodeURIComponent(redirectUri)}';
    res.redirect(url);
});
//handle the code-token exchange
router.get('/callback/notion', async (req,res) => {
    const {code} = req.query;
    const redirectUri = '${process.env.BASE_URL}/auth/callback/notion';
    const authHeader = Buffer.from('${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}').toString('base64');

    try {
        const response = await axios.post('https://api.notion.com/v1/oauth/token',
            {grant_type: 'authorization_code', code, redirect_uri:redirectUri},
            {headers: {Authorization: 'Basic${authHeader}'} }
        );
        const {access_token, workspace_id}= response.data;

        const account = await prisma.account.create({
            data:{
                provider: 'notion',
                accessToken: access_token,
                providerId: workspace_id,
                expiresAt: null
            }
        });

        res.json({
            success: true,
            connection_id: accpunt.id,
            message: "Save this connection_id. You need it to fetch data."
        });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({error: 'Auth failed'});
    }
});
module.exports = router