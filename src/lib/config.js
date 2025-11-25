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
    google: {
    client: {
      id: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_CLIENT_SECRET,
    },
    auth: {
      tokenHost: 'https://oauth2.googleapis.com',
      tokenPath: '/token',
      authorizePath: 'https://accounts.google.com/o/oauth2/v2/auth',
    },
  },
    //falta slack e o resto
}