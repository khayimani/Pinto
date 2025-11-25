const express = require('express');
const router = express.Router();
const store = require('../lib/store');
const connectorEngine = require('../connectors/registry');
const transform = require('../lib/transform');


router.post('/notes/list', async (req, res) => {
const { source, authKey, pageSize } = req.body;
if (!source || !authKey) return res.status(400).json({ error: 'source and authKey required' });
const account = store.getAccount(authKey);
if (!account) return res.status(404).json({ error: 'authKey not found' });


try {
const rawItems = await connectorEngine.invoke({ provider: account.provider, category: 'notes', action: 'list', auth: { accessToken: account.accessToken }, payload: { pageSize } });
const canon = transform.mapNotes(rawItems);
return res.json({ items: canon });
} catch (err) {
console.error(err && err.response && err.response.data ? err.response.data : err.message);
return res.status(500).json({ error: 'provider error', detail: err.message });
}
});


module.exports = router;
