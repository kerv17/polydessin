import { injectable } from 'inversify';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';
// CE CODE EST PRIS DE L'EXEMPLE DONNE POUR LE COURS LOG2990
// 'exemple de mongoDB avec serveur NodeJS'
const DATABASE_URL = 'mongodb+srv://admin:DB2990T312@cluster0.iuq28.mongodb.net/projet2990?retryWrites=true&w=majority';
const DATABASE_NAME = 'projet2990';

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
            throw new Error('Erreure de connection avec la base de données');
        }
        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    get database(): Db {
        return this.db;
    }
}
