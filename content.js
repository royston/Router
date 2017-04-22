var testing = true;
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // console.log(document.all[0].outerHTML)
    var nos  = document.getElementsByClassName('section-directions-trip-distance section-directions-trip-secondary-text');
    var iDiv = document.createElement('div');
    iDiv.id = 'block';
    iDiv.className = 'block';
    iDiv.textContent = 'From Extension!';
    nos[0].appendChild(iDiv);
    console.log(document.getElementsByClassName('section-directions-trip-numbers').toString())

    console.log('Hola. Received message ');
    console.log(msg);
    // If the received message has the expected format...
    if (msg.text === 'report_back') {
        console.log("content ddd");

        // Call the specified callback, passing
        // the web-page's DOM content as argument
        sendResponse('aaaaaaaa');
        // sendResponse(document.all[0].outerHTML);
    }
});

var prevLocation = window.location.pathname;

var printt = function(obj){
    console.log(obj);
}

var currentPlaces = new Array();
var origin = '';
var destination = '';
var waypointName = '';

var optimalRoute = null;
var getCurrentPlaces = function(result){
    console.log('GET : ',  result);
    currentPlaces = result.yelpPlace;
    var placeId = currentPlaces[Math.floor(Math.random() * (currentPlaces.length - 1))].placeId;
    placeId = "place_id:" + placeId;
    waypointName = currentPlaces[Math.floor(Math.random() * (currentPlaces.length - 1))].name;

    chrome.runtime.sendMessage({origin: origin, destination: destination, waypoint: placeId}, function(response) {
        optimalRoute = response;
        console.log(response.origin, response.destination, response.waypoint, response.time, response.distance);
    });
};
var updateDirectionsList = function(){
    var routes = document.getElementsByClassName('section-listbox')[1];
    var clonedFirstCh = document.getElementById("roy-id")
    if(clonedFirstCh == null){
        clonedFirstCh = routes.children[0].cloneNode(true);
        clonedFirstCh.id = 'roy-id';
    }
    if(optimalRoute != null){
        routes.appendChild(clonedFirstCh);
    }


    if(testing = true){
        //Only for testing. Since chrome sync takes a while to sync places
        resultObj = {
            yelpPlace:[{
                name:  'Chipotle Mexican Grill',
                address: "Middlefield Road, Redwood City, CA, United States",
                placeId: 'ChIJU3OawOGej4ARUKHj1NBTLTg'
            }]
        };

        getCurrentPlaces(resultObj);
    }else{
        chrome.storage.sync.get('yelpPlace', getCurrentPlaces);
    }

    var time = optimalRoute.timeHoursMins;
    var dist = optimalRoute.distance;
    var docHeading = clonedFirstCh.getElementsByClassName('section-directions-trip-title')[0];
    var docTime = clonedFirstCh.getElementsByClassName('section-directions-trip-duration')[0].childNodes[1];
    var docDistance = clonedFirstCh.getElementsByClassName('section-directions-trip-distance section-directions-trip-secondary-text')["0"].children[2].childNodes["0"];
    var docDesc = clonedFirstCh.childNodes[3].childNodes[1].childNodes[5].childNodes[1];
    docDesc.textContent = '';
    docHeading.textContent = 'via ' + waypointName;
    docTime.textContent = time;
    docDistance.textContent = dist + ' miles';
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
setInterval( fnCheckLocation, 3000 );