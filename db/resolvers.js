const resolvers = {

    //1 _ funciones mixta buscar info
    //2 argumentos en este caso input
    //3 contexto usado para validar token
    //4 info sobre la consulta actual.
    Query:{
        obtenerCursos : (_,{input},ctx,info)=> {},
        obtenerTecnologias: ()=> cursos
    }
}

module.exports = resolvers;