var testing = true;

var prevLocation = '';

var printt = function(obj){
    console.log(obj);
}

var currentPlaces = new Array();
var origin = '';
var destination = '';
var waypointName = '';

var optimalRoute = null;
var getCurrentPlaces = function(result){

};
var updateDirectionsList = function(){
    chrome.runtime.sendMessage({origin: origin, destination: destination}, function(response) {
        var routes = document.getElementsByClassName('section-listbox')[1];
        var clonedFirstCh = document.getElementById("roy-id")
        if(clonedFirstCh == null){
            clonedFirstCh = routes.children[0].cloneNode(true);
            clonedFirstCh.style["background-color"] = "peachpuff";
            clonedFirstCh.id = 'roy-id';
            clonedFirstCh.backgroundColor = "burlywood";
        }

        optimalRoute = response;
        console.log(response.origin, response.destination, response.waypoint, response.time, response.distance);

        if(optimalRoute != null){
            routes.appendChild(clonedFirstCh);
        }

        var time = optimalRoute.timeHoursMins;
        var dist = optimalRoute.distance;
        var docHeading = clonedFirstCh.getElementsByClassName('section-directions-trip-title')[0];
        var docTime = clonedFirstCh.getElementsByClassName('section-directions-trip-duration')[0].childNodes[1];
        var docDistance = clonedFirstCh.getElementsByClassName('section-directions-trip-distance section-directions-trip-secondary-text')["0"].children[2].childNodes["0"];
        var docDesc = clonedFirstCh.childNodes[3].childNodes[1].childNodes[5].childNodes[1];
        docDesc.textContent = '';
        docHeading.textContent = 'via ' + optimalRoute.waypoint;
        docTime.textContent = time;
        docDistance.textContent = dist + ' miles';

    });

    // if(testing = true){
    //     //Only for testing. Since chrome sync takes a while to sync places
    //     resultObj = {
    //         yelpPlace:[{
    //             name:  'Chipotle Mexican Grill',
    //             address: "Middlefield Road, Redwood City, CA, United States",
    //             placeId: 'ChIJU3OawOGej4ARUKHj1NBTLTg'
    //         }]
    //     };
    //
    //     getCurrentPlaces(resultObj);
    // }else{
    //     chrome.storage.sync.get('yelpPlace', getCurrentPlaces);
    // }

};

var fnCheckLocation = function(){
    var location = window.location.pathname;
    //Check if maps is currently displaying a navigation
    if(location.match('/maps/dir') != null && location.match('/maps/dir').index == 0){
        //Check if direction has changed
        if(prevLocation != location){
            prevLocation = location;
            origin = location.split('/')[3];
            destination = location.split('/')[4];

            updateDirectionsList();
        }
    }

};

fnCheckLocation();
setInterval( fnCheckLocation, 3000 );


var starsElem = document.getElementsByClassName('stars-directive');
console.log('stars : ', starsElem["0"].attributes["pclnrating"].value);
var amenitiesUL = document.getElementById('amenitiy__popup').getElementsByClassName('highlight__popup--content')["0"].childNodes["0"]
var listItems = amenitiesUL.getElementsByTagName("li");
var amenities = new Array();
console.log('Amenities');
for(var i in listItems){
    var listItem = listItems[i];
    amenities.push(listItem.textContent);
    console.log(listItem.textContent);
}
console.log(starsElem["pclnrating"])