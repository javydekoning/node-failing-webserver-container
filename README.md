A simple Node webserver that randomly throws `503` responses on the `/health` path. 

This can be used to test your container HA setups. On all other paths the server will respond with: 

```
I'm 224e21ed2b8d
Process is up for: 3445.3572978
You've reached: /
Healthcheck has failed: 0 time(s)
```

It will throw logging to stdout in the form of: 

```
2020-07-07 10:43:12.692	 INFO 	[server.ts:49]  	  	::ffff:172.17.0.1 GET /health
2020-07-07 10:43:12.693	 INFO 	[server.ts:45 generateResponse]  	  	::ffff:172.17.0.1 200 OK
2020-07-07 10:43:13.503	 INFO 	[server.ts:49]  	  	::ffff:172.17.0.1 GET /health
2020-07-07 10:43:13.503	 ERROR 	[server.ts:53]  	  	Throwing healthcheck error.
2020-07-07 10:43:13.505	 ERROR 	[server.ts:42 generateResponse]  	  	::ffff:172.17.0.1 503 Service Unavailable, failed 1 times
```