// Minimal SDK for demo: very small wrapper around fetch
const axios = require('axios');


class Pinto {
constructor({ baseUrl, apiKey }) { this.baseUrl = baseUrl || 'http://localhost:3000'; this.apiKey = apiKey; }


async connect(provider) {
const resp = await axios.post(`${this.baseUrl}/auth/connect/${provider}`);
return resp.data;
}


async notesList({ source, authKey, pageSize }) {
const resp = await axios.post(`${this.baseUrl}/v1/notes/list`, { source, authKey, pageSize });
return resp.data;
}
}


module.exports = Pinto;