const {ApolloServer,gql} = require("apollo-server");
const {AuthenticationError} = require("apollo-server-errors");
const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
const conectarDB = require("./config/db"); 
const jwt = require("jsonwebtoken");
require("dotenv").config({path : "variables.env"});


conectarDB();

//servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req})=>{

        const token = req.headers["authorization"] || "";
        if (token){
            try {
                console.log(token);
                console.log(process.env.CLAVE_SECRETA);
                const usuario = jwt.verify(token.replace("Bearer ",""),process.env.CLAVE_SECRETA);
                return {
                    usuario
                };   
            } catch (error) {
                throw new AuthenticationError("usuario no authenticado");
            }
            

        }

    }

});
//port: process.env.PORT || 4000
server.listen().then(({url})=>{
    console.log(`Servidor listo en la URL ${url}`)
});

