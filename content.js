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

var prevLocation = null;

var fnCheckLocation = function(){
    var location = window.location.pathname;
    //Check if maps is currently displaying a navigation
    if(location.match('/maps/dir') != null && location.match('/maps/dir').index == 0){
        //Check if direction has changed
        if(prevLocation != location){
            console.log("Old Location : " , prevLocation.split('/')[3], '$$$$$', prevLocation.split('/')[4]);
            console.log("New location : " , location.split('/')[3], '$$$$$', location.split('/')[4]);
            prevLocation = location;


        }
    }

};
setInterval( fnCheckLocation, 3000 );