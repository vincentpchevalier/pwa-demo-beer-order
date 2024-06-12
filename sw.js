const version = 1;
const cacheName = `app-cache-v${version}`;
let appCache = null;

const cacheFiles = [
	'./',
	'./index.html',
	'./css/main.css',
	'./js/main.js',
	'./js/cache.js',
	'./sw.js',
];

self.addEventListener('install', (ev) => {
	console.log('Installing service worker. Opening cache and adding app files.');
	ev.waitUntil(
		caches
			.open(cacheName)
			.then((cache) => {
				appCache = cache;
				cache.addAll(cacheFiles);
				console.log('App cache opened and files added.');
				console.log('app cache: ', appCache);
			})
			.catch((err) => console.error(err))
	);
});

self.addEventListener('activate', (ev) => {
	console.log('Activating service worker and clearing old app cache files.');

	ev.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames
						.filter((name) => name !== cacheName)
						.map((name) => {
							caches.delete(name);
							console.log(`Deleting ${name} cache`);
						})
				);
			})
			.catch((err) => console.error(err))
			.finally(() => {
				console.log('New service worker activated. Cache cleared.');
			})
	);
});

self.addEventListener('fetch', (ev) => {
	console.log(`Fetching ${ev.request.url}`);
	let isOnline = navigator.onLine;

	let url = new URL(ev.request.url);

	let hostname = url.hostname;
	console.log(hostname);

	let isFont =
		hostname.includes('fonts.gstatic.com') ||
		hostname.includes('fonts.googleapis.com');

	let isData = hostname.includes('random-data-api.com');

	if (isOnline) {
		if (isFont) {
			console.log(
				`Requesting asset at ${ev.request.url}. Checking if asset is cached. If not, fetching it and caching it.`
			);
			ev.respondWith(
				caches
					.match(ev.request)
					.then((cacheResponse) => {
						let fetchResponse = fetch(ev.request, {
							mode: 'cors',
							credentials: 'omit',
						}).then((response) => {
							if (!response.ok) throw Error(response.statusText);
							console.log(`Fetching and caching asset`);
							appCache.put(ev.request, response.clone());
							return response;
						});
						return cacheResponse || fetchResponse;
					})
					.catch((error) => console.error(error))
			);
		}
	}
});
self.addEventListener('message', (ev) => {});
