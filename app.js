//importing modules
var express = require( 'express' );
var request = require( 'request' );
var cheerio = require( 'cheerio' );



//creating a new express server
var app = express();

//define the global variable
price=''
city=''
type=''
surface=''
squareMeterPrice=''
priceOnTheMarketA=''
priceOnTheMarketM=''
isAGoodDealOrNot=''



//setting EJS as the templating engine
app.set( 'view engine', 'ejs' );

//setting the 'assets' directory as our static assets dir (css, js, img, etc...)
app.use( '/assets', express.static( 'assets' ) );

/*
function getLBCUrl( callback ) {
    request( {
        url: 'https://www.leboncoin.fr/voitures/1079409718.htm?ca=12_s', //URL to hit
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
*/


function callLeboncoin() {
    var url='https://www.leboncoin.fr/ventes_immobilieres/1033586175.htm?ca=12_s';
    var result;
    request(url,function(error,response,html){
        if (!error && response.statusCode==200){
            const $=cheerio.load(html);
            const lbcDataArray=$('section.properties span.value');

            var lbcData={
                price:parseInt($(lbcDataArray.get(0)).text().replace(/\s/g,''),10),
                city:$(lbcDataArray.get(1)).text().trim().toLowerCase().replace(/\_!\s/g/0,'-'),
                type: $(lbcDataArray.get(3)).text().trim().toLowerCase(),
                surface:parseInt($(lbcDataArray.get(5)).text().replace(/\s/g,''),10),
                squarePrice:parseInt($(lbcDataArray.get(0)).text().replace(/\s/g,''),10)/parseInt($(lbcDataArray.get(5)).text().replace(/\s/g,''),10)
            }
            result=lbcData
            console.log("data",lbcData);
        }
        else{
            console.log("error",error);
        }
        
    })
};


function callLeMeilleurAgent(){
    var url='https://www.meilleursagents.com/prix-immobilier/paris-75000/';
    request(url,function(error,response,html){
        if (!error && response.statusCode==200){
            const $=cheerio.load(html);
            const lbcDataArray=$('section.section div.small-4');

             var lbcData={
                testVar:parseInt($(lbcDataArray.get(4)).text().replace(/\s/g,''),10),
                deux:parseInt($(lbcDataArray.get(7)).text().replace(/\s/g,''),10)
            }

              console.log("data",lbcData);
        }
        else{
            console.log("error",error);
        }
    })

};


function dealOrNot(url){
    // var url='https://www.leboncoin.fr/ventes_immobilieres/1033586175.htm?ca=12_s';
    request(url,function(error,response,html){
        if (!error && response.statusCode==200){
            const $=cheerio.load(html);
            const lbcDataArray=$('section.properties span.value');

            var lbcData={
                price:parseInt($(lbcDataArray.get(0)).text().replace(/\s/g,''),10),
                city:$(lbcDataArray.get(1)).text().trim().toLowerCase().replace(/\_!\s/g/0,'-'),
                type: $(lbcDataArray.get(3)).text().trim().toLowerCase(),
                surface:parseInt($(lbcDataArray.get(5)).text().replace(/\s/g,''),10),
                squarePrice:parseInt($(lbcDataArray.get(0)).text().replace(/\s/g,''),10)/parseInt($(lbcDataArray.get(5)).text().replace(/\s/g,''),10)
            }
            price=lbcData.price;
            city=lbcData.city;
            type=lbcData.type;
            surface=lbcData.surface;
            squareMeterPrice=lbcData.squarePrice;
            console.log("data",lbcData);
        }
        else{
            console.log("error",error);
        }
    })


var url2='https://www.meilleursagents.com/prix-immobilier/paris-75000/';
    request(url2,function(error,response,html){
        if (!error && response.statusCode==200){
            const $=cheerio.load(html);
            const lbcDataArray2=$('section.section div.small-4');

             var lbcData2={
                appart:parseInt($(lbcDataArray2.get(4)).text().replace(/\s/g,''),10),
                maison:parseInt($(lbcDataArray2.get(7)).text().replace(/\s/g,''),10)
            }
            priceOnTheMarketA=lbcData2.appart;
            priceOnTheMarketM=lbcData2.maison;
            console.log("data2",lbcData2);
        }
        else{
            console.log("error",error);
        }
    })
    if(squareMeterPrice<=priceOnTheMarketM)
    {
        isAGoodDealOrNot='this is a really bad deal';
    }
    else
    {
        isAGoodDealOrNot='this is a really a good deal';
    }
};



//makes the server respond to the '/' route and serving the 'home.ejs' template in the 'views' directory
app.get( '/', function ( req, res ) {
    //getLBCUrl( function ( body ) {
        //console.log(req.Query)
        //var $ = cheerio.load( body );
       //console.log( $( 'span.value.text' ) )
        var url = req.query.urlLBC
        res.render( 'home', {
            message: url ,price:price,city:city,type:type,surface:surface,
            squareMeterPrice:squareMeterPrice,
            priceOnTheMarketA:priceOnTheMarketA,
            priceOnTheMarketM:priceOnTheMarketM,
            is:isAGoodDealOrNot
        });
        dealOrNot(url);

    //})
});




//callLeboncoin();
//callLeMeilleurAgent();

//launch the server on the 3000 port
app.listen( 3000, function () {
    console.log( 'App listening on port 3000!' );
})
