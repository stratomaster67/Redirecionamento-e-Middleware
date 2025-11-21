import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import { logOnRequest, logOnResponse } from './middlewares/logger.js'
import { loginRoutes } from './routes/login.js'
import { dashboardRoutes } from './routes/dashboard.js'

const app = Fastify({ 
  logger: true 
})

// Registrar plugin de cookies
app.register(cookie)

// Middlewares de logging
app.addHook('onRequest', logOnRequest)
app.addHook('onResponse', logOnResponse)

// Registrar rotas
app.register(loginRoutes)
app.register(dashboardRoutes)

// Rota raiz com redirecionamento
app.get('/', async (request, reply) => {
  return reply.redirect('/login')
})

// Iniciar servidor
const start = async () => {
  try {
    await app.listen({ port: 3000 })
    console.log('🚀 Servidor rodando em http://localhost:3000')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()