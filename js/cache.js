const cacheName = `data-cache`;
let cache = null;

async function openCache() {
	console.log('Opening cache');
	return cache ? `Opened ${cacheName}` : `Failed to open ${cacheName}`;
}

export { openCache };
