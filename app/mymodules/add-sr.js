exports.add = (cur, callback) => {
    var path = require('path')
    var fs = require('fs')
    var GitHubApi = require("github")

    var github = GitHubApi()

    github.authenticate({
        type: "token",
        token: "paste token here",
    })

    var curLink = []
    var url = 'https://api.github.com/search/issues?q=language:JavaScript+is:up-for-grabs+state:open'
    var result = {}

    if (cur == 1) {
        let queryLink = getLink(cur)
        console.log("FIRST"+queryLink)
        github.getFirstPage(queryLink, (err, data) => {
            main(data, searchresults => {
                result.issues = searchresults
                callback(result)
            })
        })//end github.search.issues
    } else {
        let queryLink = getLink(cur)
        console.log("FURTHER"+queryLink)
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

    function getLink(curPage) {
        curPage = Number(curPage)
        let next = '<' + url + '&page=' + (curPage + 1).toString() + '>; rel="next"'
        let first = '<' + url + '&page=1>; rel="first"'
        let arr = [next, first]
        return arr.join(", ")
    }

    function main(data, callback) {
        var searchresults = []
        // console.log(data)
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
            callback(searchresults)
        })//end readFile
    }
}
