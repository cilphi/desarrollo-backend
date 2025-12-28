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
            throw error;
        }
    }

    //Traer productos del carrito desde el archivo
    async getCart() {
        try {
            const data = await fsPromises.readFile(this.filePath, 'utf-8');
            if (!data) return [];
            const parsed = JSON.parse(data);
            console.log('Carritos cargados desde el archivo:', parsed);
            return parsed;
        } catch (error) {
            if (error.code === 'ENOENT') return [];
            console.error('Error al leer el archivo de carritos:', error);
            throw error;
        }
    }

    //Traer producto del carrito por ID
    async getCartById (id) {
        try {
            const cartProducts = await this.getCart();
            const cartProduct = cartProducts.find(item => item.id === id);
            if (!cartProduct) return {};
            return cartProduct;
        } catch (error) {
            console.error('Error al leer el archivo del carrito de compras:', error);
            throw error;
        }
    }

    //Crear el carrito
    async addCart (newCart) {
        try {
            const carts = await this.getCart();
            const pm = new ProductManager("products.json");
            const products = await pm.getProducts();            
            for (const it of (newCart.products || [])) {
                const prod = products.find(p => p.id === it.product);
                if (!prod) return "El producto que quieres añadir no existe, por favor verifica el ID";
                const qty = Number(it.quantity) || 1;
                if (Number(prod.stock) < qty) return `Stock insuficiente para el producto ${it.product}`;
            }
            for (const it of (newCart.products || [])) {
                const prod = products.find(p => p.id === it.product);
                const qty = Number(it.quantity) || 1;
                await pm.updateProduct(prod.id, { stock: Number(prod.stock) - qty });
            }
            const id = crypto.randomUUID();
            const cartToSave = { id, products: newCart.products || [] };
            carts.push(cartToSave);
            await this.#writeCart(carts);
            console.log('Nuevo carrito agregado con éxito:', cartToSave);
            return cartToSave;
        } catch (error) {
            console.error('Error al agregar el nuevo carrito:', error);
            throw error;
        }
    }

    //Agregar un ID y cantidad de producto al carrito
    async addProductToCart (cartId, {product, quantity}) {
        try {
            const carts = await this.getCart();
            const cart = carts.find(c => c.id === cartId);
            if (!cart) return "Carro no existe";
            const pm = new ProductManager('products.json');
            const products = await pm.getProducts();
            const prod = products.find(p => p.id === product);
            if (!prod) return "El producto que quieres añadir no existe, por favor verifica el ID";
            const qty = Number(quantity) || 1;
            if (Number(prod.stock) < qty) return "Stock insuficiente" + qty;
            await pm.updateProduct(prod.id, { stock: Number(prod.stock) - qty });
            const existing = cart.products.find(p => p.product === product);
            if (existing) {
                existing.quantity = Number(existing.quantity) + qty;
            } else {
                cart.products.push({ product, quantity: qty });
            }
            await this.#writeCart(carts);
            console.log('Nuevo producto agregado con éxito al carrito:', cart);
            return cart;
        } catch (error) {
            console.error('Error al agregar el nuevo producto:', error);
            throw error;
        }
    }
}