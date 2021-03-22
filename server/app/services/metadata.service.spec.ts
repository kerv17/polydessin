/* tslint:disable:no-unused-variable */
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as Httpstatus from 'http-status-codes';
import { describe } from 'mocha';
import { MongoClient, ObjectId } from 'mongodb';
import { HttpException } from '../classes/http.exceptions';
import { Metadata } from '../classes/metadata';
import { DatabaseServiceMock } from './database.service.mock';
import { MetadataService } from './metadata.service';
chai.use(chaiAsPromised); // this allows us to test for rejection

describe('Service: Metadata', () => {
    let metadataService: MetadataService;
    let databaseService: DatabaseServiceMock;
    let client: MongoClient;
    let testMetadata: Metadata;
    let testMetadata2: Metadata;

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
        testMetadata2 = {
            codeID: new ObjectId('507f1f77bcf86cd799439012'),
            name: 'DessinTest2',
            tags: ['tagUnique', 'tag2'],
            format: 'png',
            height: 300,
            width: 300,
        };
        await metadataService.collection.insertOne(testMetadata);
        await metadataService.collection.insertOne(testMetadata2);
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    it('should get all metadatas from DB', async () => {
        const metadatas = await metadataService.getAllMetadata();
        expect(metadatas.length).to.equal(2);
        expect(testMetadata).to.deep.equals(metadatas[0]);
    });
    it('should throw an error on get all if database is empty', async () => {
        await metadataService.deleteMetadata(testMetadata.codeID.toHexString());
        await metadataService.deleteMetadata(testMetadata2.codeID.toHexString());
        expect(metadataService.getAllMetadata()).to.eventually.be.rejectedWith(new HttpException(Httpstatus.StatusCodes.NOT_FOUND, "Aucun canvas n'est présent dans la base de données"));
    });

    it('should get specific metadata with valid tag', async () => {
        const metadata = await metadataService.getMetadataByTags(['tagUnique']);
        expect(metadata[0]).to.deep.equals(testMetadata2);
    });
    it('should get all metadata with valid tag', async () => {
        const metadatas = await metadataService.getMetadataByTags(['tag2']);
        expect(metadatas[0]).to.deep.equals(testMetadata);
        expect(metadatas[1]).to.deep.equals(testMetadata2);
    });
    it('should get all metadata with valid at least one of the tags tag', async () => {
        const metadatas = await metadataService.getMetadataByTags(['tag1', 'tagUnique']);
        expect(metadatas[0]).to.deep.equals(testMetadata);
        expect(metadatas[1]).to.deep.equals(testMetadata2);
    });
    it('should get all metadata with valid at least one or all of the tags tag', async () => {
        const metadatas = await metadataService.getMetadataByTags(['tag1', 'tagUnique', 'tag2']);
        expect(metadatas[0]).to.deep.equals(testMetadata);
        expect(metadatas[1]).to.deep.equals(testMetadata2);
    });
    it('should throw an error on get with tags if no canvas are found', async () => {
        await metadataService.deleteMetadata(testMetadata.codeID.toHexString());
        await metadataService.deleteMetadata(testMetadata2.codeID.toHexString());
        expect(metadataService.getMetadataByTags(['anything'])).to.eventually.be.rejectedWith(new HttpException(Httpstatus.StatusCodes.NOT_FOUND, "Aucun canvas n'a été trouvée"));
    });

    it('should insert a new metadata', async () => {
        const numberOfElements = 3;
        const thirdMetadata: Metadata = {
            codeID: new ObjectId('507f1f77bcf86cd799439013'),
            name: 'DessinTest3',
            tags: ['tag1', 'tag'],
            format: 'png',
            height: 300,
            width: 300,
        };

        await metadataService.addMetadata(thirdMetadata);
        const datas = await metadataService.collection.find({}).toArray();
        expect(datas.length).to.equal(numberOfElements);
        expect(datas.find((x) => x.name === thirdMetadata.name)).to.deep.equals(thirdMetadata);
    });
    it('should insert a new metadata without tags', async () => {
        const numberOfElements = 3;
        const thirdMetadata: Metadata = {
            codeID: new ObjectId('507f1f77bcf86cd799439013'),
            name: 'DessinTest3',
            tags: [],
            format: 'png',
            height: 300,
            width: 300,
        };

        await metadataService.addMetadata(thirdMetadata);
        const datas = await metadataService.collection.find({}).toArray();
        expect(datas.length).to.equal(numberOfElements);
        expect(datas.find((x) => x.name === thirdMetadata.name)).to.deep.equals(thirdMetadata);
    });

    it('should not insert a new metadata if it has an invalid name and tags', async () => {
        const secondMetadata: Metadata = {
            codeID: new ObjectId('507f1f77bcf86cd799439013'),
            name: 'dessinTest3',
            tags: ['tag ', 'tag'],
            format: 'png',
            height: 300,
            width: 300,
        };
        try {
            await metadataService.addMetadata(secondMetadata);
        } catch {
            const courses = await metadataService.collection.find({}).toArray();
            expect(courses.length).to.equal(2);
        }
    });

    it('should delete an existing metadata if a valid codeID is sent', async () => {
        await metadataService.deleteMetadata('507f1f77bcf86cd799439012');
        const metadatas = await metadataService.collection.find({}).toArray();
        expect(metadatas.length).to.equal(1);
    });
    it('should not delete an existing metadata if an invalid codeID is sent', async () => {
        try {
            await metadataService.deleteMetadata('507f1f77bcf86cd799439015');
        } catch {
            const metadatas = await metadataService.collection.find({}).toArray();
            expect(metadatas.length).to.equal(2);
        }
    });

    // Error handling
    describe('Error handling', async () => {
        it('should throw an error if we try to get all metadata on a closed connection', async () => {
            await client.close();
            expect(metadataService.getAllMetadata()).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to get a metadata on a closed connection', async () => {
            await client.close();
            expect(metadataService.getMetadataByTags(testMetadata.tags)).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to delete a specific metadata on a closed connection', async () => {
            await client.close();
            expect(metadataService.deleteMetadata(testMetadata.codeID.toHexString())).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to add metadata on a closed connection', async () => {
            await client.close();
            const secondMetadata: Metadata = {
                codeID: new ObjectId('507f1f77bcf86cd799439013'),
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
