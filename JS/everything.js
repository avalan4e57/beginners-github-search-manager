function requestJSON(url, callback) {
    $.ajax({
      url: url,
      complete: function(xhr) {
        callback.call(null, xhr.responseJSON);
      }
    });
}
$(function(){
$('#main-search').on('click', function(e){
    e.preventDefault();
    var requri = 'https://api.github.com/search/issues?q=language:JavaScript+is:up-for-grabs+state:open';
    requestJSON(requri, function(json) {
        if (json.message == 'Not found') {
            // $('#search-results').html("Nothing matches the request");
            console.log("Some error. No search results");
        } else {
            var resultsNumber = json.total_count;
            var outHTML = "";
            var items = json.items;
            items.forEach(function(item, i, items) {
                outHTML += addSearchResultItem(item);
            });
            $('#test').html(outHTML);
            console.log(json);
        } //end else statement
    } // end requestJSON function
); // end click event handler
});
});

function addSearchResultItem(item) {
    var outHTML = "";
    var title = '<div class="item-title"><a href="' + item.html_url + '">' + item.title + '</a></div>';
    var descr = '<div class="item-descr">' + item.body + '</div>';
    var number = '<div class="item-number">#' + item.number + '</div>';
    outHTML = number + title + descr;
    outHTML = '<li>' + outHTML + '</li>';
    return outHTML;
}
