import express from 'express';
import { ProductManager } from './src/routes/productManager.js';
import { CartManager } from './src/routes/cartManager.js';

const app = express();

const PORT = 8080;

/* Middleware para parsear JSON */
app.use(express.json());

/* Métodos HTTP */

//GET Lista productos
app.get('/products', async (__,res) => {
    try {
        const productManager = new ProductManager("products.json");
        const products = await productManager.getProducts();    
    res.json(products);
    } catch (error) {
        res.status(500).json({msg: 'Error al obtener los productos'});
    }
});

//GET Lista carritos
app.get("/carts",async (__,res)=>{
    try {
        const cartManager = new CartManager("carts.json")
        const carts = await cartManager.getCart()
        res.json(carts)
    } catch (error) {
        res.json({message:error.message})
    }
});

//GET Producto por ID
app.get('/products/:id', async (req, res) => {
    try {
    const {id} = req.params;
    const productManager = new ProductManager("products.json");
    const product = await productManager.getProductById(id);
    res.json({msg: 'Producto encontrado', product: product});
    } catch (error) {
        res.status(500).json({msg: 'Error al obtener el producto'});
    }
});

//GET Carrito por ID
app.get("/carts/:id",async(req,res)=>{    
    try {
        const {id} = req.params
        const cartManager = new CartManager("carts.json")
        const cartProduct = await cartManager.getCartById(id)
        res.json({message:'Carro encontrado', cart: cartProduct})        
    } catch (error) {
        res.json({message:error.message})
    }
});

//POST Crear producto
app.post('/products/', async (req, res) => {
    const body = req.body;
    if (!body.title || !body.description || !body.price || !body.code || !body.stock || !body.category) {
        return res.status(400).json({msg: 'Faltan datos obligatorios para crear el producto'});
    }
    const productManager = new ProductManager("products.json");
    const newProduct = await productManager.addProduct(body);
    res.json({msg: 'Producto agregado', product: newProduct});
});

//POST Crear carrito
app.post("/carts", async (req, res) => {
    try {
        const body = req.body;
        // accept either { products: [{product, quantity}, ...] } or { product, quantity }
        let items = [];
        if (Array.isArray(body.products)) {
            items = body.products;
        } else {
            if (!body.product || typeof body.product !== 'string') {
                return res.status(400).json({ message: "Olvidaste colocar el ID del producto (string)" });
            }
            if (body.quantity === undefined || typeof body.quantity !== 'number') {
                return res.status(400).json({ message: "Ingresa una cantidad válida" });
            }
            items = [{ product: body.product, quantity: body.quantity }];
        }
        const productManager = new ProductManager("products.json");
        const products = await productManager.getProducts();
        const cartProducts = [];
        for (const it of items) {
            const prod = products.find(p => p.id === it.product);
            if (!prod) return res.status(404).json({ message: `Producto no encontrado: ${it.product}` });
            const quantity = Math.min(Number(it.quantity ?? 1), Number(prod.stock ?? Infinity));
            cartProducts.push({ product: prod.id, quantity });
        }
        const cartManager = new CartManager("carts.json");
        const newCart = { products: cartProducts };
        const created = await cartManager.addCart(newCart);
        if (!created) return res.status(409).json({ message: "Este carro ya existe" });
        return res.status(201).json({ message: "Carro agregado con éxito", cart: created });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

//POST Agregar producto al carrito por ID
app.post("/carts/:cartId/product/:productId", async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const body = req.body;
        if (body.product && typeof body.product !== 'string') {
            return res.status(400).json({ message: 'El campo "product" debe ser string' });
        }
        if (body.quantity && typeof body.quantity !== 'number') {
            return res.status(400).json({ message: 'El campo "quantity" debe ser number' });
        }
        const cartManager = new CartManager("carts.json");
        const qty = body.quantity ?? 1;
        const result = await cartManager.addProductToCart(cartId, { product: productId, quantity: qty });
        if (result === "Carro no existe") return res.status(404).json({ message: 'Carro no existe' });
        if (result === "El producto que quieres añadir no existe, por favor verifica el ID") return res.status(404).json({ message: result });
        if (result === "Stock insuficiente") return res.status(409).json({ message: result });
        console.log('addProductToCart ->', { cartId, productId, body });
        return res.json({ message: 'Los productos del carrito fueron añadidos con éxito', cart: result });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

//PUT
app.put('/products/:id', async (req, res) => {
    try {
    const {id} = req.params;
    const body = req.body;
    const productManager = new ProductManager("products.json");
    const updatedProduct = await productManager.updateProduct(id, body);
    if (updatedProduct === null) {
        return res.status(404).json({msg: 'Producto no encontrado'});
    }
    res.json({msg: 'Producto actualizado', product: updatedProduct});
    } catch (error) {
        res.status(500).json({msg: 'Error al actualizar el producto'});
    }
});

//DELETE
app.delete('/products/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const productManager = new ProductManager("products.json");
        const deletedProduct = await productManager.deleteProduct(id);
        if (deletedProduct === null) {
            return res.status(404).json({msg: 'Producto no encontrado'});
        }
        res.json({msg: 'Producto eliminado', product: deletedProduct});
    } catch (error) {
        res.status(500).json({msg: 'Error al eliminar el producto'});
    }
});

//Servidor escuchando
app.listen(PORT, () => {
    console.log(`Servidor Express en puerto ${PORT}`);
});