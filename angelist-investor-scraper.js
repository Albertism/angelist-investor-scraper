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
  	setTimeout(win.grabLinkedInUrl(win.document.body), 5000);
  }, true);

  // win.onload = function(){
  // 	setTimeOut(win.window.grabLinkedInUrl(), 10000);
  // };
  // $(win).on("load", setTimeout(grabLinkedInUrl(), 10000));
  // script.src = 'js/myScript.js';
  // win.document.head.appendChild(script);
}

function grabLinkedInUrl(winRef) {
	var linkedInAnchor = $(winRef).find('.fontello-linkedin');
	var linkedInUrl;
	if (linkedInAnchor && linkedInAnchor.length > 0) {
		linkedInUrl = linkedInAnchor[0].href;
	}

	linkedInUrl = linkedInUrl ? linkedInUrl : 'Not Found';
	console.log(linkedInUrl);
	alert('what');
}