import * as os from 'os';
import { Logger } from 'tslog';

import {
  IncomingMessage,
  ServerResponse,
  createServer,
  OutgoingHttpHeaders,
} from 'http';

const resHeaders: OutgoingHttpHeaders = {
  content: 'text/html; charset=utf-8',
  'X-Backend-Server': os.hostname(),
};

const log: Logger = new Logger();

let healthCheckFailures: number = 0;

let httpBody = (url: string | undefined): string => `
I'm ${os.hostname()}.
Process is up for: ${Math.floor(process.uptime())} sec.
You've reached: ${url}
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
  if (statusCode != 200) {
    log.error(
      `${res.connection.remoteAddress} ${res.statusCode.toString()} ${
        res.statusMessage
      }, failed ${healthCheckFailures} times`
    );
  } else {
    log.info(
      `${res.connection.remoteAddress} ${res.statusCode.toString()} ${
        res.statusMessage
      }`
    );
  }
};

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  log.info(`${req.connection.remoteAddress} ${req.method} ${req.url}`);

  // Give a 1 in 5 chance to throw error on /health path
  let shouldErr: boolean = Math.floor(Math.random() * Math.floor(5)) == 0;

  if (req.url == '/health' && shouldErr) {
    log.error('Throwing healthcheck error.');
    healthCheckFailures++;
    generateResponse(res, 503, resHeaders, 'ERROR');
  } else {
    generateResponse(res, 200, resHeaders, httpBody(req.url));
  }
});

server.listen(9091);
