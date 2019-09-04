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

// const Cat = mongoose.model('Cat', { name: String });
// const products = mongoose.model('products', 
// {
//     pname: String, 
//     price: Number, 
//     rating: Number, 
//     imgurl: String, 
//     suitable_age: {
//         minage : Number,
//         maxage: Number
//     },
//     suitable_gender: String,
//     suitable_haircolor: String,
//     suitable_hairlength: String,
//     suitable_skincolor: String
// }
// );
// const kitty = new Cat({ name: 'Zildjian' });

// const newproduct = new products({ 
//     pname: 'Dove Best Shampoo', 
//     price: '5.70', 
//     rating: '4.5', 
//     imgurl: 'https://dove-en-uk-stage.unileversolutions.com/content/dam/unilever/dove/global/Dove.png',
//     suitable_age: {
//         minage: 18,
//         maxage: 30
//     },
//     suitable_gender: 'male',
//     suitable_haircolor: 'blond',
//     suitable_hairlength: 'long',
//     suitable_skincolor: 'white'
// });

// newproduct.save().then(() => {
//     console.log('product saved');
// })


app.get('/', function(req, res) {
    //res.send(req);
    var url = require('url');
    var keys = Object.keys(req.query);
    var jsonparams = keys[0];

    console.log(jsonparams);

    // products.findOne({ age: jsonparams.age }).exec(function(err,prod){
    //     console.log(err,prod)
    // }
    // )

});

server.listen(5000, 'localhost');
server.on('listening', function() {
    console.log('Express server started on port %s at %s', server.address().port, server.address().address);
});