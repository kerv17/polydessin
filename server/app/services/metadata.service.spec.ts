/* tslint:disable:no-unused-variable */
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient, ObjectId } from 'mongodb';
import { Metadata } from '../classes/metadata';
import { DatabaseServiceMock } from './database.service.mock';
import { MetadataService } from './metadata.service';
chai.use(chaiAsPromised); // this allows us to test for rejection

describe('Service: Metadata', () => {
    let metadataService: MetadataService;
    let databaseService: DatabaseServiceMock;
    let client: MongoClient;
    let testMetadata: Metadata;

    beforeEach(async () => {
        databaseService = new DatabaseServiceMock();
        client = (await databaseService.start()) as MongoClient;
        metadataService = new MetadataService(databaseService as any);
        testMetadata = {
            codeID: new ObjectId('507f1f77bcf86cd799439011'),
            name: 'DessinTest',
            tags: ['tag1', 'tag2'],
            format: 'png',
            height: 300,
            width: 300,
        };
        await metadataService.collection.insertOne(testMetadata);
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    it('should insert a new metadata', async () => {
        const secondMetadata: Metadata = {
            codeID: new ObjectId('507f1f77bcf86cd799439012'),
            name: 'DessinTest2',
            tags: ['tag1', 'tag'],
            format: 'png',
            height: 300,
            width: 300,
        };

        await metadataService.addMetadata(secondMetadata);
        const datas = await metadataService.collection.find({}).toArray();
        expect(datas.length).to.equal(2);
        expect(datas.find((x) => x.name === secondMetadata.name)).to.deep.equals(secondMetadata);
    });

    it('should not insert a new metadata if it has an invalid name and tags', async () => {
        const secondMetadata: Metadata = {
            codeID: new ObjectId('507f1f77bcf86cd799439012'),
            name: 'dessinTest2',
            tags: ['tag ', 'tag'],
            format: 'png',
            height: 300,
            width: 300,
        };
        try {
            await metadataService.addMetadata(secondMetadata);
        } catch {
            const courses = await metadataService.collection.find({}).toArray();
            expect(courses.length).to.equal(1);
        }
    });

    // Error handling
    describe('Error handling', async () => {
        it('should throw an error if we try to add metadata on a closed connection', async () => {
            await client.close();
            const secondMetadata: Metadata = {
                codeID: new ObjectId('507f1f77bcf86cd799439012'),
                name: 'DessinNew',
                tags: ['tag', 'tag'],
                format: 'png',
                height: 300,
                width: 300,
            };
            expect(metadataService.addMetadata(secondMetadata)).to.eventually.be.rejectedWith(Error);
        });
    });
});
