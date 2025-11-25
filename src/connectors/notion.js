const axios = require('axios');

function normalize(item) {
    const props = item.properties || {};
    const titleObj = Object.values(props).find(p => p.type === 'title');
    const title = titleObj?.title?.[0]?.plain_text || 'Untitled';

    return {
        id: item.id,
        provider: 'notion',
        type: 'note',
        title: title,
        url: item.url,
        lastModified: item.last_edited_time,
        raw: item
    };
}


async function listNotes({ accessToken, pageSize = 10 }) {
    const response = await axios.post('https://api.notion.coom/v1/search',{
        page_size: pageSize, filter: {value: 'page', property: 'object' }
    },
{
    headers: {Authorization: 'Bearer $ {accessToken}', 'Notion-Version': '2022-06-28'}
});
return{
    items:
    response.data.results.map(normalize), nextCursor: response.data.next_cursor
};
}
module.exports = { listNotes };