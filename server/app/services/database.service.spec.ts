import { fail } from "assert";
import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { describe } from "mocha";
import { MongoMemoryServer } from "mongodb-memory-server";
import { DatabaseService } from "./database.service";
chai.use(chaiAsPromised); // this allows us to test for rejection

// tslint:disable:no-any
describe("Database service", () => {
  let databaseService: DatabaseService;
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    databaseService = new DatabaseService();

    // Start a local test server
    mongoServer = new MongoMemoryServer();
  });

  afterEach(async () => {
    if (databaseService["client"] && databaseService["client"].isConnected()) {
      await databaseService["client"].close();
    }
  });

  // NB : We dont test the case when DATABASE_URL is used in order to not connect to the real database
  it("should connect to the database when start is called", async () => {
    // Reconnect to local server
    const mongoUri = await mongoServer.getUri();
    await databaseService.start(mongoUri);
    expect(databaseService["client"]).to.not.be.undefined;
    expect(databaseService["db"].databaseName).to.equal('projet2990');
  });

  it("should not connect to the database when start is called with wrong URL", async () => {
    // Try to reconnect to local server
    try {
      await databaseService.start("WRONG URL");
      fail();
    } catch {
      expect(databaseService["client"]).to.be.undefined;
    }
  });

  it("should no longer be connected if close is called", async () => {
    const mongoUri = await mongoServer.getUri();
    await databaseService.start(mongoUri);
    await databaseService.closeConnection();
    expect(databaseService["client"].isConnected()).to.be.false;
  });
  it("should return a db object", async () => {
    const mongoUri = await mongoServer.getUri();
    await databaseService.start(mongoUri);
    expect(databaseService.database).to.equal((databaseService as any).db);
  });
  it('should throw an error if we try to start closed connection', async () => {
    const mongoUri = await mongoServer.getUri();
    await databaseService.start(mongoUri);
    await databaseService.closeConnection();
    expect(databaseService.start(mongoUri)).to.eventually.be.rejectedWith(Error);
  });
  /* TODO find way to test the return value of the promise
  it('should return the client when start is called', async () => {
    const mongoUri = await mongoServer.getUri();
    await databaseService.start(mongoUri);
    expect(databaseService.start(mongoUri)).to.equal((databaseService as any).client);
  });*/
});
