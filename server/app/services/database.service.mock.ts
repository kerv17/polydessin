import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

// CE CODE EST PRIS DE L'EXEMPLE DONNE POUR LE COURS LOG2990
// 'exemple de mongoDB avec serveur NodeJS'
const DATABASE_NAME = 'projet2990';

export class DatabaseServiceMock {
    private db: Db;
    private client: MongoClient;
    mongoServer: MongoMemoryServer;

    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    async start(url?: string): Promise<MongoClient | null> {
        if (!this.client) {
            this.mongoServer = new MongoMemoryServer();
            const mongoUri = await this.mongoServer.getUri();
            this.client = await MongoClient.connect(mongoUri, this.options);
            this.db = this.client.db(DATABASE_NAME);
        }

        return this.client;
    }

    async closeConnection(): Promise<void> {
        if (this.client) {
            return this.client.close();
        } else {
            return Promise.resolve();
        }
    }

    get database(): Db {
        return this.db;
    }
}
