const express = require('express');
const app = express();
const path = require('path');
const handlebars = require('express-handlebars');

// SERVER
let { Server: HttpServer } = require('http');
let httpServer = new HttpServer(app);

// PORT 
const PORT = 8080;

// UTILS 
let Socket = require('./utils/sockets');
let socket = new Socket(httpServer);
socket.init()

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'))
app.use(express.static('./assets'))

// VIEW ENGINE
app.set('views', path.join(__dirname, 'views/ejs'));
app.set('view engine', 'ejs');

// ROUTES 
let views = require('./routes/viewProducts.js');
let routes = require('./routes/loadProducts.js');
let carrito = require('./routes/Cart.js');
app.use("/", views);
app.use("/api/productos", routes);
app.use("/api/carrito", carrito);

// LISTEN
httpServer.listen(PORT, () => console.log(`http://localhost:${PORT}`));