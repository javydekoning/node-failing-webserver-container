import * as os from 'os';
import * as pino from 'pino-http';
import {
  IncomingMessage,
  ServerResponse,
  createServer,
  OutgoingHttpHeaders,
} from 'http';

let healthCheckFailures: number = 0;
let shouldErr: boolean = false;

const logger = pino.default();
const resHeaders: OutgoingHttpHeaders = {
  content: 'text/html; charset=utf-8',
  'X-Backend-Server': os.hostname(),
};

const httpBody = (req: IncomingMessage): string => `
I'm ${os.hostname()}.
Process is up for: ${Math.floor(process.uptime())} sec.
You've reached: ${req.url} 
Headers: ${JSON.stringify(req.headers)}
Healthcheck has failed: ${healthCheckFailures} time(s).
`;

const generateResponse = (
  res: ServerResponse,
  statusCode: number,
  headers: OutgoingHttpHeaders,
  body: string
): void => {
  res.writeHead(statusCode, headers);
  res.write(body);
  res.end();
};

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  logger(req, res);
  req.log.info(`HealthCheck failed: ${healthCheckFailures} time(s)`);

  if (shouldErr === false) {
    shouldErr = Math.floor(Math.random() * Math.floor(100)) == 0;
  }

  if (req.url == '/health' && shouldErr) {
    healthCheckFailures++;
    generateResponse(res, 503, resHeaders, 'ERROR');
  } else {
    generateResponse(res, 200, resHeaders, httpBody(req));
  }
});

server.listen(9091);
