# CRMGraphQLBackend
Backend com apollo server y MongoDB

## lineamientos
-   crear un archivo en la raiz del proyecto llamadao variables.env
-   Dentro del mismo declarar la variable DB_MONGO con la url de atlas o servidor local
-   Otra variable llamada CLAVE_SECRETA y un clave para tener seguridad del sitio.

## Uso
- Localmente eliminar el codigo ```port: process.env.PORT || 4000``` del archivo index.js
-  Levanta el servidor con el comando npm run dev o npm run start

## En un browser tipear localhost:4000

### Como consumir los datos see :[graphql site](https://graphql.org/learn/queries/)
``` Actualizar Info

    mutation nuevoProducto($input:ProductoInput)
        {
        nuevoProducto(input:$input){
            nombre
                existencia
            precio
        }
    }

    Recuperar Info
        query mejoresCLientes{
            mejoresCLientes{
                cliente{
                    nombre
                    empresa
                    telefono
                }
                total
            }
        }
```


