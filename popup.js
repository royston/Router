document.addEventListener('DOMContentLoaded', function () {
    var bg = chrome.extension.getBackgroundPage();
    var places = bg.ppp;


    var table = $('<table class="table table-bordered table-hover"></table>');
    var tableBody = $('<tbody></tbody>');
    for(var i in places){
        var row = $('<tr></tr>');
        var idCell = $('<td></td>');
        var inputRadio = $('<input type="radio" id="placeId" value="' + places[i].placeId + '">'+ places[i].name+'</input>');
        idCell.append(inputRadio);
        var desriptionCell = $('<td></td>').text(places[i].address);
        row.append(idCell);
        row.append(desriptionCell);
        tableBody.append(row);
    }
    table.append(tableBody);

    $('#here_table').append(table);

    $('#locationForm').submit(function(e){
        e.preventDefault(); // Prevent submission
        var placeId = $('input[id=placeId]:checked', '#locationForm')[0].value;
        chrome.runtime.getBackgroundPage(function(bgWindow) {
            bgWindow.fnPersistPlace(placeId);
            window.close();     // Close dialog
        });
    });
});
