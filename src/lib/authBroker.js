// Minimal auth broker: issues a pintoAuthKey after provider oauth completed.
const store = require('./store');
const axios = require('axios');


async function exchangeNotionCode(code) {
// In production talk to Notion; here we simulate the exchange or do a real one if credentials exist
if (!process.env.NOTION_CLIENT_ID) {
// simulated tokens
return { access_token: 'simulated-notion-token', refresh_token: null };
}


const resp = await axios.post('https://api.notion.com/v1/oauth/token', {
grant_type: 'authorization_code',
code,
redirect_uri: `${process.env.BASE_URL}/auth/callback/notion`
}, { auth: {
username: process.env.NOTION_CLIENT_ID,
password: process.env.NOTION_CLIENT_SECRET
}}).then(r=>r.data);


return { access_token: resp.access_token, refresh_token: resp.refresh_token };
}


async function createPintoAuthForNotion(code) {
const tokens = await exchangeNotionCode(code);
const key = store.createKey();
store.saveAccount(key, { provider: 'notion', accessToken: tokens.access_token, refreshToken: tokens.refresh_token, createdAt: Date.now() });
return key;
}


module.exports = { createPintoAuthForNotion };