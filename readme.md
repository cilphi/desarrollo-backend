# Servidor

Con este servidor puedes:

- Generar una lista de productos y/o un carrito
- Obtener una lista de los productos y/o lo que hay en el carrito
- Obtener un solo producto o carro al ingresar su ID en la barra de direcciones
- Agregar productos y/o carros a sus respectivas listas
- Agregar productos y cantidades dentro de un carro
- Actualizar los datos de algún producto de la lista de productos
- Borrar un producto de la lista de productos

Se visualiza desde el puerto 8080, si quieres cambiarla salida, debes ir al archivo **app.js** y en la constante **PORT** escribir tu número de puerto deseado.

- Framework: Express
- Plataforma: Node.js
- Lenguaje: JavaScript

## Crear las listas

### Write File

Para crear la lista de productos:
- Consola: 
```bash
node .\src\buildProductsList.js
```
### Write Cart

Para crear la lista de carros:
- Consola: 
```bash
node .\src\buildCartsList.js
```

## Método GET

### Get Products

Para ver la lista de productos:
- URL: 
```
http://localhost:8080/products
```
### Get Carts

Para ver la lista de carritos:
- URL: 
```
http://localhost:8080/carts
```

### Get Product by ID

Para ver un solo producto:
- URL:
```
http://localhost:8080/products/a4d2c8f1-7b2e-4e6a-8c91-0f3b2e1d9a22
```
### Get Cart by ID

Para ver un solo carro:
- URL:
```
http://localhost:8080/carts/7c2a9f7d-4a6e-4c1b-bc9f-9c8c1a4e3b12
```

## Método POST

### Crear Producto

Para añadir un producto: 
- URL:
```
http://localhost:8080/products
```
- Consola:
```bash 
{
    "title": "Azul",
    "description":"Juego de estrategia y diseño de patrones con azulejos coloridos.",
    "code": "SKU-AZUL",
    "price": 42.5,
    "stock": 10,
    "status": true,
    "category": "Juegos de mesa",
    "thumbnails": [
        "https://example.com/azul/img1.jpg",
        "https://example.com/azul/img2.jpg",
        "https://example.com/azul/img3.jpg",
        "https://example.com/azul/img4.jpg"
    ]
}
```
### Crear Carro

Para añadir un carro: 
- URL:
```
http://localhost:8080/carts
```
- Consola:
```bash 
{
    "products"[
        {
            "product": "2e6c9a1b-4f5d-4a2c-8b71-9f3e0d6a5b55",
            "quantity": 1
        }
    ]
}
```
### Llenar Carro

Para añadir productos a un carro: 
- URL:
```
http://localhost:8080/carts/f3d1b6a4-8e52-4c9e-9a27-6e0b5f8d92a7
```
- Consola:
```bash 
{
    "product": "f7e1b9c3-2a8d-4c4f-9e71-6d0a1b3c8f33",
    "quantity": 5
}
```

## Método PUT

Para actualizar un producto: 
- URL:
```
http://localhost:8080/products/f7e1b9c3-2a8d-4c4f-9e71-6d0a1b3c8f33 
```
- Consola:
```bash 
{
    "stock": 10,
    "status": true
}
```
## Método DELETE

Para eliminar un producto:
- URL:
```
http://localhost:8080/products/2e6c9a1b-4f5d-4a2c-8b71-9f3e0d6a5b55
```
