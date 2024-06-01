import 'dotenv/config';

import express from 'express';
import http from 'http';

import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core';

import { TripController } from './controller/trips.controller';
import { DestinationController } from './controller/destinations.controller';
import { Trip, Destination } from './entities';

const PORT = process.env.PORT;
const app = express();

export const DI = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  tripRepository: EntityRepository<Trip>;
  destinationRepository: EntityRepository<Destination>;
};

export const initializeServer = async () => {
  // dependency injection setup
  DI.orm = await MikroORM.init();
  DI.em = DI.orm.em;
  DI.tripRepository = DI.orm.em.getRepository(Trip);
  DI.destinationRepository = DI.orm.em.getRepository(Destination);

  app.use(express.json());

  app.use('/trips', TripController);

  app.use('/destinations', DestinationController);

  DI.server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

if (process.env.environment !== 'test') {
  initializeServer();
}

