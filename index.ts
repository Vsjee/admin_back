require('dotenv').config();
require('./utils/db');

import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Server from './app/server';

import router from './app/api';

const server = new Server();

var whitelist = [
  'http://localhost:4200',
  'http://localhost',
  'https://webapp-stg-y6mjjgdxkq-ue.a.run.app',
  'https://stg-app.soybumii.com',
  'https://viewer-stg-drcmraqrhq-ue.a.run.app',
  'https://stg-viewer.soybumii.com',
  'https://webapp-prd-4oxqrmpaua-ue.a.run.app',
  'https://app.soybumii.com',
  'https://viewer-prd-scy3m3ntaq-ue.a.run.app',
  'https://kids.soybumii.com',
  'https://stg-webapp.soybumii.com',
  'https://webapp.soybumii.com',
];

var corsOptions = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(
        new Error('URL Not allowed by CORS. Please contact with admin.')
      );
    }
  },
  credentials: true,
};

server.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
server.app.use(bodyParser.json({ limit: '50mb' }));
server.app.use(cors(corsOptions));
// server.app.set('redisClient', server.redisClient);

server.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message });
  }
  res.status(500).send({ error: err.message });
});

server.app.get('/', function (req, res) {
  res.send('Bumii core server API has been Initialized');
});

// API Handler
server.app.use('/api/v1', router);

function handleFatalError(err: any) {
  console.error(`'[Fatal Error]: '${err.message}`);
  console.error(err.stack);
}

if (!module.parent) {
  process.on('uncaughtException', handleFatalError);
  process.on('unhandledRejection', handleFatalError);

  server.start(() => {
    console.log(`Server listening in port ${server.port}`);
  });
}
