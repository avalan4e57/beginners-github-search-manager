const path = require( 'path' )
const fs = require( 'fs' )

exports.add = ( name, req, finish ) => {
    fs.readFile( __dirname + '/../managerdata.json', ( err, data ) => {
        if ( err )return console.error( err )
        let managerdata = JSON.parse( data )
        let curissue = JSON.parse( req.query.issue )
        if ( name === "deleted" || name === "pred" ) {
            managerdata.inwork = managerdata.inwork.filter( issue => issue.url !== curissue.url )
        }
        managerdata[name].push( curissue )
        fs.writeFileSync( __dirname + '/../managerdata.json', JSON.stringify( managerdata ) )
        finish( { issue: curissue } )
    })
}
