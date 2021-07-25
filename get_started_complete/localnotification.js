console.log("meijer extension logging");
var url = document.location.host;
console.log(url);
var productStringSearched;
if (url.includes("www.google.com")) {
  console.log("i am on google site" + url);
  if (document.location.search.includes("q=")) {
    var urlParams = new URLSearchParams(window.location.search);
    var productStringSearched = urlParams.get("q");
    console.log("user has searched for - " + productStringSearched);
    obtainProductDetails(productStringSearched);
  }
}
if (url.includes("www.amazon.com")) {
  console.log("i am on amazon site" + url);
  if (document.location.search.includes("k=")) {
    var urlParams = new URLSearchParams(window.location.search);
    var productStringSearched = urlParams.get("k");
    console.log("user has searched for - " + productStringSearched);
    obtainProductDetails(productStringSearched);
  }
}
if (url.includes("www.walmart.com")) {
  console.log("i am on amazon site" + url);
  if (document.location.search.includes("query=")) {
    var urlParams = new URLSearchParams(window.location.search);
    var productStringSearched = urlParams.get("query");
    console.log("user has searched for - " + productStringSearched);
    obtainProductDetails(productStringSearched);
  }
}

function obtainProductDetails(searchString) {
  console.log(
    "user has searched for - " +
      searchString +
      " - calling meijer to see if we have anything related"
  );
  chrome.runtime.sendMessage({ searchString: searchString }, function(
    response
  ) {
    console.log(response);
  });
  /*var xhr = new XMLHttpRequest();
  var url =
    "https://www.meijer.com/shop/en/search//results/?q=" +
    productStringSearched;
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // WARNING! Might be evaluating an evil script!
      var resp = xhr.responseText;
    }
  };
  xhr.send();*/
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("listener in content script" + request.searchResults);
  //var iFrame = document.createElement("iframe");
  //iFrame.src = chrome.extension.getURL("productRecommendation.html");
  //iFrame.setAttribute("id", "OffersIframe");
  //document.body.insertBefore(iFrame, document.body.firstChild);
  var offerResults = JSON.parse(request.searchResults);
  if (offerResults.results.length > 0) {
    var outerhtml =
      '<div id="offerResults"><div class="mjrHeading"> ' +
      'Find more items at meijer <span onclick="closeOffers" id="closeOffers">x</span></div>' +
      '<div id="mjrContainer">';
    var innerDiv = "";
    for (var key in offerResults.results) {
      var loopingContent =
        '<div class="mjrRow">' +
        '<div class="col-md-6 col-xs-6 text-right">' +
        '<img class="offersImage" src="' +
        offerResults.results[key].images[1].url +
        '"/>' +
        "</div>" +
        '<div class="col-md-6 col-xs-6">' +
        "<p style='color:#181db0'>" +
        offerResults.results[key].name +
        "</p>" +
        "<p>" +
        offerResults.results[key].price.formattedValue +
        "</p>" +
        '<a href="https://meijer.com/shop' +
        offerResults.results[key].url +
        '" target="_blank">Click to see on meijer.com</a>' +
        "</div>" +
        "</div>";
      innerDiv += loopingContent;
    }
    console.log(innerDiv);

    var endhtml =
      '</div><div id="mjr-right-button"><img width="30" src="' +
      chrome.extension.getURL("right-arrow-angle-svgrepo-com.svg") +
      '" /></div>' +
      '<div id="mjr-left-button"><img width="30" src="' +
      chrome.extension.getURL("left-arrow-angle-svgrepo-com.svg") +
      '" /></div></div>';
    //<span class="PUDfGe z1asCe kKuqUd"><svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg></span></div></div>';
    //iFrame.src = outerhtml + innerDiv + endhtml;
    //iFrame.contentWindow.document.write(outerhtml + innerDiv + endhtml);
    //document.body.insertBefore(iFrame, document.body.firstChild);
    var d1 = document.getElementsByTagName("body")[0];
    d1.insertAdjacentHTML("afterbegin", outerhtml + innerDiv + endhtml);
    document.getElementById("closeOffers").onclick = function() {
      console.log(this.parentNode.parentNode.parentNode);
      this.parentNode.parentNode.parentNode.removeChild(
        this.parentNode.parentNode
      );
    };
    document.getElementById("mjr-right-button").onclick = function() {
      console.log("clicked right scroll");
      document.getElementById("offerResults").scrollLeft += 200;
    };
    document.getElementById("mjr-left-button").onclick = function() {
      console.log("clicked right scroll");
      document.getElementById("offerResults").scrollLeft -= 200;
    };
    return false;
  }
});
