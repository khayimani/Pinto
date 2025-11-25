require('dotenv').config();

module.exports = {
    notion: {
        client: {
            id: process.env.NOTION_CLIENT_ID,
            secret: process.env.NOTION_CLIENT_SECRET,
        },
        auth: {
            tokenHost: 'https://api.notion.com',
            tokenPath: '/v1/oauth/token',
            authorizePath: '/v1/oauth/authorize',
        },
    },
    //falta slack, google e o resto
}