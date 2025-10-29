// Simple registry and invoker
const notion = require('../connectors/notionConnector');


const registry = {
notion: {
notes: {
list: notion.listNotes
}
}
};


async function invoke({ provider, category, action, auth, payload }) {
if (!registry[provider]) throw new Error('Provider not supported');
const cat = registry[provider][category];
if (!cat) throw new Error('Category not supported');
const fn = cat[action];
if (!fn) throw new Error('Action not supported');
return fn({ accessToken: auth.accessToken, ...payload });
}


module.exports = { invoke };