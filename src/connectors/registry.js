// Simple registry and invoker
const notion = require('./notion');


const registry = {
notion: {
notes: notion.listNotes
}
};

module.exports = { registry };