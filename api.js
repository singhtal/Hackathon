var express = require('express');
var http = require('http');
var cors = require('cors')

var app = express();
app.use(cors());
var server = http.createServer(app);

//connect to mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://talvinder:7838@Mongo@titans-6igk3.mongodb.net/test?retryWrites=true&w=majority',
{useNewUrlParser: true});

const DoveProducts = mongoose.model('products',
{
    productName: String,
    productUrl: String,
    imgurl: String,
    artile: {
      image: String,
      text: String,
      url: String
    },
    suitableFor: {
        minage : Number,
        maxage: Number,
        gender: String,
        hairColor: String,
        hairLength: String
    }
}
);


// const newproduct = new DoveProducts(
//   {
//       productName: "MEN+CARE FRESH & CLEAN FORTIFYING 2IN1 SHAMPOO AND CONDITIONER",
//       productUrl: "https://www.dove.com/uk/men-care/hair-care/men-care-fresh-clean-fortifying-2in1-shampoo-and-conditioner.html",
//       imgurl: "https://www.dove.com/content/dam/unilever/dove/united_kingdom/pack_shot/fortifying_8710908381195_t1-1408992.png.ulenscale.460x460.png",
//       artile: {
//         image: "https://www.dove.com/content/dam/unilever/dove/global/general_image/personal_care_unidentified/personal_care_unidentified/day04_shot02_022_teaser-280000.jpg.ulenscale.218x218.jpg",
//         text: "For men, dry hair can be caused by a lot of things, from hot water to drying methods, but it’s easy to treat. Here’s how to handle dry hair with some simple changes",
//         url: "https://www.dove.com/uk/stories/tips-and-how-to/grooming-tips/how-to-treat-dry-hair.html"
//       },
//       suitableFor: {
//           minage : 50,
//           maxage: 70,
//           gender: "male",
//           hairColor: "black",
//           hairLength: "short"
//       }
//   }
// );
//
// newproduct.save().then(() => {
// })


app.get('/', function(req, res) {
    //res.send(req);
    var url = require('url');
    var keys = Object.keys(req.query);
    var jsonparams = keys[0];

    var userObj = JSON.parse(jsonparams);

    var hairColor = (userObj.hairColor).toLowerCase();
    var hairLength= (userObj.hairLength).toLowerCase();
    var gender = (userObj.gender).toLowerCase();
    var skinColor = (userObj.race).toLowerCase();
    var userage = parseInt(userObj.age);
    var finalResults = {};

// for hair products
    DoveProducts.find(
      {
        'suitableFor.minage': { $lt: userage },
        'suitableFor.maxage': { $gt: userage },
        'suitableFor.gender': gender.toLowerCase(),
        'suitableFor.hairColor': hairColor.toLowerCase(),
        'suitableFor.hairLength': hairLength.toLowerCase()
      },

      function (err, hairproducts) {
        if (err) return console.error(err);
        finalResults['products_hair'] = hairproducts;
      });


// for skin DoveProducts
DoveProducts.find(
  {
    'suitableFor.minage': { $lt: userage },
    'suitableFor.maxage': { $gt: userage },
    'suitableFor.gender': gender.toLowerCase(),
    'suitableFor.skinColor': skinColor.toLowerCase()
  },

  function (err, skinproducts) {
    if (err) return console.error(err);
    finalResults['products_skin'] = skinproducts;
    console.log(skinproducts.length);
    //console.log(skinproducts);
  });


// for articles
      DoveProducts.find(
        {
          'suitableFor.minage': { $lt: userage },
          'suitableFor.maxage': { $gt: userage },
          'suitableFor.gender': gender.toLowerCase()
        },

        function (err, articlesList) {
          if (err) return console.error(err);
          finalResults['articles'] = articlesList;
          //console.log(articlesList.length);

          // console.log('result here ---->>>>')
          // console.log(JSON.stringify(finalResults));

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(finalResults));

        });


});

server.listen(5000, 'localhost');
server.on('listening', function() {
    console.log('Express server started on port %s at %s', server.address().port, server.address().address);
});
