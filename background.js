printt = function(obj){
    console.log(obj);
}

var ppp = new Array();
function fnGetPlaceDetails(placeName) {
    ppp = new Array();

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:8080/myapp/location?location=" + placeName, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    var allResponse = JSON.parse(xhttp.responseText);

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

        ppp.push(place);
    }
}

fnStorePlace = function(word){
    var placeName = word.selectionText;
    fnGetPlaceDetails(placeName);

    chrome.tabs.create({
        url: chrome.extension.getURL('html/picklocation.html'),
        active: true
    }, function(tab) {
        console.log("tab.id ", tab.id);
    });
};
//chrome.storage.sync.clear();

fnPersistPlace = function(placeId){
    chrome.storage.sync.get('yelpPlace', function(result){
        var currentPlaces = result.yelpPlace;
        if(currentPlaces == null){
            currentPlaces = new Array();
        }
        for(var i in currentPlaces){
            if(currentPlaces[i].placeId == placeId){
                return;
            }
        }

        //get details of place based on placeId that popup returned
        for(var i in ppp){
            if(ppp[i].placeId == placeId){
                //Got place details. Now, get deocoding details
                var xhttp = new XMLHttpRequest();
                xhttp.open("GET", "http://localhost:8080/myapp/geocode?address=" + ppp[i].address, false);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send();
                var allResponse = JSON.parse(xhttp.responseText);
                ppp[i].lat = allResponse.latitude;
                ppp[i].lng = allResponse.longitude;

                currentPlaces.push(ppp[i]);
                break;
            }
        }

        chrome.storage.sync.set({'yelpPlace': currentPlaces}, function(){
            console.log(currentPlaces, "saved");
        });
    });
}

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

