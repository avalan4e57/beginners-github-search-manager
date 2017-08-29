exports.add = ( cur, callback ) => {
    const path = require( 'path' )
    const fs = require( 'fs' )
    const GitHubApi = require( "github" )

    const github = GitHubApi()
    github.authenticate( {
        type: "token",
        token: process.argv[2]
    })

    const url = 'https://api.github.com/search/issues?q=language:JavaScript+is:up-for-grabs+state:open'
    let result = {}

    // Here we get required page via github API
    // The reason for this that we can't get all the results at one time
    // but only page by page because of github API limitations
    if ( cur == 1 ) {
        let queryLink = getLink( cur )
        github.getFirstPage( queryLink, ( err, data ) => {
            main( data, searchresults => {
                result.issues = searchresults
                callback( result )
            })
        })//end github.search.issues
    } else {
        let queryLink = getLink( cur )
        if ( github.hasNextPage( queryLink ) ) {
            github.getNextPage( queryLink, ( err, data ) => {
                main( data, searchresults => {
                    result.issues = searchresults
                    callback( result )
                })

            })// end github.search.issues
        } else {
            result.issues = []
            callback( result )
        }
    }

    // Returns a string like one in 'meta.link' from API response
    // We can pass the return value to functions like getNextPage()
    // from github npm package
    // For correct work of such functions from github npm package we
    // need to form only 'next' and 'first' links
    function getLink( curPage ) {
        curPage = Number( curPage )
        let next = '<' + url + '&page=' + ( curPage + 1 ).toString() + '>; rel="next"'
        let first = '<' + url + '&page=1>; rel="first"'
        let arr = [next, first]
        return arr.join( ", " )
    }

    // Main function does all the job to return formated and filtered searchresults
    // via callback argument
    function main( data, callback ) {
        // Transform API response with found issues to formated searchresults
        let searchresults = data.data.items.map( issue => {
            return {
                "url": issue.html_url,
                'title': issue.title,
                'body': issue.body,
                'number': issue.number
            }
        })
        // Filter searchresults and return them via callback argument
        // If we either have issues in work, made a pull request for issues or deleted them then
        // those issues will be filtered from searchresults array
        fs.readFile( __dirname + '/../managerdata.json', ( err, data ) => {
            if ( err ) return console.error( err )
            let managerdata = JSON.parse( data )
            let stored = managerdata.inwork.concat( managerdata.deleted ).concat( managerdata.pred )
            for ( let omit of stored ) {
                searchresults = searchresults.filter( item => item.url !== omit.url  )
            }
            callback( searchresults )
        })// end readFile
    }// end of main function
}
