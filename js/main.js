import { openCache } from './cache.js';

const randomDataApiUrl = 'https://random-data-api.com/api/v2/users';
let datacache = null;
let SW = null;
let isOnline = 'onLine' in navigator && navigator.onLine;

function init() {
	console.log('App initialized');
	openCache()
		.then((result) => {
			datacache = result;
			console.log(datacache);
		})
		.catch((error) => console.log(error));

	registerServiceWorker();

	addListeners();

	fetchData(randomDataApiUrl, 10)
		.then((users) => {
			console.log(users);
			// loadUsers(users);
		})
		.catch((error) => console.log(error));
	showContent();
}

async function fetchData(url, size) {
	try {
		// fetch data from url with size
		const apiUrl = new URL(url);
		apiUrl.searchParams.set('size', size);
		console.log(apiUrl.href);

		const response = await fetch(apiUrl.href, {});
		const data = await response.json();

		const users = data.map((user) => {
			return {
				fullName: user.first_name + ' ' + user.last_name,
				id: user.id,
				image: user.avatar,
			};
		});

		const filename = `${crypto.randomUUID()}-users.json`;

		const blob = new Blob([JSON.stringify(users)], {
			type: 'application/json',
		});

		const responseForCache = new Response(blob, {
			headers: { 'Content-Type': 'application/json' },
		});

		const request = new Request(filename);

		await datacache.put(request.url, responseForCache.clone());

		return users;
	} catch (error) {
		// Handle error
	}
}

function registerServiceWorker() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.register('./sw.js')
			.then((registration) => {
				SW =
					registration.installing ||
					registration.waiting ||
					registration.active;
				console.log('Service worker registered');
			})
			.catch((error) => {
				console.log('Service worker registration failed', error);
			});

		if (navigator.serviceWorker.controller) {
			console.log('We have a service walker installed.');
		}
	} else {
		console.log('Service workers not supported');
	}
}

function addListeners() {
	window.addEventListener('online', () => {
		console.log('Online now!');
		isOnline = true;
	});

	window.addEventListener('offline', () => {
		console.log('Oops, offline!');
		isOnline = false;
	});

	document.getElementById('go-to-orders').addEventListener('click', () => {
		console.log('Navigating to orders page');
	});

	document.getElementById('content').addEventListener('click', (event) => {
		console.log(event.target);
	});
}

function showContent() {
	if (isOnline) {
		document.getElementById('content').innerHTML = `
      <h2>Beers</h2>
      <div class="beers"></div>
    `;
	}

	if (!isOnline) {
		document.getElementById('content').innerHTML = `
      <h2>404</h2>
      <p>Currently offline. Please check your connection and refresh.</p>
      <button id="refresh">Refresh</button>
      <p id="see-orders">See orders</p>
    `;
	}
}

document.addEventListener('DOMContentLoaded', init);

// on page load, register service worker
// attach event listeners for offline and online events
// load the saved people and beers from the cache
// if beers are saved, show the total number of beers ordered in the header
// if there are no beers saved in the cache, fetch 10 random users from the random data api and load them in the content div, otherwise show message saying "no beers ordered yet"
// if offline, navigate to 404.html and show message saying "Currently offline. Please check your connection and refresh." Include link to refresh page (load home page if back online) and a link to list of tallied beers
// when clicking on a user, show individual card with a list of their ordered beers
// change the address to the user's name-id in the url string - localhost:3000/users/user-id
// on each card, have a list of beers and an order button to order the beer and add the user to the cache and to the orders page with their ordered beers
// on clicking the remove button, remove the user and all of their ordered beers from the cache and from the orders page
// in header, have a link to the orders page
// show the number of beers ordered by everyone in the header
// if orders is selected navigate to the orders page
// if offline, on the orders page, load the saved orders from the cache
// if no orders are saved in the cache, show message saying "no orders yet"
// if online, show each user with their ordered beers in the orders page
