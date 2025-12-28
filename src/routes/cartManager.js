import crypto from 'crypto'
import {promises as fsPromises} from 'fs'

//Clase CartManager
export class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }
    //Escribir en el archivo de carritos
    async #writeCart () {
        try {
            await fsPromises.writeFile(this.filePath, JSON.stringify(carts, null, 2), 'utf-8');
            console.log('El archivo con los carritos fue creado con éxito.');
        } catch (error) {
            console.error('Error al crear el archivo de carritos:', error);
        }
    }

    //Traer productos del carrito desde el archivo
    async getCart() {
        try {
            const data = await fsPromises.readFile(this.filePath, 'utf-8');
            if (!data) {
                return [];
            }
            const parsed = JSON.parse(data);
            console.log('Productos cargados desde el archivo:', parsed);
            return parsed;
        } catch (error) {
            if (error.code === 'ENOENT') return [];
            console.error('Error al leer el archivo de productos:', error);
            return [];
        }
    }

    //Traer producto del carrito por ID
    async getCartById (id) {
        try {
            const cartProducts = await this.getCart();
            const cartProduct = cartProducts.find(item => item.id === id);
            if (!cartProduct) {
                return {};
            } return cartProduct;
        } catch (error) {
            console.error('Error al leer el archivo del carrito de compras:', error);
        }
    }

    //Crear el carrito
    async addCart (newCart) {
        try {
            const cart = await this.getCart();
            if (cart.length !== 0){
            const exists = cart.some(item => item.id === newCart.id);
            if (exists) {
                console.log('Error: Ya existe un producto con el ID:', newCart.id);
                return null;
            }
            }
            const id = crypto.randomUUID();
            cart.push({id, ...newCart});
            await this.#writeCart(cart, JSON.stringify(cart, null, 2), 'utf-8');
            console.log('Nuevo producto agregado con éxito:', newCart);
            return {id, ...newCart};
        } catch (error) {
            console.error('Error al agregar el nuevo producto:', error);
        }
    }

    //Agregar un ID y cantidad de producto al carrito
    async addProductToCart (id, quantity) {
        try {
            const cartProducts = await this.getCart();
            const exists = cartProducts.some(item => item.id === id);
            if (!exists) {
                console.log('Error: Este carro no ha sido creado aún:', id);
                return "Carro no existe";
            };
            const productId = productId.find('products.json', id);
            if (!productId) {
                console.log('Error: No existe un producto con el ID:', id);
                return "El producto que quieres añadir no existe, por favor verifica el ID";
            };
            const newCartProduct = cartProducts.map(item => {
                if (item.id === id) return {...item, quantity: quantity || 1};
                return item;
            });
            await this.#writeCart(cartProducts, JSON.stringify(cartProducts, null, 2), 'utf-8');
            console.log('Nuevo producto agregado con éxito:', newCartProduct);
            return {...newCartProduct};
        } catch (error) {
            console.error('Error al agregar el nuevo producto:', error);
        }
    }    
}