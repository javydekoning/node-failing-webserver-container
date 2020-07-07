import * as os from 'os';
import * as pino from 'pino-http';

const logger = pino.default();

import {
  IncomingMessage,
  ServerResponse,
  createServer,
  OutgoingHttpHeaders,
} from 'http';

let healthCheckFailures: number = 0;
let shouldErr: boolean = false;

const host = os.hostname();
const resHeaders: OutgoingHttpHeaders = {
  content: 'text/html; charset=utf-8',
  'X-Backend-Server': host,
};

let httpBody = (req: IncomingMessage): string => `
I'm ${os.hostname()}.
Process is up for: ${Math.floor(process.uptime())} sec.
You've reached: ${req.url}
Healthcheck has failed: ${healthCheckFailures} time(s).
`;

let generateResponse = (
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
    shouldErr = Math.floor(Math.random() * Math.floor(20)) == 0;
  }

  if (req.url == '/health' && shouldErr) {
    healthCheckFailures++;
    generateResponse(res, 503, resHeaders, 'ERROR');
  } else {
    generateResponse(res, 200, resHeaders, httpBody(req));
  }
});

server.listen(9091);
