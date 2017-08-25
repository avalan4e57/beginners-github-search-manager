exports.add = (cur, last, callback) => {
    var path = require('path')
    var fs = require('fs')
    var GitHubApi = require("github")

    var github = GitHubApi()

    github.authenticate({
        type: "token",
        token: "b1881cd13b64b30d7ccbb40a50d2a4a0f52089eb",
    })

    var curLink = []
    var url = 'https://api.github.com/search/issues?q=language:JavaScript+is:up-for-grabs+state:open'
    var result = {}

    if (cur == 1) {
        curLink = [
            getLink("next", url, cur, last),
            getLink("last", url, cur, last),
            getLink("first", url, cur, last)
        ]
        result.totalPages = curLink[1]

        let queryLink = curLink.join(", ")
        console.log(queryLink)
        github.getFirstPage(queryLink, (err, data) => {
            main(data, searchresults => {
                result.issues = searchresults
                callback(result)
            })
        })//end github.search.issues
    } else {
        curLink = [
            getLink("next", url, cur, last),
            getLink("last", url, cur, last),
            getLink("first", url, cur, last),
            getLink("prev", url, cur, last)
        ]

        let queryLink = curLink.join(", ")
        console.log(queryLink)
        if (github.hasNextPage(queryLink)) {
            github.getNextPage(queryLink, (err, data) => {
                main(data, searchresults => {
                    result.issues = searchresults
                    callback(result)
                })

            })//end github.search.issues
        } else {
            result.issues = []
            callback(result)
        }
    }



    ///////////////////////////
    function getLink(name, url, curPage, lastPage) {
        curPage = Number(curPage)
        var link = ""
        switch (name) {
            case "next":
                link += '<' + url + '&page=' + (curPage + 1).toString() + '>; rel="next"'
                break;
            case "prev":
                link += '<' + url + '&page=' + (curPage - 1).toString() + '>; rel="prev"'
                break;
            case "first":
                link += '<' + url + '&page=1>; rel="first"'
                break;
            case "last":
                link += '<' + url + '&page=' + lastPage + '>; rel="last"'
                break;
            default:
                link = null
        }
        return link
    }

    function main(data, callback) {
        var searchresults = []
        console.log(data)
        for (let issue of data.data.items) {
            searchresults.push({
                "url": issue.html_url,
                'title': issue.title,
                'body': issue.body,
                'number': issue.number
            })
        }

        fs.readFile(__dirname + '/../managerdata.json', (err, data) => {
            if (err) return console.error(err)
            let managerdata = JSON.parse(data)
            for (let stored of managerdata.inwork) {
                searchresults = searchresults.filter((item) => {
                    return item.url !== stored.url
                })
            }
            for (let deleted of managerdata.deleted) {
                searchresults = searchresults.filter((item) => {
                    return item.url !== deleted
                })
            }
            for (let stored of managerdata.pred) {
                searchresults = searchresults.filter((item) => {
                    return item.url !== stored.url
                })
            }
            // let rend = {
            //     "issues": searchresults,
            //     "totalPages": totalPages
            // }
            callback(searchresults)
        })//end readFile
    }
}
