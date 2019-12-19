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
	let experimentList = contactObjectArray.slice(0, 15);
	console.log('testing on size: ', experimentList.length);

	for (contactObj of experimentList) {
		await timeout(100);
		collectLinkedInUrlFromNewWindow(contactObj.profileLink);
	}

	console.log('operation complete')
}

function collectLinkedInUrlFromNewWindow(url) {
  if (url === null || url === undefined) {
  	console.error('No URL passed for linkedinUrl scraping!');
  	return;
  }
  var win = window.open(url);
  win.grabLinkedInUrl = grabLinkedInUrl;

  win.window.onload = () => {
  	win.grabLinkedInUrl(win.document.body);
  	win.window.close();
  }
}


function grabLinkedInUrl(winRef) {
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
	linkedInContactObject.profileLink = window.location.href;
	linkedInContactObject.linkedInUrl = linkedInUrl;

	let linkedInObjectArray = JSON.parse(localStorage.getItem("linkedinUrlObjects") || "[]");
	linkedInObjectArray.push(linkedInContactObject);
	localStorage.setItem("linkedinUrlObjects", JSON.stringify(linkedInObjectArray));

}

function timeout(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
