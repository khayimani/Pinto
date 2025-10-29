// Example transformation to canonical objects. Keep minimal and extensible.


function toCanonicalNote(raw) {
return {
id: raw.id,
title: raw.title || 'untitled',
providerRaw: raw.raw || raw
};
}


function mapNotes(items) {
return items.map(toCanonicalNote);
}


module.exports = { mapNotes };