import { openCache } from './cache.js';

let datacache = null;

function init() {
	console.log('App initialized');
	openCache()
		.then((result) => {
			datacache = result;
			console.log(datacache);
		})
		.catch((error) => console.log(error));
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
