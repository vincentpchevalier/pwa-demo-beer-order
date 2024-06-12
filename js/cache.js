const version = 8;
const cacheName = `data-cache-v${version}`;
let cache = null;

async function openCache() {
	try {
		console.log('Opening cache');
		cache = await caches.open(cacheName);
		return cache;
	} catch (error) {
		console.log(error);
	}
}

export { openCache };
