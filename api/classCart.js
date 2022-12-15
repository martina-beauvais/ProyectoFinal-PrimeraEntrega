const fs = require('fs');
const Products = require('./classProducts');
const  {getTimestamp, checkLength, checkID, newID} = require('../utils/functions')

class Container {
    constructor(ruta){
        this.ruta = ruta;
    }
    

    async newCart(){
        let products = [];
        let timestamp = getTimestamp();
        let carts = await Products.getAllProducts();
        let id = 1; 
        if(carts.length > 0){
            id = newID(carts);
        }
        this.saveCart({id, timestamp, products});
        return {id, timestamp, products};
    }

    async saveCart(cart){
        let carts = await Products.getAllProducts();
        carts.push(cart);
        try {
            await fs.promises.writeFile(this.ruta, JSON.stringify(carts, null, 2));
        } catch (error) {
            console.log('ERROR EN SAVE CART !');
        }
    }

    async saveCarts(carts){
        try {
            await fs.promises.writeFile(this.ruta, JSON.stringify(carts, null, 2));
        } catch (error) {
            console.log('ERROR EN SAVE CARTS!');
        }
    }

    async updateCart(cart){
        let carts = await Products.getAllProducts();
        let index = carts.map(element => element.id == id);
        carts.splice(index, 1);
        console.log(cart);
        carts.push(cart);
        await this.saveCarts(carts);
        return true;
    }

    async addToCart(cartID, product){
        let cart = await Products.getById(cartID);
        cart.push(product);
        await this.updateCart(cart);
    }

    async deleteCartProduct(cartID, productID){
        let cart = await Products.getById(cartID);
        try {
            if(cart === null){
                throw new Error('Id de carrito no encontrado')
            }
            let newCart = cart.filter(element => element.id =! productId)
            await this.saveCart(newCart)
        } catch (error) {
            console.log('ERROR EN DELETE CART PRODUCT ! ')
            console.log(error)
        }
    }
}

module.exports = Container; 