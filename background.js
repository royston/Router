
// A function to use as callback
function doStuffWithDom(domContent) {
    console.log('I received the following DOM content:\n');
}
console.log('I received the following DOM content:\n');
// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function (tab) {
    console.log('I received the following DOM content:\n');
    chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
});