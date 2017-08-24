function showSearchResults() {
    var items = []
    let uri = 'https://api.github.com/search/issues?q=language:JavaScript+is:up-for-grabs+state:open'
    $.getJSON(uri, (json) => {
        for (let item of json.items) {
            items.push({
                'url': item.html_url,
                'title': item.title,
                'body': item.body,
                'number': item.number
            })
        }
        console.log(items.length)
        $.ajax({
            method: "GET",
            data: { data: JSON.stringify(items) },
            url: "/search",
            cache: false
        })
        .done((results) => {
            $('#search-results').html(results)
        })
    })

}

function inWork() {
    $(event.target).parent().hide()
    let title = $(event.target).parent().find('a')
    console.log(title.attr('href'))
    console.log(title.text())
    let obj = {
        title: title.text(),
        url: title.attr('href')
    }
    $.ajax({
        method: "GET",
        data: { data: JSON.stringify(obj) },
        url: "/inwork",
        cache: false
    })
    .done(result => {
        let dest = $('#issue-in-work').find('ul')
        $(result).appendTo(dest)
        console.log('Issue with href=' + obj.url + ' was added to inwork list successfully')
    })
}

function delIssue() {
    let row = $(event.target).parent().parent()
    row.hide();
    let href = row.find('a').attr('href')
    console.log(href)
    $.ajax({
        method: "GET",
        data: {href: href},
        url: "/del",
        cache: false
    })
    .done((msg) => {
        console.log(msg)
    })
}

function prIssue() {
    let row = $(event.target).parent().parent()
    row.hide();
    let title = row.find('a')
    let issue = {
        url: title.attr('href'),
        title: title.text()
    }
    $.ajax({
        method: "GET",
        data: { issue: JSON.stringify(issue) },
        url: "/pr",
        cache: false
    })
    .done(result => {
        let dest = $('#pr-issue').find('ul')
        $(result).appendTo(dest)
        console.log('Issue with href=' + issue.url + ' was pr-ed list successfully')
    })
}
