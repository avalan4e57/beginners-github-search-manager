const express = require( 'express' )
const path = require( 'path' )
const fs = require( 'fs' )
const addsr = require( "./mymodules/add-sr.js" )
const mis = require( "./mymodules/manipulate-issues.js" )

const app = express()

app.use( '/public', express.static( __dirname + '/public' ) )

app.set( 'views', path.join( __dirname, 'views' ) )
app.set( 'view engine', 'pug' )

app.get( '/', ( req, res ) => {
    fs.readFile( __dirname + '/managerdata.json', ( err, data ) => {
        if ( err )return console.error( err )
        let managerdata = JSON.parse( data )
        res.render( 'index', { pred: managerdata.pred, inwork: managerdata.inwork } )
    })
})//end app.get( '/' )

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
    mis.add( "inwork", req, issue => {
        res.render( 'inwork', issue )
    })
})//end app.get( '/inwork' )

app.get( '/del', ( req, res ) => {
    mis.add( "deleted", req, issue => {
        res.send( 'Issue with href=' + issue.url + ' was deleted successfully' )
    })
})//end app.get( '/del' )

app.get( '/pr', ( req, res ) => {
    mis.add( "pred", req, issue => {
        res.render('issue', issue)
    })
})//end app.get( '/pr' )

app.listen( 8080 )
