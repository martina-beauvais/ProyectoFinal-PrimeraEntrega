const CarritoClass = require('../api/classCart.js');
const Carrito = new CarritoClass('./resources/carrito.json');
const Products = require('../api/classProducts.js');
const Productos = new Products('./resources/productos.json');

const {Router} = require('express');
let router = new Router();

router.get('/:id/products', async (req, res, next) => {
    let cart = await Carrito.getById(req.params.id)
    if(cart){
        res.json({
            products : cart.products
        })
    }
    else{res.status(404).send('ID not found')}
})

router.post('/', async (req, res, next) => {
    let cart = await Carrito.newCart();
    res.json({
        new_cart : cart
    })
}) 

router.delete('/:id', async (req, res) => {
    let id = req.params.id
    try {
        let deleted = await Carrito.deleteById(id)
        res.json({deleted_product : deleted})
    } catch (error) {
        res.status(400).send(`${error}`)
    }
})

router.post('/:id/productos', async (req, res)=> {
    let cart = await Carrito.getById(req.params.id)
    // Para agregar un producto al carrito 
    // en el body debera enviarse un objeto solo con la propiedad "id"
    // Ej {"id" : 2}
    let body = req.body
    let product = await Productos.getById(body.id)
    if(cart && product){
        cart.products.push(product)
        await Carrito.updateCart(cart)
        res.json({
            new_product : product,
            on_cart : cart
        })
    }
    else{res.status(404).send('Cart ID or Product ID not found')}
})
router.delete('/:id/productos/:id_prod', async (req, res)=> {
    let cart = await Carrito.getById(req.params.id);
    let product = await Productos.getById(req.params.id_prod);
    cart ? product ? cart.products.some(element => element.id === product.id) ? (await Carrito.updateCart({...cart, "products" : cart.products.filter(element => element.id != product.id)}), res.json({deleted_product : product})) : 
        res.status(404).send('Product is not in cart') :
            res.status(404).send('Product ID not found') :
                res.status(404).send('Cart ID not found');
})

module.exports = router; 