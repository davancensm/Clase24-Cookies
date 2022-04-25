import faker from "faker";
import ProductManager from "./ProductManager.js"

export default class ProductManagerExtended extends ProductManager{
    constructor(){
        super();
    }
    createProducts = (cant) => {
        const nuevos = [];
        for (let i = 0; i < cant; i++) {
            nuevos.push({
                title: faker.commerce.product(),
                price: faker.commerce.price(50, 200),
                thumbnail: faker.image.avatar()
            })
        }
        return nuevos;
    }
}