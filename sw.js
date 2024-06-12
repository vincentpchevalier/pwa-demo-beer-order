const version = 8;
const appCacheName = `app-cache-v${version}`;
const dataCacheName = `data-cache-v${version}`;
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
	console.log('Installing service worker. Opening app cache and adding files.');
	ev.waitUntil(
		caches
			.open(appCacheName)
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
	console.log('Activating service worker and clearing unneeded cache files.');

	ev.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames
						.filter((name) => name !== appCacheName && name !== dataCacheName)
						.map((name) => {
							caches.delete(name);
							console.log(`Deleting ${name} cache`);
						})
				);
			})
			.catch((err) => console.error(err))
			.finally(() => {
				console.log('Service worker activated. Cache cleared of old files.');
			})
	);
});

self.addEventListener('fetch', (ev) => {
	console.log(`Fetching ${ev.request.url}`);
	console.log(ev.request);
	let isOnline = navigator.onLine;

	let url = new URL(ev.request.url);

	let hostname = url.hostname;
	console.log(hostname);

	let pathname = url.pathname;

	let isFont =
		hostname.includes('fonts.gstatic.com') ||
		hostname.includes('fonts.googleapis.com');

	let isData =
		hostname.includes('random-data-api.com') || pathname.includes('.json');

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
		} else if (isData) {
			let url = new URL(ev.request.url);
			console.log(
				`Requesting data at ${url.pathname}. Checking if data is cached. If not, fetching it and caching it.`
			);
			ev.respondWith(
				fetch(url, { mode: 'cors', credentials: 'omit' })
					.then((fetchResponse) => {
						if (!fetchResponse.ok) throw Error(fetchResponse.status);
						return caches.open(dataCacheName).then((cache) => {
							cache.put(ev.request, fetchResponse.clone());
							return fetchResponse;
						});
					})
					.catch((error) => {
						return caches
							.match(ev.request)
							.then(
								(cacheResponse) =>
									cacheResponse ||
									new Response('No data found', { status: error })
							);
					})
			);
		}
	}

	if (!isOnline) {
		if (isData) {
			ev.respondWith(
				caches.match(ev.request).then((cacheResponse) => {
					return cacheResponse || new Response('No data found');
				})
			);
		}
	}
});

self.addEventListener('message', (ev) => {});
