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

    type Producto{
        id:ID
        nombre:String
        existencia:Int
        precio:Float
        creado:String
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

    input ProductoInput{
        nombre:String!
        existencia:Int!
        precio:Float!
    }

    type Query{
        # Usuario

        obtenerUsuario(token:String!): Usuario

        # Producto
    
        obtenerProductos: [Producto]
        obtenerProducto(id: ID!): Producto    }

    type Mutation{
        # Usuario

        nuevoUsuario(input: UsuarioInput): Usuario
        authenticar(input:AuthenticarInput):Token

        # Producto    
        
        nuevoProducto(input:ProductoInput):Producto        
        actualizarProducto(id:ID!,input:ProductoInput): Producto
        eliminarProducto(id:ID!):String

    }

`;

module.exports =typeDefs;
