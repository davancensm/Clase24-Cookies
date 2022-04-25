import { normalize, denormalize, schema } from 'normalizr'
import fs from 'fs';

const author = new schema.Entity('authors');
const message = new schema.Entity('message',{
    message:author
})
const messagesDBSchema = new schema.Entity('messages',{
    author:author,
    messeges:[message]
})


const pathToMessages = '../src/public/files/messages.json'

class MessageManager{

    getAll = async () =>{
        if(fs.existsSync(pathToMessages)){
            let data = await fs.promises.readFile(pathToMessages,'utf-8');
            let messages = JSON.parse(data);
            return messages;
        }else{
            return null;
        }
    }

    save = async (message) =>
        {
        // Valido que el producto venga con todos los campos.
        if(!message.message) return {status:"error", error:"missing field"}
        try{
            if(fs.existsSync(pathToMessages)){//El archivo existe
                let messages = await this.getAll();
                messages = denormalize(messages.result,[messagesDBSchema],messages.entities);
                let id = messages[messages.length-1].id+1;
                message.id = id;
                messages.push(message);
                messages = normalize(messages,[messagesDBSchema])
                await fs.promises.writeFile(pathToMessages,JSON.stringify(messages,null,2))
                return {status:"success",message:"Message saved"}
            }else{//El archivo no existe.
                message.id = 1;
                let messages = [];
                messages.push(message);
                messages = normalize(messages,messagesDBSchema)
                await fs.promises.writeFile(pathToMessages,JSON.stringify([message],null,2));
                return {status:"success",message:"Message saved"}
            }
        }catch(error){
            return {status:"error",message:error}
        }
        
    }
}

export default MessageManager;
