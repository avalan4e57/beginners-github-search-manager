const express = require( 'express' )
const path = require( 'path' )
const fs = require( 'fs' )
const addsr = require( "./mymodules/add-sr.js" )

const app = express( )

app.use( '/css', express.static( __dirname + '/public/css' ) )
app.use( '/js', express.static( __dirname + '/public/js' ) )
app.use( '/public', express.static( __dirname + '/public' ) )

app.set( 'views', path.join( __dirname, 'views' ) )
app.set( 'view engine', 'pug' )

app.get( '/', ( req, res ) => {
    fs.readFile( __dirname + '/managerdata.json', ( err, data ) => {
        if ( err )return console.error( err )
        let managerdata = JSON.parse( data )
        res.render( 'index', { pred: managerdata.pred, inwork: managerdata.inwork } )
    })
})

app.get( '/search', ( req, res ) => {
    addsr.add( 1, rend => {
        res.render( 'searchresults', rend )
    })
})//end app.get( '/search' )

app.get( '/showmore', ( req, res ) => {
    addsr.add( req.query.page, rend => {
        res.render( 'searchresults', rend )
    })
})//end app.get( '/showmore' )

app.get( '/inwork', ( req, res ) => {
    fs.readFile( __dirname + '/managerdata.json', ( err, data ) => {
        if ( err )return console.error( err )
        let managerdata = JSON.parse( data )
        let newissue = JSON.parse( req.query.issue )
        managerdata.inwork.push( newissue )
        fs.writeFileSync( __dirname + '/managerdata.json', JSON.stringify( managerdata ) )
        res.render( 'inwork', { issue: newissue } )
    })
})

app.get( '/del', ( req, res ) => {
    fs.readFile( __dirname + '/managerdata.json', ( err, data ) => {
        if ( err )return console.error( err )
        let managerdata = JSON.parse( data )
        let issuetodel = JSON.parse( req.query.issue )
        managerdata.deleted.push( issuetodel )
        managerdata.inwork = managerdata.inwork.filter( issue => issue.url !== issuetodel.url )
        fs.writeFileSync( __dirname + '/managerdata.json', JSON.stringify( managerdata ) )
        res.send( 'Issue with href=' + issuetodel.url + ' was deleted successfully' )
    })
})

app.get( '/pr', ( req, res ) => {
    fs.readFile( __dirname + '/managerdata.json', ( err, data ) => {
        if ( err )return console.error( err )
        let managerdata = JSON.parse( data )
        let issuetopr = JSON.parse( req.query.issue )
        managerdata.pred.push( issuetopr )
        managerdata.inwork = managerdata.inwork.filter( issue => issue.url !== issuetopr.url )
        fs.writeFileSync( __dirname + '/managerdata.json', JSON.stringify( managerdata ) )
        let issue = issuetopr
        res.render( 'issue', { issue } )
    })
})

app.listen( 8080 )
