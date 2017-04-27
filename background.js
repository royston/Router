printt = function(obj){
    console.log(obj);
}

var ppp = new Array();
function fnGetPlaceDetails(placeName) {

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:8080/myapp/location?location=" + placeName, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    var allResponse = JSON.parse(xhttp.responseText);
    var places = new Array();

    for(var i in allResponse.places){
        var resp = allResponse.places[i];
        // Define desired object
        var place = {
            name:  "",
            address: "",
            placeId: ""
        };
        place.placeId = resp.placeId;
        place.address = resp.address;
        place.name = resp.name;

        places.push(place);
        ppp.push(place);
    }

    return places;
}

fnStorePlace = function(word){
    chrome.tabs.create({
        url: chrome.extension.getURL('html/picklocation.html'),
        active: true
    }, function(tab) {
        console.log("tab.id ", tab.id);
    });

    var placeName = word.selectionText;
    var places = fnGetPlaceDetails(placeName);

    var currentPlaces = new Array();

    chrome.storage.sync.get('yelpPlace', function(result){
        currentPlaces = result.yelpPlace;
        for(var place in currentPlaces){
            if(place.placeId == places[0].placeId){
                return;
            }
        }
        currentPlaces.push(places[0]);

        chrome.storage.sync.set({'yelpPlace': currentPlaces}, function(){
            console.log(currentPlaces, "saved");
        });
    });
};

chrome.storage.sync.get("yelpPlace", printt);

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
    var origin = request.origin;
    var destination = request.destination;
    var waypoint = request.waypoint;

    var optimalRoute = getShortestRoute(request.origin, request.destination, request.waypoint);

    sendResponse(optimalRoute);
});


chrome.contextMenus.create({
    id:"idx",
    title: "Save Place",
    contexts:["all", "page", "frame", "selection", "link", "editable", "browser_action", "page_action"],  // ContextType
});

chrome.contextMenus.onClicked.addListener(fnStorePlace);
