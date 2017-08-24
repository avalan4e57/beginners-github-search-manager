var express = require('express')
var path = require('path')
var fs = require('fs')
var GitHubApi = require("github");

var app = express()
var github = GitHubApi()

app.use('/css', express.static(__dirname + '/public/css'))
app.use('/js', express.static(__dirname + '/public/js'))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, 'onload.html'))
    fs.readFile(__dirname + '/managerdata.json', (err, data) => {
        if (err) return console.error(err)
        let managerdata = JSON.parse(data)
        res.render('index', { pred: managerdata.pred, inwork: managerdata.inwork })
    })
})

app.get('/search', (req, res) => {
    var searchresults = []

    github.authenticate({
        type: "token",
        token: "b1881cd13b64b30d7ccbb40a50d2a4a0f52089eb",
    })

    github.search.issues({ q: 'language:JavaScript+is:up-for-grabs+state:open' }, (err, data) => {
        // console.log(data)
        for (let issue of data.data.items) {
            searchresults.push({
                "url": issue.html_url,
                'title': issue.title,
                'body': issue.body,
                'number': issue.number
            })
        }

        fs.readFile(__dirname + '/managerdata.json', (err, data) => {
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
            res.render('searchresults', {issues: searchresults})
        })//end readFile
    })//end github.search.issues
})//end app.get('/search')

app.get('/nav/number', (req, res) => {

})

app.get('/inwork', (req, res) => {
    fs.readFile(__dirname + '/managerdata.json', (err, data) => {
        if (err) return console.error(err)
        let managerdata = JSON.parse(data)
        let newissue = JSON.parse(req.query.data)
        managerdata.inwork.push(newissue)
        fs.writeFileSync(__dirname + '/managerdata.json', JSON.stringify(managerdata))
        // res.send('New issue was added in work successfully')
        res.render('inwork', { issue: newissue })
    })
})

app.get('/del', (req, res) => {
    let href = req.query.href
    fs.readFile(__dirname + '/managerdata.json', (err, data) => {
        if (err) return console.error(err)
        let managerdata = JSON.parse(data)
        managerdata.inwork = managerdata.inwork.filter((issue) => {
            return issue.url !== href
        })
        managerdata.deleted.push(href)
        fs.writeFileSync(__dirname + '/managerdata.json', JSON.stringify(managerdata))
        res.send('Issue with href=' + href + ' was deleted successfully')
    })
})

app.get('/pr', (req, res) => {
    fs.readFile(__dirname + '/managerdata.json', (err, data) => {
        if (err) return console.error(err)
        let managerdata = JSON.parse(data)
        let newIssue = JSON.parse(req.query.issue)
        managerdata.pred.push(newIssue)
        managerdata.inwork = managerdata.inwork.filter((issue) => {
            return issue.url !== newIssue.url
        })
        fs.writeFileSync(__dirname + '/managerdata.json', JSON.stringify(managerdata))
        res.render('issue', { newIssue })
    })
})

app.listen(8080)
