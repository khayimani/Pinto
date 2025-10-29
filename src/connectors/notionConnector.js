const axios = require('axios');


async function listNotes({ accessToken, pageSize = 20 }) {
// Very small proof-of-concept: call search endpoint and map results to Pinto canonical notes
const url = 'https://api.notion.com/v1/search';
try {
const resp = await axios.post(url, { page_size: pageSize }, {
headers: {
'Authorization': `Bearer ${accessToken}`,
'Notion-Version': '2022-06-28',
'Content-Type': 'application/json'
}
});


// Basic transform to canonical note model
const items = (resp.data.results || []).map(item => ({
id: item.id,
title: (item.properties && item.properties.title) ? (item.properties.title.title?.[0]?.plain_text || '') : (item.name || ''),
raw: item
}));


return items;
} catch (err) {
throw err;
}
}


module.exports = { listNotes };