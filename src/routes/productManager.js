import crypto from 'crypto';
import {promises as fsPromises} from 'fs';

//Clase ProductManager
export class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async #writeProducts () {
        try {
            await fsPromises.writeFile(this.filePath, JSON.stringify(products), 'utf-8');
            console.log('El archivo con los productos fue creado con éxito.');
        } catch (error) {
            console.error('Error al crear el archivo de productos:', error);
        }
    }

    //Taer productos desde el archivo
    async getProducts() {
        try {
            const data = await fsPromises.readFile(this.filePath, 'utf-8');
            const parsed = JSON.parse(data, null, 2);
            console.log('Productos cargados desde el archivo:', parsed);
            return parsed;
        } catch (error) {
            console.error('Error al leer el archivo de productos:', error);
        }
    }
    
    //Traer producto por ID
    async getProductById (id) {
        try {
            const products = await this.getProducts();
            const product = products.find(item => item.id === id);
            if (!product) {
                return {};
            } return product;
        } catch (error) {
            console.error('Error al leer el archivo de productos:', error);
        }
    }
        
    //Agregar un nuevo producto
    async addProduct (newProduct) {
        try {
            const products = await this.getProducts();
            const exists = products.some(item => item.code === newProduct.code);
            if (exists) {
                console.log('Error: Ya existe un producto con el código:', newProduct.code);
                return null;
            };
            const id = crypto.randomUUID();
            products.push({id, ...newProduct});
            await this.#writeProducts(products, JSON.stringify(products, null, 2), 'utf-8');
            console.log('Nuevo producto agregado con éxito:', newProduct);
            return {id, ...newProduct};
        } catch (error) {
            console.error('Error al agregar el nuevo producto:', error);
        }
    }
    
    //Actualizar un producto
    async updateProduct (id, updatedFields) {
        try {
            const products = await this.getProducts();
            const exists = products.some(item => item.id === id);
            if (!exists) {
                console.log('Error: No existe un producto con el ID:', id);
                return null;
            };
            const updatedProduct = products.map(item => {
                if (item.id === id) return {...item, ...updatedFields};
                return item;
            });
            await this.#writeProducts(updatedProduct, JSON.stringify(updatedProduct, null, 2), 'utf-8');
            console.log('Producto actualizado con éxito:', updatedProduct.find(item => item.id === id));
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    }
    
    //Eliminar un producto
    async deleteProduct (id) {
        try {
            const products = await this.getProducts();
            const exists = products.some(item => item.id === id);
            if (!exists) {
                console.log('Error: No existe un producto con el ID:', id);
                return null;
            };
            const deletedProducts = products.filter(item => item.id !== id);
            await this.#writeProducts(deletedProducts, JSON.stringify(deletedProducts, null, 2), 'utf-8');
            console.log('Producto eliminado con éxito.');
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    }
}