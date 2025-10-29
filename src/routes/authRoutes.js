const express = require('express');
const router = express.Router();
const { createPintoAuthForNotion } = require('../lib/authBroker');


// dev: direct simulated connect
router.post('/connect/:provider', async (req, res) => {
const { provider } = req.params;
if (provider === 'notion') {
// If credentials set, return real OAuth url. For POC: return a simulated url requiring a code step.
if (!process.env.NOTION_CLIENT_ID) return res.json({ connectUrl: `${process.env.BASE_URL}/auth/callback/notion?code=dev_code_simulated` });
const redirect = `https://api.notion.com/v1/oauth/authorize?client_id=${process.env.NOTION_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(process.env.BASE_URL + '/auth/callback/notion')}`;
return res.json({ connectUrl: redirect });
}
return res.status(400).json({ error: 'unsupported provider' });
});


router.get('/callback/notion', async (req, res) => {
const code = req.query.code || 'dev_code_simulated';
const key = await createPintoAuthForNotion(code);
// Instruct developer to persist this key for the user; here we return it directly
res.json({ pintoAuthKey: key });
});


module.exports = router;