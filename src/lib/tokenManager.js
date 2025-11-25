const prisma = require('./db');
const axios = require('axios');
const dayjs = require('dayjs');
const config = require('./config');

async function getValidToken(accountId) {
    const account= await
prisma.account.findUnique({ where: {id: accountId } });
    if (!account) throw new Error('Connection not found');

    const isExpired = account.expiresAt && dayjs().add(5,'minute').isAfter(dayjs(account.expiresAt));

    if (isExpired && account.refreshToken){
        console.log('[TokenManager] Refreshing token for $ {account.provider}...');
        return await refreshToken(account);
    }

    return account.accessToken;
}
async function refreshToken(account) {
    const providerConfig = config[account.provider];
    const authHeader = Buffer.from('${providerConfig.client.id}:${providerConfig.client.secret}').toString('base64');

    try {
        const response = await axios.post('https://api.notion.com/v1/oauth/token', { grant_type: 'authorization_code',code: account.refreshToken }, 
            { headers: {Authorization: 'Basic ${authHeader}'}}
        );

        //Update db
        const data = response.data;
        await prisma.account.update({where: { id: account.id }, data: {accessToken: data.access_token, expiresAt: dayjs().add(data.expires_in,'second').toDate()}});

        return data.access_token;
    }catch (error){
        console.error("Refresh Failed", error.response?.data || error.message);
        throw new Error('Failed to refresg token. Re-authentication required');
       }
    }
    
module.exports= { getValidToken};