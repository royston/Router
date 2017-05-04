printt = function(obj){
    console.log(obj);
}
var places = new Array();
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
        places = result.yelpPlace;
        if(places == null){
            places = new Array();
        }
        for(var i in places){
            if(places[i].placeId == placeId){
                return;
            }
        }

        //get details of place based on placeId that popup returned
        for(var i in ppp){
            if(ppp[i].placeId == placeId){
                //Got place details. Now, get deocoding details
                $.ajax({
                    type: "GET",
                    url: "http://localhost:8080/myapp/geocode?address="  + ppp[i].address,
                    // The key needs to match your method's input parameter (case-sensitive).
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data){
                        ppp[i].lat = data.latitude;
                        ppp[i].lng = data.longitude;

                        places.push(ppp[i]);
                    },
                    failure: function(errMsg) {
                        alert(errMsg);
                    }
                });
                break;
            }
        }

        chrome.storage.sync.set({'yelpPlace': places}, function(){
            console.log(places, "saved");
        });
    });
}

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


$(document).ready(function() {
    chrome.storage.sync.get('yelpPlace', function(result){
        //Cache current places
        places = result.yelpPlace;
    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        var optimalRoute = null;
        var routeOptions = {
            places,
            'origin' : request.origin,
            'destination': request.destination
            };
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/myapp/cartesianclosest",
            // The key needs to match your method's input parameter (case-sensitive).
            data: JSON.stringify(routeOptions),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function(data){
                var origin = request.origin;
                var destination = request.destination;
                var waypoint = data.address;

                optimalRoute = getShortestRoute(request.origin, request.destination, data.address);
                optimalRoute.waypoint = data.name;
                console.log(optimalRoute);
                sendResponse(optimalRoute);
            },
            failure: function(errMsg) {
                console.log(errMsg);
            }
        });
    });


    chrome.contextMenus.create({
        id:"idx",
        title: "Save Place",
        contexts:["all", "page", "frame", "selection", "link", "editable", "browser_action", "page_action"],  // ContextType
    });

    chrome.contextMenus.onClicked.addListener(fnStorePlace);
});