var items;

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
            var outHTML = '<h2>' + resultsNumber + ' issues</h2>';
            items = json.items;
            items.forEach(function(item, i, items) {
                outHTML += addSearchResultItem(item, i);
            });
            $('#search-results').html(outHTML);
            console.log(json);
            $('.in-work').on('click', function(e) {
                e.preventDefault();
                var itemPosition = getNumberFromString($(this).parent().attr('id'));
                console.log("IP="+itemPosition);
                $(this).parent().hide();
                addIssueInWork(itemPosition);
            });
        } //end else statement
    } // end requestJSON function
); // end click event handler
});
});

function addSearchResultItem(item, position) {
    var outHTML = '';
    var title = '<div class="item-title"><h4><a href="' + item.html_url + '">' + item.title + '</a></h4></div>';
    var descr = '<div class="item-descr">' + item.body + '</div>';
    var number = '<div class="item-number">#' + item.number + '</div>';
    var inWorkButton = '<button type="button" class="in-work btn btn-primary">In Work</button>'
    outHTML = number + title + descr + inWorkButton;
    outHTML = '<li id="item-' + position + '">' + outHTML + '</li>';
    return outHTML;
}

function getNumberFromString(str) {
    var numberPos = str.indexOf(/^\d+/);
    var number = str.slice(numberPos);
    return number;
}

function addIssueInWork(position) {
    var issuesInWork = $('#issue-in-work').find('ul').html();
    issuesInWork += '<li><a href="' + items[position].html_url + '">' + items[position].title + '</a></li>';
    $('#issue-in-work').find('ul').html(issuesInWork);
}
