var contactObjectArray = [];
function parseStringToObject(inputString) {
	let lineArray = inputString.split("\r\n");
	for (item of lineArray) {
		let parsedArray = item.split("|");
		let createdObject = createContactObject(parsedArray);
		if (createdObject !== null) {
			contactObjectArray.push(createdObject);
		}
	}
}

function createContactObject(inputArray) {
	let result = new Object();

	if (inputArray.length > 0) {
	  result.firstName = inputArray[0];
	  result.lastName = inputArray[1];
	  result.profileLink = inputArray[2];
	  result.location = inputArray[3];
	} else {
		return null;
	}

	return result;
}

async function updateObjectArrayWithLinkedInUrl(inputString) {
	parseStringToObject(inputString); // string to object list;
	let experimentList = contactObjectArray.slice(0, 5);
	console.log('testing on size: ', experimentList.length);

	for (contactObj of contactObjectArray) {
		// await timeout(100);
		await collectLinkedInUrlFromNewWindow(contactObj.profileLink);
	}

	console.log('operation complete')
}

function collectLinkedInUrlFromNewWindow(url) {
  return new Promise((resolve, reject) => {
	  if (url === null || url === undefined) {
	  	console.error('No URL passed for linkedinUrl scraping!');
	  	return;
	  }
	  var win = window.open(url);
	  win.grabLinkedInUrl = grabLinkedInUrl;
	  win.injectJQuery = injectJQuery;

	  win.window.onload = () => {
	  	timeout(100).then(() => {
	  		win.injectJQuery();
	  		win.grabLinkedInUrl(win.document.body, url);
	  		win.window.close();
	  		resolve();
	  	});
	  }
  });
}


function grabLinkedInUrl(winRef, currentUrl) {
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
	let linkedInContactObject = new Object();
	linkedInContactObject.profileLink = currentUrl;
	linkedInContactObject.linkedInUrl = linkedInUrl;

	let linkedInObjectArray = JSON.parse(localStorage.getItem("linkedinUrlObjects") || "[]");
	linkedInObjectArray.push(linkedInContactObject);
	localStorage.setItem("linkedinUrlObjects", JSON.stringify(linkedInObjectArray));

}

function timeout(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function injectJQuery() {
    (function l(u, i) {
        var d = document;
        if (!d.getElementById(i)) {
            var s = d.createElement('script');
            s.src = u;
            s.id = i;
            d.body.appendChild(s);
        }
    }
    ('//code.jquery.com/jquery-3.2.1.min.js', 'jquery'))
}

// manual operations

function launchManualUpdate(profileLinkObjectArray) {
	for (item of profileLinkObjectArray) {

	}
}

function findMatchingProfileLink(profileObject) {
	for (contactObject of contactObjectArray) {
		if (profileObject.profileLink) {

		}
	}
}