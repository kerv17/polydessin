import { injectable } from 'inversify';
import { Db, MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import 'reflect-metadata';
import { Metadata } from '../classes/metadata';

// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://admin:DB2990T312@cluster0.iuq28.mongodb.net/projet2990?retryWrites=true&w=majority';
const DATABASE_NAME = 'projet2990';
const DATABASE_COLLECTION = 'metadata';

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
            const client = await MongoClient.connect(url, this.options);
            this.client = client;
            this.db = client.db(DATABASE_NAME);
        } catch {
            throw new Error('Database connection error');
        }
        // TODO is this necessary
        if ((await this.db.collection(DATABASE_COLLECTION).countDocuments()) === 0) {
            await this.populateDB();
        }
        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }
    // TODO remove when done testing
    async populateDB(): Promise<void> {
        const metaDatas: Metadata[] = [
            {
                codeID: new ObjectId('test'),
                name: 'Object Oriented Programming',
                tags: ['Samuel Kadoury'],
            },
        ];

        console.log('THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE');
        for (const metadata of metaDatas) {
            await this.db.collection(DATABASE_COLLECTION).insertOne(metadata);
        }
    }

    get database(): Db {
        return this.db;
    }
}
