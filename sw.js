const version = 1;
const cacheName = `app-cache-v${version}`;
const cacheFiles = [
	'./',
	'./index.html',
	'./css/main.css',
	'./js/main.js',
	'./js/cache.js',
	'./sw.js',
];

self.addEventListener('install', (ev) => {
	console.log('Installing service worker. Opening cache.');
	ev.waitUntil(
		caches
			.open(cacheName)
			.then((cache) => {
				console.log('App cache opened.');
				cache.addAll(cacheFiles);
			})
			.catch((err) => console.error(err))
	);
});

self.addEventListener('activate', (ev) => {
	console.log('Activating service worker');

	ev.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames
						.filter((name) => name !== cacheName)
						.map((name) => {
							console.log('Deleting cache', name);
							caches.delete(name);
						})
				);
			})
			.catch((err) => console.error(err))
			.finally(() =>
				console.log('New service worker activated. Cache cleared.')
			)
	);
});

// Online / offline events
self.addEventListener('online', () => {
	console.log('Online now!');
	isOnline = true;
});

self.addEventListener('offline', () => {
	console.log('Oops, offline!');
	isOnline = false;
});
