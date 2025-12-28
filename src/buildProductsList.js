import {promises as fsPromises} from 'fs';

//Listado de productos
const products = [
    {
        id: "c1b9a7e4-3a4f-4c9a-9f6b-1a2e3d4f5a01",
        title: "Catan",
        description: "Juego de estrategia y negociación donde los jugadores colonizan una isla y comercian recursos.",
        code: "SKU-CATAN",
        price: 45.99,
        stock: 12,
        status: true,
        category: "Juegos de mesa",
        thumbnails: [
        "https://example.com/catan/img1.jpg",
        "https://example.com/catan/img2.jpg",
        "https://example.com/catan/img3.jpg",
        "https://example.com/catan/img4.jpg"
        ]
    },
    {
        id: "a4d2c8f1-7b2e-4e6a-8c91-0f3b2e1d9a22",
        title: "Carcassonne",
        description: "Juego de colocación de losetas donde se construyen ciudades, caminos y campos.",
        code: "SKU-CARC",
        price: 39.5,
        stock: 8,
        status: true,
        category: "Juegos de mesa",
        thumbnails: [
        "https://example.com/carcassonne/img1.jpg",
        "https://example.com/carcassonne/img2.jpg",
        "https://example.com/carcassonne/img3.jpg",
        "https://example.com/carcassonne/img4.jpg"
        ]
    },
    {
        id: "f7e1b9c3-2a8d-4c4f-9e71-6d0a1b3c8f33",
        title: "Ticket to Ride",
        description: "Juego familiar de construcción de rutas ferroviarias a lo largo del mapa.",
        code: "SKU-TTR",
        price: 49.99,
        stock: 0,
        status: false,
        category: "Juegos de mesa",
        thumbnails: [
        "https://example.com/tickettoride/img1.jpg",
        "https://example.com/tickettoride/img2.jpg",
        "https://example.com/tickettoride/img3.jpg",
        "https://example.com/tickettoride/img4.jpg"
        ]
    },
    {
        id: "9d3a6f2e-5b8c-4e1a-9c2f-7a4b6d8e1a44",
        title: "Dixit",
        description: "Juego creativo de cartas e ilustraciones basado en la imaginación y la narrativa.",
        code: "SKU-DIXIT",
        price: 34.75,
        stock: 15,
        status: true,
        category: "Juegos de mesa",
        thumbnails: [
        "https://example.com/dixit/img1.jpg",
        "https://example.com/dixit/img2.jpg",
        "https://example.com/dixit/img3.jpg",
        "https://example.com/dixit/img4.jpg"
        ]
    },
    {
        id: "2e6c9a1b-4f5d-4a2c-8b71-9f3e0d6a5b55",
        title: "Pandemic",
        description: "Juego cooperativo donde los jugadores trabajan juntos para detener brotes de enfermedades globales.",
        code: "SKU-PAND",
        price: 44.0,
        stock: 5,
        status: true,
        category: "Juegos de mesa",
        thumbnails: [
        "https://example.com/pandemic/img1.jpg",
        "https://example.com/pandemic/img2.jpg",
        "https://example.com/pandemic/img3.jpg",
        "https://example.com/pandemic/img4.jpg"
        ]
    }
];

const writeProductsFile = async () => {
    try {
        await fsPromises.writeFile('products.json', JSON.stringify(products, null, 2), 'utf-8');
        console.log('El archivo con los productos fue creado con éxito.');
    } catch (error) {
        console.error('Error al crear el archivo de productos:', error);
    }
}

writeProductsFile();