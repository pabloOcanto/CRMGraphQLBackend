const {ApolloServer,gql} = require("apollo-server");
const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
const conectarDB = require("./config/db"); 
const jwt = require("jsonwebtoken");


conectarDB();

//servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req})=>{

        const token = req.headers["authorization"] || "";
        if (token){
            try {
                const usuario = jwt.verify(token,process.env.CLAVE_SECRETA);
                return {
                    usuario
                };   
            } catch (error) {
                throw new Error("usuario no authenticado");
            }
            

        }

    }

});

server.listen().then(({url})=>{
    console.log(`Servidor listo en la URL ${url}`)
});

