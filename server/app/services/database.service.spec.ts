import { fail } from 'assert';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseService } from './database.service';
chai.use(chaiAsPromised); // this allows us to test for rejection

// tslint:disable:no-any
// tslint:disable:no-string-literal
// tslint:disable:no-unused-expression
describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;

    beforeEach(async () => {
        databaseService = new DatabaseService();

        // Start a local test server
        mongoServer = new MongoMemoryServer();
    });

    afterEach(async () => {
        if (databaseService['client'] && databaseService['client'].isConnected()) {
            await databaseService['client'].close();
        }
    });

    // NB : We dont test the case when DATABASE_URL is used in order to not connect to the real database
    it('should connect to the database when start is called', async () => {
        // Reconnect to local server
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        chai.expect(databaseService['client']).to.not.be.undefined;
        chai.expect(databaseService['db'].databaseName).to.equal('projet2990');
    });

    it('should not connect to the database when start is called with wrong URL', async () => {
        // Try to reconnect to local server
        try {
            await databaseService.start('WRONG URL');
            fail();
        } catch {
            chai.expect(databaseService['client']).to.be.undefined;
        }
    });

    it('should no longer be connected if close is called', async () => {
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        await databaseService.closeConnection();
        chai.expect(databaseService['client'].isConnected()).to.be.false;
    });
    it('should return a db object', async () => {
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        chai.expect(databaseService.database).to.equal((databaseService as any).db);
    });

    it('should return the client when start is called', async () => {
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        chai.expect(databaseService.start(mongoUri).toString()).to.eql(Promise.resolve(databaseService['client']).toString());
    });
    it('should return the client when start is called', async () => {
        const mongoUri = await mongoServer.getUri();
        chai.expect(databaseService.start(mongoUri).toString()).to.eql(Promise.resolve((databaseService as any).client).toString());
    });
    it('should return null when start is called without client', async () => {
        chai.expect(databaseService.start().toString()).to.eql(Promise.resolve(null).toString());
    });
});
