// @ts-nocheck
import { MongoClient } from 'mongodb';
import nextConnect from 'next-connect';

const client = new MongoClient('{YOUR-MONGODB-CONNECTION-STRING}', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function database(req, res, next) {
  req.dbClient = client;
  req.db = client.db('MCT');
  return next();
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;