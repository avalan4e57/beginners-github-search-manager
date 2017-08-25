exports.add = (query, callback) => {
    var path = require('path')
    var fs = require('fs')
    var GitHubApi = require("github")

    var github = GitHubApi()

    github.authenticate({
        type: "token",
        token: "paste token here",
    })


    var searchresults = []
    github.search.issues({ q: query }, (err, data) => {
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
            let rend = {
                "issues": searchresults
            }
            callback(rend)
        })//end readFile
    })//end github.search.issues
}
