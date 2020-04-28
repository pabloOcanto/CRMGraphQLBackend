const Usuario = require("../models/Usuario");
const Producto = require("../models/Producto");
const Cliente = require("../models/Cliente");
const Pedido = require("../models/Pedido");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({path : "variables.env"});


const crearToken= (usuario,clave,expiresIn)=>{

    const {id,email,password} = usuario;
    const token = jwt.sign({id},clave,{expiresIn});
    console.log(token);
    return  token;
}

const resolvers = {

    //Query la parte de consultas

    //1 _ funciones mixta buscar info
    //2 argumentos en este caso input
    //3 contexto usado para validar token
    //4 info sobre la consulta actual.
    Query:{

        //Usuario
        obtenerUsuario : async (_,{token})=> {
            const usuarioId = await jwt.verify(token,process.env.CLAVE_SECRETA);
            return usuarioId;
        },

        //Proudcto

        obtenerProductos:async ()=>{
            console.log("obtener productos");

            try {
                const productos = await Producto.find({});
                return productos;          
            } catch (error) {
                console.log(error);
                    
            }

        },

        obtenerProducto: async (_,{id})=>{
            console.log("obtener product",id);

            const producto = await Producto.findById(id);
            if (!producto){
                throw new Error("producto no existe")
            }
                
            return producto;

            
        },

        //Clientes

        obtenerClientes:async()=>{

            try {
                
                const clientes = await Cliente.find({});

                return clientes;
            } catch (error) {
                
                console.log(error);
            }

        },


        obtenerClientesVendedor:async(_,{},ctx)=>{

            try {
                const clientes = await Cliente.find({vendedor:ctx.usuario.id});
                return clientes;
            } catch (error) {
                console.log(error);
            }

        },

        obtenerCliente:async(_,{id},ctx)=>{
            //verificar existencia

            const cliente = await Cliente.findById(id);
            if (!cliente){
                throw new Error("el cliente no existe");
            }

            if (cliente.vendedor.toString() !== ctx.usuario.id){
                throw new Error("No tiene credenciales");
            }

            return cliente;

        },

        //pedidos
        obtenerPedidos:async()=>{

            try {
                const pedidos = await Pedido.find({});
                return pedidos;
            } catch (error) {
                console.log(error);
            }
            
        },

        obtenerPedidosVendedor:async(_,{},ctx)=>{

            try {
                const pedidos = await Pedido.find({vendedor:ctx.usuario.id});
                return pedidos;
            } catch (error) {
                console.log(error);
            }
            
        },


        obtenerPedido:async(_,{id},ctx)=>{

            try {
                const pedido= await Pedido.findById(id);
                if (!pedido){
                    throw new Error("No hay pedido");
                }
                return pedido;

            } catch (error) {
                console.log(error);
            }
            
        },

        obtenerPedidosEstado:async(_,{estado},ctx)=>{
            const pedidos = await Pedido.find({vendedor:ctx.usuario.id,estado});
            return pedidos;
        }

    },


    //Mutations la parte de modificacion de datos.

    Mutation:{

        //Usuario

        nuevoUsuario :async (_,{input})=>{

            const {email,password} = input;

            const usuarioExiste = await Usuario.findOne({email});

            if (usuarioExiste){
                throw new Error("usuario existe");
            }

            const salt =await bcryptjs.genSalt(10);

            input.password = await bcryptjs.hash(password,salt);

            try{
                const usuario = new Usuario(input);
                 usuario.save();
                 return usuario;
            }catch(error){
                console.log("error en creacion "+error);
            }

        },

        authenticar: async (_,{input}) =>{
            const {email,password} = input;

            const existeUsuario = await Usuario.findOne({email});

            if (!existeUsuario){
                throw new Error ("usuario no existe");
            }

            const isValidPassword = await bcryptjs.compare(password,existeUsuario.password);
            
            if (!isValidPassword){
                throw new Error ("password invalido");
            }

            return {
                token:crearToken(existeUsuario,process.env.CLAVE_SECRETA,'3h')
            }
        },


        //Producto

        nuevoProducto: async (_,{input},ctx)=>{
           
            try {
             
                const producto = new Producto(input);
                const resultado = await producto.save();
                return resultado;
            } catch (error) {
                console.log(error);
            }


        },

        actualizarProducto:async(_,{id,input})=>{
    
            try{
            
                const existeProducto = await Producto.findById(id);

                if (!existeProducto){
                    throw new Error("no existe producto");
                }

                
                const producto = await Producto.findOneAndUpdate({_id:id},input,{new:true});
                return producto;

            }catch(error){
                console.log(error);
            }
            

        },

        eliminarProducto:async (_,{id})=>{

            try{

                const existeProducto = await Producto.findById(id);

                if (!existeProducto){
                    throw new Error("no existe producto");
                }

                await Producto.findOneAndDelete({_id:id})


                return "Producto Eliminado";
            }catch(error){
                console.log(error);

            }

        },

        //Cliente

        nuevoCliente:async(_,{input},ctx)=>{

            console.log(ctx);

            const {email} = input;

            const existeCliente = await Cliente.findOne({email});

            if (existeCliente){
                throw new Error("Ya existe ese cliente");
            }

            const nuevoCliente = new Cliente(input);
            nuevoCliente.vendedor = ctx.usuario.id;

            try {
                const resultado = await nuevoCliente.save();
                return resultado;
            } catch (error) {
                console.log(error);
            }
        },

        actualizarCliente:async (_,{id,input},ctx)=>{
            //verficar existencia

            try {
                const cliente = await Cliente.findById(id);
                if(!cliente){
                    throw new Error("cliente no existe"); 
                }
    
                //verificar vendedor
    
                if (cliente.vendedor.toString() !== ctx.usuario.id){
                    throw new Error("no tiene credenciales");
                }
    
                const clienteActualizado = await Cliente.findOneAndUpdate({_id:id},input,{new:true});

                return clienteActualizado;
            } catch (error) {
                console.log(error);                
            }



        },

        eliminarCliente:async (_,{id,input},ctx)=>{

            try {
                const cliente = await Cliente.findById(id);
                if(!cliente){
                    throw new Error("cliente no existe"); 
                }
    
                //verificar vendedor
    
                if (cliente.vendedor.toString() !== ctx.usuario.id){
                    throw new Error("no tiene credenciales");
                }
    
                 await Cliente.findOneAndDelete({_id:id});

                return "cliente eliminado "+id;
            } catch (error) {
                console.log(error);                
            }

        },


        //Pedido

        nuevoPedido:async (_,{input},ctx)=>{
            
            try {
                //verificar si cliente existe
                console.log(input);

                const {cliente,pedido}= input;

                console.log(cliente);

                const existeCliente = await Cliente.findById(cliente);

                if (!existeCliente){
                    throw new Error("cliente no existe")
                }

                console.log("vendedor "+existeCliente.vendedor);
                console.log("usuario "+ctx.usuario.id);

                //verificar que el pedido del cliente sea del vendedor que dio de alta

                if (existeCliente.vendedor.toString() !== ctx.usuario.id){
                    throw new Error("no tiene credenciales");
                }


                // dar de alta el pedido

                for await (const articulo of pedido){

                    const {id} = articulo;
                    const producto = await Producto.findById(id);

                    if (producto.existencia < articulo.cantidad){
                        throw new Error(`No hay  cantidad suficiente para el articulo ${articulo.nombre}`);
                    }else{
                        producto.existencia = producto.existencia - articulo.cantidad;
                        await producto.save();     
                    }

                }

                const nuevoPedido = new Pedido(input);
                nuevoPedido.vendedor=ctx.usuario.id;

                const resultado= await nuevoPedido.save();

                return resultado;

            } catch (error) {
                console.log(error);    
            }            
            
        },

        actualizarPedido:async(_,{id,input},ctx)=>{

            try {

                const existePedido = await Pedido.findById(id);

                if (!existePedido){
                    throw new Error("el pedido no existe");
                }
    
                const {cliente} = input
                
                const existeCliente =  await Cliente.findById(cliente);
    
                if (!existeCliente){
                    throw new Error ("cliente no existe");
                }

                console.log("vendedor "+existeCliente.vendedor);
                console.log("usuario "+ctx.usuario.id);
    
                if (existeCliente.vendedor.toString() !== ctx.usuario.id || existePedido.vendedor.toString() !== ctx.usuario.id  ){
                    throw new Error ("No tiene credenciales");
                }
    
    
                for await (const articulo of input.pedido){
    
                    const {id} = articulo;
                    const producto = await Producto.findById(id);
    
                    if (producto.existencia < articulo.cantidad){
                        throw new Error(`No hay  cantidad suficiente para el articulo ${articulo.nombre}`);
                    }else{
                        producto.existencia = producto.existencia - articulo.cantidad;
                        await producto.save();     
                    }
    
                }
    
                const nuevoPedido = await Pedido.findOneAndUpdate({_id:id},input,{new:true});
    
                return nuevoPedido;
                
            } catch (error) {
                console.log(error);
            }

        },

        eliminarPedido:async(_,{id},ctx)=>{

            //verficar existencia del pedido

            try {

                const pedido = await Pedido.findById(id);
                if(!pedido){
                    throw new Error ("No existe pedido");
                }
                //verficar credenciales
                if (pedido.vendedor.toString() !== ctx.usuario.id){
                    throw new Error ("No tiene credenciales para eliminar el pedido");
                }
    
                await Pedido.findOneAndDelete({_id:id});

                return "peido eliminado";
                
            } catch (error) {
                
            }


        }




               
    }


}



module.exports = resolvers;