
const cursos = [
    {
        titulo: 'JavaScript Moderno Guía Definitiva Construye +10 Proyectos',
        tecnologia: 'JavaScript ES6',
    },
    {
        titulo: 'React – La Guía Completa: Hooks Context Redux MERN +15 Apps',
        tecnologia: 'React',
    },
    {
        titulo: 'Node.js – Bootcamp Desarrollo Web inc. MVC y REST API’s',
        tecnologia: 'Node.js'
    }, 
    {
        titulo: 'ReactJS Avanzado – FullStack React GraphQL y Apollo',
        tecnologia: 'React'
    }
];

const resolvers = {

    //1 _ funciones mixta buscar info
    //2 argumentos en este caso input
    //3 contexto usado para validar token
    //4 info sobre la consulta actual.
    Query:{
        obtenerCursos : (_,{input},ctx,info)=> {
            console.log(ctx);
            const resultado = cursos.filter ( curso => curso.tecnologia === input.tecnologia);
            return resultado;
        },
        obtenerTecnologias: ()=> cursos
    }
}

module.exports = resolvers;