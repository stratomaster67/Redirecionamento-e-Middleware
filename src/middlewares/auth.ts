import type { FastifyReply, FastifyRequest } from "fastify"

export async function authHook(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization
  if (authHeader !== "Bearer 123456") {
    reply.status(401).send({ error: "Acesso não autorizado" })
  }
}