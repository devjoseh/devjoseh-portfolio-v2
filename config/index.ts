export const appConfig = Object.freeze({
    baseUrl: "https://devjoseh.com.br",

    curriculumPath: "/curriculo_jose_hernanes.pdf", // public folder
    
    /**
     * Configurações relacionadas às rotas da aplicação.
     * Usado para controle de acesso no middleware, sitemaps, etc.
     */
    routes: {
        protected: ["/admin"],
        public_auth: ["/sign-in"],
        static: ["/api", "/_next", "/favicon.ico"]
    },
});
