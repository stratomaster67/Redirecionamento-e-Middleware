import { FastifyInstance } from "fastify"

export async function loginRoutes(app: FastifyInstance) {
  app.get("/login", async (request, reply) => {
    // 1. Verificar token no header
    const authHeader = request.headers.authorization
    if (authHeader === "Bearer 12345") {
      return reply.redirect("/dashboard?source=token")
    }

    // 2. Verificar parâmetro de query
    const { auth } = request.query as { auth?: string }
    if (auth === "true") {
      return reply.redirect("/dashboard?source=query")
    }

    // 3. Verificar cookie - FORMA CORRETA
    const cookies = request.cookies
    const sessionCookie = cookies.session
    if (sessionCookie === "ok") {
      return reply.redirect("/dashboard?source=cookie")
    }

    // 4. Nenhuma autenticação válida
    return reply.status(401).send({
      error: "Acesso negado. Nenhuma forma de autenticação encontrada.",
      instructions: {
        header: "Envie: Authorization: Bearer 12345",
        query: "Acesse: /login?auth=true",
        cookie: "Defina o cookie: session=ok"
      }
    })
  })

  // Rota para definir cookie de teste (opcional)
  app.get("/set-cookie", async (request, reply) => {
    reply.setCookie('session', 'ok', {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 // 24 horas
    })
    
    return { 
      message: "Cookie 'session' definido como 'ok'",
      instructions: "Agora acesse /login para testar"
    }
  })

  // Rota POST opcional para login
  app.post("/login", async (request, reply) => {
    return { message: "Use GET /login para testar redirecionamentos" }
  })
}