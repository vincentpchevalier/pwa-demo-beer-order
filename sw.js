const version = 1;
const cacheName = `app-cache-v${version}`;
let appCache = null;
let isOnline = true;

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
});
self.addEventListener('message', (ev) => {});
