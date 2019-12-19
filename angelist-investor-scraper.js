let totalCSVString = '';
let connectionSessionLock = false;
let contactInfoObjectArray = [];

async function addCandidateInformation(prospectObject, locationName) {
	let prospectName;
	let contactInfoObject = new Object();
	// get candidate name
	let anchorList = $(prospectObject).find('.u-uncoloredLink');
	if (anchorList && anchorList.length > 0) {
		prospectName = anchorList[0].text;
		contactInfoObject.name = prospectName;
		totalCSVString += prospectName + ';';
	} else {
		console.error('No prospect name?');
	}

	let profileLink;
	// get profile link
	profileLink = $(prospectObject).find('.profile-link')
;	if (profileLink && profileLink.length > 0) { 
		profileLink = profileLink[0].href;
		contactInfoObject.profileLink = profileLink;
		contactInfoObjectArray.push(contactInfoObject);
		totalCSVString += profileLink + ';';
		totalCSVString += locationName + '\r\n';
		// await collectLinkedInUrlFromNewWindow(profileLink);
	}
	
	if (!profileLink) {
		console.error('There was error finding profile link for candidate ', prospectName);
	}
}

async function collectLinkedInUrlFromNewWindow(url) {
  if (url === null || url === undefined) {
  	console.error('No URL passed for linkedinUrl scraping!');
  	return;
  }
  localStorage.setItem("windowSession", "IN_PROGRESS");
  var win = window.open(url);
  win.focus();
  win.addEventListener('load', async function() {
  	win.grabLinkedInUrl = grabLinkedInUrl;
  	let resolvedUrl = await win.grabLinkedInUrl(win.document.body);
  	win.close();
  }, true);
}

async function resolveParsedLinkedInUrl() {
	if (this.localStorage.getItem("windowSession") === "FREE") {
		let resolvedUrl = localStorage.getItem("currentLinkedIn");
		updateLocalStorageString(resolvedUrl, "\r\n");
		return new Promise((resolve, reject) => { resolve(resolvedUrl); });
	} else {
		console.log('awaiting resolve...');
		setTimeout(() => {resolveParsedLinkedInUrl}, 1000);
	}
}

async function grabLinkedInUrl(winRef) {
	if (winRef === null || winRef === undefined) {
		console.error('No window reference passed for linkedInUrl scraping!');
		return;
	}
	var linkedInAnchor = $(winRef).find('.fontello-linkedin');
	var linkedInUrl;
	if (linkedInAnchor && linkedInAnchor.length > 0) {
		linkedInUrl = linkedInAnchor[0].href;
	}

	linkedInUrl = linkedInUrl ? linkedInUrl : 'Not Found';
	localStorage.setItem("currentLinkedIn", linkedInUrl);
	localStorage.setItem("windowSession", "FREE");
	return new Promise((resolve, reject) => { resolve(linkedInUrl);});
	window.close();
}

function loadMoreProspects() {
	let moreButton = $('.js-more-link');
	if (moreButton && moreButton.length > 0) {
		moreButton.click();
	}
	window.scrollTo(0, document.body.scrollHeight);
		setTimeout(() => {
			console.log('Scrolling to bottom....');
		}, 2000);
}

function updateLocalStorageString(str, postFix) {
	let updateString;
	let currentString = localStorage.getItem("angelistCSV");

	updateString = currentString === 'null' ? str + postFix : currentString + str + postFix;
	localStorage.setItem("angelistCSV", updateString);
}

async function scrapeConnections(connectionNumber, locationName) {
	console.log('Collecting ', connectionNumber, ' investors...');
	let prospectList = $('.item');
	let currentLength = prospectList.length;

	if (currentLength > connectionNumber) {
		prospectList = prospectList.slice(0, connectionNumber);
	}

	if (currentLength < connectionNumber) {
		console.log('Current prospects: ', currentLength, '/', connectionNumber);
		loadMoreProspects();
		setTimeout(() => {
			if (connectionSessionLock === false) {
				scrapeConnections(connectionNumber);
			}
		}, 2000);
		return;
	}

	console.log('Prospects loaded, starting to scrape');
	localStorage.setItem("windowSession", "FREE");
	connectionSessionLock = true;
	let csvString = '';
	for (let i = 0; i < connectionNumber; i++) {
		let prospectDOM = prospectList[i];
		await addCandidateInformation(prospectDOM, locationName);
		// let parsedUrl = await resolveParsedLinkedInUrl();
		console.log('candidate ', i + 1, '/', connectionNumber, '...');
		// console.log('parsed linkedin url: ', parsedUrl);
	}

	console.log('Successfully parsed all ' + connectionNumber +' candidates, check local storage');
	connectionSessionLock = false;
}
