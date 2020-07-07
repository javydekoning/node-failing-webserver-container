A simple Node webserver that suddenly starts throwing `503` responses on the `/health` path to simulate application failures.

This can be used to test your container HA setups. On all other paths the server will respond with:

```
I'm 224e21ed2b8d
Process is up for: 3445.3572978
You've reached: /
Healthcheck has failed: 0 time(s)
```

It will send `JSON` logging to stdout in the form of:

```json
({
  "level": 30,
  "time": 1594129205214,
  "pid": 1,
  "hostname": "ccac43b584d2",
  "req": {
    "id": 6,
    "method": "GET",
    "url": "/whoami",
    "headers": {
      "host": "localhost:9091",
      "user-agent": "curl/7.64.1",
      "accept": "*/*"
    },
    "remoteAddress": "::ffff:172.17.0.1",
    "remotePort": 41940
  },
  "msg": "HealthCheck failed: 2 time(s)"
},
{
  "level": 30,
  "time": 1594129201026,
  "pid": 1,
  "hostname": "ccac43b584d2",
  "req": {
    "id": 7,
    "method": "GET",
    "url": "/health",
    "headers": {
      "host": "localhost:9091",
      "user-agent": "curl/7.64.1",
      "accept": "*/*"
    },
    "remoteAddress": "::ffff:172.17.0.1",
    "remotePort": 41936
  },
  "res": {
    "statusCode": 503,
    "headers": {}
  },
  "err": {
    "type": "Error",
    "message": "failed with status code 503",
    "stack": "Error: failed with status code 503\n    at ServerResponse.onResFinished (/usr/src/node_modules/pino-http/logger.js:73:38)\n    at ServerResponse.emit (events.js:326:22)\n    at ServerResponse.EventEmitter.emit (domain.js:486:12)\n    at onFinish (_http_outgoing.js:744:10)\n    at callback (_stream_writable.js:501:21)\n    at afterWrite (_stream_writable.js:454:5)\n    at afterWriteTick (_stream_writable.js:441:10)\n    at processTicksAndRejections (internal/process/task_queues.js:79:21)"
  },
  "responseTime": 0,
  "msg": "request errored"
})
```
