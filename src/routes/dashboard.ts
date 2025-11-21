import { FastifyInstance } from "fastify"

export async function dashboardRoutes(app: FastifyInstance) {
  app.get("/dashboard", async (request, reply) => {
    const { source } = request.query as { source?: string }
    
    return {
      message: "Bem-vindo ao Dashboard!",
      authenticationSource: source || "unknown",
      timestamp: new Date().toISOString()
    }
  })
}