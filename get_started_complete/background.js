"use strict";
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (request.searchString) {
    var searchUrl =
      "https://www.meijer.com/shop/en/search//results/?q=" +
      request.searchString;
    var xhr = new XMLHttpRequest();
    var url =
      "https://www.meijer.com/shop/en/search//results/?q=" +
      request.searchString;
    var resp;
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        // WARNING! Might be evaluating an evil script!
        resp = xhr.responseText;
        chrome.tabs.query({ active: true, currentWindow: true }, function(
          tabs
        ) {
          chrome.tabs.sendMessage(tabs[0].id, { searchResults: resp }, function(
            response
          ) {
            console.log(response);
          });
        });
      }
    };
    xhr.send();
  }
});
