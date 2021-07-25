// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

$("#productSearch").on("keydown", function(event) {
  console.log("keydown observed");
  if (event.which == 13) {
    console.log("searched for :-" + $("#productSearch").val());
    $("#searchResults").html("");
    getSearchItems($("#productSearch").val());
  }
});

function getSearchItems(searchString) {
  var searchUrl =
    "https://www.meijer.com/shop/en/search//results/?q=" + searchString;
  fetch(searchUrl)
    .then(response => {
      return response.json();
    })
    .then(myJson => {
      console.log(myJson);
      var searchSummary =
        "<div> Displaying 48 results out of " +
        myJson.pagination.totalNumberOfResults +
        "</div>";
      $("#searchResults").append(searchSummary);
      for (var key in myJson.results) {
        var innerDiv =
          '<div class="container producResults">' +
          '<div class="row">' +
          '<div class="col-md-6 col-xs-6 text-right">' +
          '<img src="' +
          myJson.results[key].images[0].url +
          '" style="height: 100px;width:150px"/>' +
          "</div>" +
          '<div class="col-md-6 col-xs-6">' +
          "<p>" +
          myJson.results[key].name +
          "</p>" +
          "<p>" +
          myJson.results[key].price.formattedValue +
          "</p>" +
          '<a href="https://meijer.com/shop' +
          myJson.results[key].url +
          '" target="_blank">Click to see on meijer.com</a>' +
          "</div>" +
          "</div>" +
          "</div>";
        $("#searchResults").append(innerDiv);
        $("#searchResults").append("<hr />");
      }
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (request.searchString) {
    sendResponse({ searchString: "goodbye" });
  }
});
var tabcontent = document.getElementsByClassName("tabcontent");
var tab = document.getElementsByClassName("tablinks");
for (var i = 0; i < tabcontent.length; i++) {
  tabcontent[i].style.display = "none";
  document.getElementById("searchList").style.display = "block";
}
$("#coupons").click(function(elemnt) {
  console.log("coupons clicked");
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    document.getElementById("couponList").style.display = "block";
  }
  for (var j = 0; j < tab.length; j++) {
    tab[j].classList.remove("active");
  }
  document.getElementById("coupons").classList.add("active");
  getCoupons();
});

var searchList = document.getElementById("searchList");
$("#search").click(function(elemnt) {
  console.log("search clicked");
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    document.getElementById("searchList").style.display = "block";
  }
  for (var j = 0; j < tab.length; j++) {
    tab[j].classList.remove("active");
  }
  document.getElementById("search").classList.add("active");
});
$("#favoritesonsale").click(function(elemnt) {
  console.log("fav on sale clicked");
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    document.getElementById("favList").style.display = "block";
  }
  for (var j = 0; j < tab.length; j++) {
    tab[j].classList.remove("active");
  }
  document.getElementById("favoritesonsale").classList.add("active");
});
$("#savings").click(function(elemnt) {
  console.log("rewards clicked");
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    document.getElementById("rewardsList").style.display = "block";
  }
  for (var j = 0; j < tab.length; j++) {
    tab[j].classList.remove("active");
  }
  document.getElementById("savings").classList.add("active");
});
function display(element) {
  console.log("clicked -" + element);
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    document.getElementById(element).style.display = "block";
  }
}
function getCoupons(searchCriteria) {
  var options = {};
  options.searchCriteria = searchCriteria;
  options.sortType = 0;
  options.clippedFromTS = null;
  options.pageSize = 48;
  options.currentPage = 1;
  options.ceilingCount = 0;
  options.ceilingDuration = 0;
  options.rewardCouponId = 0;
  options.categoryId = "";
  options.tagId = "";
  options.getOfferCountPerDepartment = false;
  options.upcId = 0;
  options.showClippedCoupons = false;
  options.showOnlySpecialOffers = false;
  options.showRedeemedOffers = false;
  options.offerIds = [];
  options.showBackToAllCoupons = false;
  options.type = 1;
  fetch("https://www.meijer.com/bin/meijer/offer", {
    method: "post",
    body: JSON.stringify(options)
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data.listOfCoupons);
      var couponSummary =
        "<div> Displaying 48 results out of " +
        data.listOfCoupons.length +
        "</div>";
      $("#couponLists").append(couponSummary);
      for (var key in data.listOfCoupons) {
        var innerDiv =
          '<div class="container couponResults">' +
          '<div class="row">' +
          '<div class="col-md-6 col-xs-6 text-right">' +
          '<img src="' +
          data.listOfCoupons[key].offer.imageURL +
          '" style="height: 100px;width:150px"/>' +
          "</div>" +
          '<div class="col-md-6 col-xs-6">' +
          "<p>" +
          data.listOfCoupons[key].offer.title +
          "</p>" +
          "<p>" +
          data.listOfCoupons[key].offer.description +
          "</p>" +
          '<a href="https://www.meijer.com/mperks/coupons.html" target="_blank">Click to see on meijer.com</a>' +
          "</div>" +
          "</div>" +
          "</div>";
        $("#couponLists").append(innerDiv);
        $("#couponLists").append("<hr />");
      }
    });
}
$("#couponSearch").on("keydown", function(event) {
  console.log("keydown observed");
  if (event.which == 13) {
    console.log("searched for :-" + $("#couponSearch").val());
    $("#couponLists").html("");
    getCoupons($("#couponSearch").val());
  }
});
