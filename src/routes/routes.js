import express from 'express';
import ProductManagerExtended from '../managers/ProductMocks.js';
import MessageManager from '../managers/MessageManager.js';

const products = new ProductManagerExtended();
const messages = new MessageManager();


const router = express.Router();



router.get('/products', (req,res) =>{
    const allProducts = products.getAll()
    .then((data) => res.send(data))
})

router.get('/products-test', (req,res) =>{
    const allProducts = products.createProducts(5)
    res.send(allProducts);
})

router.post('/products', (req,res) => {
    const producto = req.body
    products.save(producto)
})

router.get('/messages', (req,res) =>{
    const allMessages = messages.getAll()
    .then((data) => res.send(data))
})

router.post('/messages', (req,res) => {
    const message = req.body
    messages.save(message)
})


export default router;