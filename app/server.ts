import express from 'express';
import asyncify from 'express-asyncify';
import { server_config } from '../utils/environment';
import http from 'http';

export default class Server {
  public app: express.Application;
  public port: number;
  public redisClient: any;

  private httpServer: http.Server;

  public constructor() {
    this.app = asyncify(express());
    this.port = server_config.server_port;
    this.httpServer = new http.Server(this.app);
  }

  start(callback: any) {
    this.httpServer.listen(this.port, callback);
  }
}
