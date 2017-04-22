printt = function(obj){
    console.log(obj);
}

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

    // var pick = prompt("Stored Place : " + places[0].name + ", " + places[0].address);
    var currentPlaces = new Array();

    chrome.storage.sync.get('yelpPlace', function(result){
        currentPlaces = result.yelpPlace;
        currentPlaces.push(places[0]);
    });

    printt(currentPlaces);
    chrome.storage.sync.set({'yelpPlace': currentPlaces}, function(){
        console.log("saved");
    });
    chrome.storage.sync.get(null, printt);

};
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

var getShortestRoute = function(origin, destination, waypoint){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:8080/myapp/route?origin=" + origin
        + "&destination=" + destination
        + "&waypoints=" + waypoint, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    var optimalRoute = JSON.parse(xhttp.responseText);
    return optimalRoute;
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // console.log(sender.tab ?
    // "from a content script:" + sender.tab.url :
    //     "from the extension");
    // if (request.greeting == "hello")
    //     sendResponse({farewell: "ok goodbye"});

    var origin = request.origin;
    var destination = request.destination;
    var waypoint = request.waypoint;

    var optimalRoute = getShortestRoute(request.origin, request.destination, request.waypoint);

    sendResponse(optimalRoute);
});

