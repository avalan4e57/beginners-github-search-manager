var express = require('express')
var path = require('path')
var fs = require('fs')
var addsr = require("./mymodules/add-sr.js")

var app = express()

app.use('/css', express.static(__dirname + '/public/css'))
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/public', express.static(__dirname + '/public'))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    fs.readFile(__dirname + '/managerdata.json', (err, data) => {
        if (err) return console.error(err)
        let managerdata = JSON.parse(data)
        res.render('index', { pred: managerdata.pred, inwork: managerdata.inwork })
    })
})

app.get('/search', (req, res) => {
    addsr.add(1, rend => {
        res.render('searchresults', rend)
    })
})//end app.get('/search')

app.get('/showmore', (req, res) => {
    addsr.add(req.query.page, rend => {
        res.render('searchresults', rend)
    })
})//end app.get('/showmore')

app.get('/inwork', (req, res) => {
    fs.readFile(__dirname + '/managerdata.json', (err, data) => {
        if (err) return console.error(err)
        let managerdata = JSON.parse(data)
        let newissue = JSON.parse(req.query.data)
        managerdata.inwork.push(newissue)
        fs.writeFileSync(__dirname + '/managerdata.json', JSON.stringify(managerdata))
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
