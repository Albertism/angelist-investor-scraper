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

function loadMoreConnection(totalConnection) {
	
}

function scrollTillBottom(connectionNumber) {
	let currentLength = $('.item');
	while (currentLength <= connectionNumber) {
		setTimeout(() => {
			window.scrollTo(0, document.body.scrollHeight);
			console.log('Scrolling....');
			currentLength = $('.item').length;
		}, 2000);
	}
}