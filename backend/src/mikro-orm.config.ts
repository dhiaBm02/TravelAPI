import { Options } from '@mikro-orm/core';
import { Trip } from './entities/Trip';
import { Destination } from './entities/Destination';
import 'dotenv/config';


import { PostgreSqlDriver } from '@mikro-orm/postgresql';

const options: Options = {
  entities: [Trip],
  dbName: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
  driver: PostgreSqlDriver,
  schema: process.env.DB_SCHEMA,
  debug: true,
  allowGlobalContext: true,
};

export default options;
