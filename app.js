//importing modules
var express = require( 'express' );
var request = require( 'request' );
var cheerio = require( 'cheerio' );

//creating a new express server
var app = express();



//setting EJS as the templating engine
app.set( 'view engine', 'ejs' );

//setting the 'assets' directory as our static assets dir (css, js, img, etc...)
app.use( '/assets', express.static( 'assets' ) );


function getLBCUrl( callback ) {
    request( {
        url: 'https://www.leboncoin.fr/ventes_immobilieres/1076257949.htm?ca=12_s', //URL to hit
        qs: { from: 'blog example', time: +new Date() }, //Query string data
        method: 'GET', //Specify the method
        headers: { //We can define headers too
            'Content-Type': 'MyContentType',
            'Custom-Header': 'Custom Value'
        }
    }, function ( error, response, body ) {
        if ( error ) {
            console.log( error );
        } else {
            callback( body )
        }
    })
};


//makes the server respond to the '/' route and serving the 'home.ejs' template in the 'views' directory
app.get( '/', function ( req, res ) {
    getLBCUrl( function ( body ) {

        var $ = cheerio.load( body );

        console.log( $( 'span.value.text' ) )


        res.render( 'home', {

            message: body

        });
    })
});




//launch the server on the 3000 port
app.listen( 3000, function () {
    console.log( 'App listening on port 3000!' );
})