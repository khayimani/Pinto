const express = require('express');
const router = express.Router();
const registry = require('../connectors/registry');
const {getValidToken} = require('../lib/tokenManager');
const prisma = require('../lib/db');

router.get('/notes', async (req, res) =>{
    const {connection_id} = req.query;

    if (!connection_id) return 
    res.status(400).json({error:'connection_id required'});

    try {
        const account = await prisma.account.findUnique({ where: { id: connection_id}});
        if (!account)return 
        res.status(404).json({ error: 'Connection not found'});

        const token = await getValidToken(connection_id);
        
        const connector = 
        registry[account.provider];
        if (!connector) returnres.status(501).json({ error: 'Provider not supported yet'});

        const data = await connector.notes(token);

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message });
    }
});

module.exports = router;