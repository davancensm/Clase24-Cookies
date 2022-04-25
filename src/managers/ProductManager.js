import fs from 'fs';
/*
    producto = {
        title : String (required),
        price : Number (required),
        thumbnail : String (required)
    }
*/

const pathToProducts = '../src/public/files/products.json'
class ProductManager{

    readProducts = async () =>{
        let data = await fs.promises.readFile(pathToProducts,'utf-8');
        let products = JSON.parse(data);
        return products;
    }

    save = async (producto) =>
        {
        // Valido que el producto venga con todos los campos.
        if(!producto.title || !producto.price || !producto.thumbnail) return {status:"error", error:"missing field"}
        try{
            if(fs.existsSync(pathToProducts)){//El archivo existe
                let products = await this.readProducts();
                let id = products[products.length-1].id+1;
                producto.id = id;
                products.push(producto);
                await fs.promises.writeFile(pathToProducts,JSON.stringify(products,null,2))
                return {status:"success",message:"Product created"}
            }else{//El archivo no existe.
                producto.id = 1;
                await fs.promises.writeFile(pathToProducts,JSON.stringify([producto],null,2));
                return {status:"success",message:"Product created"}
            }
        }catch(error){
            return {status:"error",message:error}
        }
        
    }

    getAll = async () => {
        if(fs.existsSync(pathToProducts)){
            let products = await this.readProducts();
            return {status:"success",products:products}
        }
    }

    getById = async (id) => {
        if(!id) return {status:"error", error:"ID needed"}
        if(fs.existsSync(pathToProducts)){
           let products = await this.readProducts();
           let product = products.find(p => p.id === id);
           if(product) return {status:"success",product:product}
           else return {status:"error", error:"Product not found"}
        }
    }

    deleteById = async (id) => {
        if(!id) return {status:"error", error:"ID needed"}
        if(fs.existsSync(pathToProducts)){
            let products = await this.readProducts();
            let product = products.find(p => p.id === id);
            if(product) {
                products.splice(product.id-1,1);
                await fs.promises.writeFile(pathToProducts,JSON.stringify(products,null,2))
                return {status:"success",message:"Product deleted"}
            }
            else return {status:"error", error:"Product not found"}
        }
    }

    deleteAll = async () => {
        await fs.promises.writeFile(pathToProducts,JSON.stringify([],null,2))
        return {status:"success",message:"All products deleted"}
    }
}

export default ProductManager;
