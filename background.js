printt = function(obj){
    console.log(obj);
}
var currentPlaces = new Array();

function getPlaceDetails(placeName) {

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:8080/myapp/location?location=" + placeName, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    var allResponse = JSON.parse(xhttp.responseText);
    var places = new Array();

    for(var i in allResponse.predictions){
        var resp = allResponse.predictions[i];
        // Define desired object
        var place = {
            name:  placeName,
            address: "",
            placeId: ""
        };
        place.placeId = resp.place_id;
        place.address = resp.structured_formatting.secondary_text;
        place.name = resp.structured_formatting.main_text;

        places.push(place);
    }

    return places;
}

storePlace = function(word){
    var placeName = word.selectionText;
    var places = getPlaceDetails(placeName);

    var pick = prompt("Stored Place : " + places[0].name + ", " + places[0].address);


    chrome.storage.sync.get(null, printt);
    //
    // printt(currentPlaces);
    // chrome.storage.sync.set({'yelpPlace': currentPlaces}, function(){
    //     console.log("saved");
    // });

    chrome.storage.sync.set(places[0], function(){
        console.log("Saved object");
    });
};
chrome.storage.sync.clear();
chrome.contextMenus.onClicked.addListener(storePlace);

chrome.contextMenus.create({
    id:"idx",
    title: "Save Place",
    contexts:["all", "page", "frame", "selection", "link", "editable", "browser_action", "page_action"],  // ContextType
});

// A function to use as callback
function doStuffWithDom(domContent) {
    console.log('I received the following DOM content:\n');
}
chrome.storage.sync.get("yelpPlace", printt);

console.log('I received the following DOM contentOKOK:\n');
// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function (tab) {
    console.log('I received the following DOM content:\n');
    chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
});


