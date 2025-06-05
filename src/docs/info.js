export const info = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API MarvelDC",
            version: "1.0.0",
            description: "Documentación de la API REST para la tienda online MarvelDC. Esta API permite gestionar usuarios, autenticación, productos y carritos de compras relacionados con Marvel y DC Comics.",
            contact: {
                name: "Equipo de Desarrollo MarvelDC",
                email: "jpablo@marveldc.com"
            }
        },
        servers: [
            {
                url: "http://localhost:5000/api",
                description: "Servidor de desarrollo local"
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Token JWT obtenido del endpoint /api/sessions/login"
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
        tags: [
            {
                name: "Auth",
                description: "Endpoints relacionados con autenticación y gestión de usuarios"
            },
            {
                name: "Products",
                description: "Endpoints para gestión de productos Marvel y DC"
            },
            {
                name: "Carts",
                description: "Endpoints para gestión de carritos de compras"
            }
        ]
    },
    apis: ["./src/docs/*.yaml", "./src/docs/*.yml"],
}
