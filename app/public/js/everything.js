window.onload = () => {
    history.replaceState("", document.title, window.location.pathname)
    $('#loading-image').hide()
}

function showSearchResults() {
    $('#loading-image').show()
    $.ajax({
        method: "GET",
        url: "/search",
        cache: false
    })
    .done((results) => {
        history.pushState("", document.title, window.location + "?page=1")
        $('#loading-image').hide()
        $(results).appendTo($("#search-results").find('ul'))
    })
}

function showMore() {
    $(event.target).hide()
    $('#loading-image').show()
    let pageNumber = window.location.search.substr(1).split("=")[1]
    pageNumber++
    history.pushState("", document.title, window.location.pathname + "?page=" + pageNumber.toString())
    let data = pageNumber
    console.log(data)
    $.ajax({
        method: "GET",
        data: { page: data },
        url: "/showmore",
        cache: false
    })
    .done(results => {
        $('#loading-image').hide()
        $(results).appendTo($("#search-results").find('ul'))
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
