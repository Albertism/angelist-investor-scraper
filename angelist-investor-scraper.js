function testAnItem() { 
	var allListArray = $('.item');
	var firstItem = $(allListArray[0]);
	var profileLink = firstItem.find('.profile-link')[0].href;

	if (profileLink) {
		console.log(profileLink)
	}
}

function newWindow() {
  var win = window.open('https://angel.co/brian-magierski');
  win.focus();
  win.addEventListener('load', function() {
  	win.grabLinkedInUrl = grabLinkedInUrl;
  	win.grabLinkedInUrl(win.document.body);
  	console.log(localStorage.getItem("linkedInUrl"));
  	win.close();
  }, true);
}

function grabLinkedInUrl(winRef) {
	var linkedInAnchor = $(winRef).find('.fontello-linkedin');
	var linkedInUrl;
	if (linkedInAnchor && linkedInAnchor.length > 0) {
		linkedInUrl = linkedInAnchor[0].href;
	}

	linkedInUrl = linkedInUrl ? linkedInUrl : 'Not Found';
	localStorage.setItem("linkedInUrl", linkedInUrl);
	window.close();
}

function loadMoreProspects() {
	window.scrollTo(0, document.body.scrollHeight);
		setTimeout(() => {
			console.log('Scrolling to bottom....');
		}, 2000);
}

function scrapeConnections(connectionNumber) {
	console.log('Collecting ', connectionNumber, ' investors...');
	let currentLength = $('.item').length;

	if (currentLength < connectionNumber) {
		console.log('Current prospects: ', currentLength, '/', connectionNumber);
		loadMoreProspects();
		setTimeout(() => {
			scrapeConnections(connectionNumber);
		}, 2000);
		return;
	}

	console.log('Prospects loaded, starting to scrape');
	let csvString = '';
}
