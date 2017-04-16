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

var getCurrentPlaces = function(result){
    console.log('GET : ',  result);
    currentPlaces = result.yelpPlace;
    var placeId = currentPlaces[0].placeId;
    placeId = "place_id:" + placeId;

    chrome.runtime.sendMessage({origin: origin, destination: destination, waypoint: placeId}, function(response) {
        console.log(response.origin, response.destination, response.waypoint, response.time, response.distance);
    });
};
var updateDirectionsList = function(){
    var routes = document.getElementsByClassName('section-listbox')[1];
    var clonedFirstCh = routes.children[0].cloneNode(true);
    clonedFirstCh.id = 'roy-id';
    routes.appendChild(clonedFirstCh);

    chrome.storage.local.get('yelpPlace', getCurrentPlaces);
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