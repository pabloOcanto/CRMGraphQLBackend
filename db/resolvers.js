const Usuario = require("../models/Usuario")
const Producto = require("../models/Producto")
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

        }
               
    }


}



module.exports = resolvers;