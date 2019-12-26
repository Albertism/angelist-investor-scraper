// var contactObjectArray = [];
var successfulUpdate = 0;
var failedUpdate = 0;
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
	  result.linkedInUrl = inputArray[4];
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
	  		// win.grabLinkedInUrl(win.document.body, url);
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

function launchManualUpdate(objectArray) {
	for (item of objectArray) {
		// findAndUpdateMatchingProfileLink(item);
		findAndUpdateMarketInterest(item);
	}

	console.log('Operation finished with ', successfulUpdate, ' success, ', failedUpdate, ' failed');
}

function findAndUpdateMatchingProfileLink(profileObject) {
	for (let i =0; i < contactObjectArray.length; i++) {
		let contactObject = contactObjectArray[i];
		if (profileObject == 'Not Found' || profileObject.profileLink == contactObject.profileLink) {
			contactObject.linkedInUrl = profileObject.linkedInUrl;
			successfulUpdate++;
			return;
		}
	}
	console.error('something wrong? cannot find matching one for', profileObject);
	failedUpdate++;
}

function findAndUpdateMarketInterest(marketObject) {
	for (let i =0; i < contactObjectArray.length; i++) {
		let currentObject = contactObjectArray[i];
		if (marketObject.profileLink == currentObject.profileLink) {
			currentObject.whatImLookingFor = marketObject.whatImLookingFor;
			currentObject.interestedMarkets = marketObject.interestedMarkets;
			currentObject.occurenceScore = marketObject.occurenceScore;
			successfulUpdate++;
			return;
		}
	}

	console.error('something went wrong for ', marketObject);
	failedUpdate++;
}

var finalString = '';
function parseObjectToCSVString() {
	for(item of contactObjectArray) {
		finalString += item.firstName + ';';
		finalString += item.lastName + ';';
		finalString += item.profileLink  + ';';
		finalString += item.location + ';';
		finalString += item.whatImLookingFor + ';';
		finalString += item.interestedMarkets + ';';
		finalString += item.occurenceScore + ';';
		finalString += item.linkedInUrl + '\r\n';
	}
	console.log ('complete');
}

async function updateConnectionDegreeToObject(inputArray) {
	let currentIndex = 1;
	for (contactObject of inputArray) {
		console.log('Running ', currentIndex, '/', inputArray.length, '...');
		await collectInvestorMarketsFromNewWindow(contactObject.profileLink);
		currentIndex++;
	}

	// for (let i = 0; i < 10; i++) {
	// 	await collectInvestorMarketsFromNewWindow(inputArray[i].profileLink);
	// }
}

function collectInvestorMarketsFromNewWindow(url) {
  return new Promise((resolve, reject) => {
	  if (url === null || url === undefined) {
	  	console.error('No URL passed for linkedinUrl scraping!');
	  	return;
	  }
	  var win = window.open(url);
	  win.grabInvestorMarketInfo = grabInvestorMarketInfo;
	  win.injectJQuery = injectJQuery;

	  win.window.onload = () => {
	  	timeout(0).then(() => {
	  		win.injectJQuery();
  			win.grabInvestorMarketInfo(win.document.body, url);
  			win.window.close();
  			resolve();
	  		
	  	});
	  }
  });
}


function grabInvestorMarketInfo(winRef, currentUrl) {
	if (winRef === null || winRef === undefined) {
		console.error('No window reference passed for linkedInUrl scraping!');
		return;
	}

	// what I'm looking for
	var lookingForSpan = $(winRef).find("div:contains(What I\'m Looking For)");
	var whatImLookingFor;
	if (lookingForSpan && lookingForSpan.length > 0) {
		let lookingForParentDiv = lookingForSpan[lookingForSpan.length - 3];
		whatImLookingFor = $(lookingForParentDiv).find('p')[0].textContent;		
	} else {
		console.error('something happened! could not find span. span length is', lookingForSpan.length);
	}

	// markets
	var marketSpan = $(winRef).find(".u-colorGrayB:contains(Markets)");
	var interestedMarkets;

	if (marketSpan && marketSpan.length > 0) {
		let parentSpan = $($(marketSpan[0]).parent()[0]).parent()[0];
		interestedMarkets = $(parentSpan).find('.tag');
		if (interestedMarkets.length > 0) {
			let concatMarketString = '';
			for (let i = 0; i < interestedMarkets.length; i++) {
				let currentMarket = interestedMarkets[i];
				if (i !== 0) {
					concatMarketString += ', '
				}
				concatMarketString += currentMarket.textContent;
			}
			interestedMarkets = concatMarketString;
		}
	}

	// new expr to find case insensitive
	jQuery.expr[':'].icontains = function(a, i, m) {
	  return jQuery(a).text().toUpperCase()
	      .indexOf(m[3].toUpperCase()) >= 0;
	};

	// occurence score
	var occurenceScore = 0;
	for (keyword of investorKeywords) {
		let searchString = '*:icontains(' + keyword + ')';
		let currentSpanArray = $(winRef).find(searchString);
		if (currentSpanArray.length > 0) {
			occurenceScore += Math.round(currentSpanArray.length / 17);
		}
	}

	whatImLookingFor = whatImLookingFor ? whatImLookingFor : 'Not Found';
	interestedMarkets = interestedMarkets === '' || interestedMarkets === null || interestedMarkets === undefined ? 
	'Not Found' : interestedMarkets;
	let investorMarketObject = new Object();
	investorMarketObject.profileLink = currentUrl;
	investorMarketObject.whatImLookingFor = whatImLookingFor;
	investorMarketObject.interestedMarkets = interestedMarkets;
	investorMarketObject.occurenceScore = occurenceScore - 1;

	let marketObjectList = JSON.parse(localStorage.getItem("marketObjectList") || "[]");
	marketObjectList.push(investorMarketObject);
	localStorage.setItem("marketObjectList", JSON.stringify(marketObjectList));
}

var investorKeywords = [
    'Recruiter', 'recruit', 'HR', 'Human resources', 'social impact', 'impact investor', 'underrepresented', 'minority', 'impact investing', 'diversity', 'inclusion', 'entry-level', 'talent acquisition', 'HRtech', 'Edtech'
];
