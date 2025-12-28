import crypto from 'crypto'
import {promises as fsPromises} from 'fs'
import { ProductManager } from './productManager.js';

//Clase CartManager
export class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }
    //Escribir en el archivo de carritos
    async #writeCart (carts) {
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
            //Uso de Product Manager
            const pm = new ProductManager("products.json");
            const products = await pm.getProducts();
            if (!products.find(p => p.id === product)) return "El producto que quieres añadir no existe, por favor verifica el ID";
            const id = crypto.randomUUID();
            carts.push({id, ...newCart});
            await this.#writeCart(carts, JSON.stringify(carts, null, 2), 'utf-8');
            console.log('Nuevo producto agregado con éxito:', newCart);
            return {id, ...newCart};
        } catch (error) {
            console.error('Error al agregar el nuevo producto:', error);
        }
    }

    //Agregar un ID y cantidad de producto al carrito
    async addProductToCart (cartId, {product, quantity}) {
        try {
            const carts = await this.getCart();
            const cart = carts.find(c => c.id === cartId);
            if (!cart) {
                console.log('Error: Este carro no ha sido creado aún:', cartId);
                return "Carro no existe";
            };
            const exists = cart.products.some(p => p.product === product);
            if (exists) {
                exists.quantity = Number(exists.quantity) + (Number(quantity) || 1);
            } else {
                cart.products.push({product, quantity: Number(quantity) || 1});
            }
            await this.#writeCart(carts, JSON.stringify(carts, null, 2), 'utf-8');
            console.log('Nuevo producto agregado con éxito al carrito:', cart);
            return {...cart};
        } catch (error) {
            console.error('Error al agregar el nuevo producto:', error);
        }
    }    
}