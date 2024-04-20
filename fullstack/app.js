// console.log("Starting");

let express = require('express');
let categoryRouter = express.Router();
let productRouter = express.Router();
const router = express.Router({
    caseSensitive: true, // Make routing case-sensitive example, /about and /About would be considered as different routes
    strict: true // Enforce strict routing example, /about and /about/ would be treated as different routesz
  });

let dotenv = require('dotenv');
dotenv.config();

let morgan = require('morgan');
let fs = require('fs');

let category = {
    "categories": [
        {
            "id": 1,
            "name": "Electronics",
            "description": "Electronic devices and accessories"
        },
        {
            "id": 2,
            "name": "Clothing",
            "description": "Apparel and fashion accessories"
        },
        {
            "id": 3,
            "name": "Books",
            "description": "Books and literature"
        },
        {
            "id": 4,
            "name": "Home & Kitchen",
            "description": "Home appliances, decor, and kitchenware"
        },
        {
            "id": 5,
            "name": "Sports & Outdoors",
            "description": "Sports equipment and outdoor gear"
        }
    ]
}
let product = [
    {
        "id": 1,
        "name": "Product 1",
        "description": "Description of Product 1",
        "price": 19.99,
        "category": "Electronics"
    },
    {
        "id": 2,
        "name": "Product 2",
        "description": "Description of Product 2",
        "price": 29.99,
        "category": "Clothing"
    },
    {
        "id": 3,
        "name": "Product 3",
        "description": "Description of Product 3",
        "price": 9.99,
        "category": "Home & Kitchen"
    },
    {
        "id": 4,
        "name": "Product 4",
        "description": "Description of Product 4",
        "price": 49.99,
        "category": "Sports & Outdoors"
    },
    {
        "id": 5,
        "name": "Product 5",
        "description": "Description of Product 5",
        "price": 39.99,
        "category": "Books"
    }
]

let app = express();

let port = process.env.PORT || 3000;


app.use(morgan('combined', { stream: fs.createWriteStream('./app.log') }));

app.get('/category', (req, res) => {
    // res.sendFile(__dirname + '/category.json');
    res.send(category);
})

categoryRouter.route('/details', (req, res) => {
    res.send(category);
})




app.get('/product', (req, res) => {
    // res.send(product);
    res.sendFile(__dirname + '/product.json');
})

app.use('/products', productRouter);

productRouter.get('/details', (req, res) => {
    res.send(product);
})








app.listen(port, (err) => {
    if (err) console.error(err);
    console.log(`Server starting at ${port}`);
});


