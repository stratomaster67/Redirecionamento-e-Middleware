import { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs';
import path from 'path';

// Criar pasta logs se não existir
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Mapa para armazenar dados temporários das requisições
const requests = new Map<string, any>();

export async function logOnRequest(request: FastifyRequest, reply: FastifyReply) {
  const requestId = Math.random().toString(36).substring(2, 15);
  
  const requestData = {
    startTime: Date.now(),
    ip: request.ip || request.headers['x-forwarded-for'] || request.socket.remoteAddress || '127.0.0.1',
    method: request.method,
    url: request.url
  };
  
  requests.set(requestId, requestData);
  (request as any).requestId = requestId;
}

export async function logOnResponse(request: FastifyRequest, reply: FastifyReply) {
  const requestId = (request as any).requestId;
  
  if (!requestId || !requests.has(requestId)) {
    return;
  }
  
  const requestData = requests.get(requestId);
  const endTime = Date.now();
  const duration = endTime - requestData.startTime;
  
  const logMessage = `IP: ${requestData.ip} | ${requestData.method} ${requestData.url} | STATUS: ${reply.statusCode} | TEMPO: ${duration}ms`;
  const logFile = path.join(logsDir, 'access.log');
  
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${logMessage}\n`);
  console.log(logMessage);
  
  requests.delete(requestId);
}