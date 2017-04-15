chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // console.log(document.all[0].outerHTML)
    var nos  = document.getElementsByClassName('section-directions-trip-distance section-directions-trip-secondary-text');
    var iDiv = document.createElement('div');
    iDiv.id = 'block';
    iDiv.className = 'block';
    iDiv.textContent = 'From Extension!';
    nos[0].appendChild(iDiv);
    console.log(document.getElementsByClassName('section-directions-trip-numbers').toString())
    // If the received message has the expected format...
    if (msg.text === 'report_back') {
        console.log("content ddd");

        // Call the specified callback, passing
        // the web-page's DOM content as argument
        sendResponse('aaaaaaaa');
        // sendResponse(document.all[0].outerHTML);
    }
});