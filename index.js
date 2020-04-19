const {ApolloServer,gql} = require("apollo-server");
const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");




//servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,

    
    context: ()=> {
        const idUser = 20;

        return {
            idUser
        }
    }
});

server.listen().then(({url})=>{
    console.log(`Servidor listo en la URL ${url}`)
});

