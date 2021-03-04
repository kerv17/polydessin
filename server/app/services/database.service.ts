import { injectable } from "inversify";
import { Metadata } from "../classes/metadata";
import { MongoClient, MongoClientOptions, Db } from "mongodb";
import "reflect-metadata";

// CHANGE the URL for your database information
const DATABASE_URL =
    "mongodb+srv://admin:DB2990T312@cluster0.iuq28.mongodb.net/projet2990?retryWrites=true&w=majority";
const DATABASE_NAME = "projet2990";
const DATABASE_COLLECTION = "metadata";

@injectable()
export class DatabaseService {
  private db: Db;
  private client: MongoClient;

  private options: MongoClientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  async start(url: string = DATABASE_URL): Promise<MongoClient | null> {
    try {
      let client = await MongoClient.connect(url, this.options);
      this.client = client;
      this.db = client.db(DATABASE_NAME);
    } catch {
      throw new Error("Database connection error")
    }

    if (
      (await this.db.collection(DATABASE_COLLECTION).countDocuments()) === 0
    ) {
      await this.populateDB();
    }
    return this.client;
  }

  async closeConnection(): Promise<void> {
    return this.client.close();
  }

  async populateDB(): Promise<void> {
    let metaDatas: Metadata[] = [
      {
        code: ""
        name: "Object Oriented Programming",
        tags: ["Samuel Kadoury"],
      },
      {
        name: "Intro to Software Engineering",
        tags: ["Bram Adams"],
      },
      {
        name: "Project I",
        tags: ["Jerome Collin"],
      },
      {
        name: "Project II",
        tags: ["Levis Theriault"],
      },
      {
        name: "Web Semantics and Ontology",
        tags: ["Michel Gagnon"],
      },
    ];

    console.log("THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE");
    for (const metadata of metaDatas) {
      await this.db.collection(DATABASE_COLLECTION).insertOne(metadata);
    }
  }

  get database(): Db {
    return this.db;
  }
}
