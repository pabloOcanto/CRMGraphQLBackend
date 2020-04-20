const Usuario = require("../models/Usuario")
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
        obtenerUsuario : async (_,{token})=> {
            const usuarioId = await jwt.verify(token,process.env.CLAVE_SECRETA);
            return usuarioId;
        }
    },


    //Mutations la parte de modificacion de datos.

    Mutation:{
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
        }
    }

}

module.exports = resolvers;