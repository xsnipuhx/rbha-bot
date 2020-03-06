import {BastionPlugin} from 'bastion'
import {MongoClient, Db, Collection} from 'mongodb'
import Debug from 'Debug'

const debug = Debug('bastion-plugin:mongodb')

interface MongoDBConfig {
  /** Full MongoDB url */
  url: string;
  /** Name of database to use */
  db: string;
}

export default class BastionMongoDB extends BastionPlugin {
  public name = "bastion-mongodb";
  public db: Db;
  private config: MongoDBConfig;

  private static instance: BastionMongoDB;

  public static getInstance() {
    return BastionMongoDB.instance;
  }

  constructor(config: MongoDBConfig) {
    super();
    this.config = config;
    console.log("setting instance")
    BastionMongoDB.instance = this;

    console.log(BastionMongoDB.instance)
  }

  private cacheDb = (client: MongoClient) => {
    this.db = client.db()
  }

  init() {
    MongoClient.connect(this.config.url, { useUnifiedTopology: true })
      .then(this.cacheDb)
      .then(() => {
        debug('Connected to MongoDB')
      })
  }

  public static collection(name: string) {
    return () => 
      BastionMongoDB
      .getInstance()
      .db
      .collection(name)
  }
}

export {Collection};