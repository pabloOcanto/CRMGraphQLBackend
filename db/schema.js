const {gql} = require("apollo-server");

const typeDefs =gql`

    type Usuario{
        id:ID
        nombre:String
        apellido:String
        email:String
        creado:String
    }

    type Token{
        token:String
    }

    input AuthenticarInput{
        email:String
        password:String
    }

    input UsuarioInput {
        nombre:String!
        apellido:String!
        email:String!
        password:String!
    }

    type Query{
        obtenerUsuario(token:String!): Usuario
    }

    type Mutation{
        nuevoUsuario(input: UsuarioInput): Usuario
        authenticar(input:AuthenticarInput):Token
    }

`;

module.exports =typeDefs;
