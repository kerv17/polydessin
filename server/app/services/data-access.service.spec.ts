
/* tslint:disable:no-unused-variable */
import { CanvasInformation } from '../../../common/communication/canvas-information';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { ObjectId } from 'mongodb';
import * as sinon from 'sinon';
import { Metadata } from '../classes/metadata';
import { DataAccessService } from './data-access.service';
import { DatabaseServiceMock } from './database.service.mock';
import { MetadataService } from './metadata.service';
import { ServerSaveService } from './server-save.service';
chai.use(chaiAsPromised); // this allows us to test for rejection

describe('Service: Data-Access', () => {
    let metadataService: MetadataService;
    let databaseService: DatabaseServiceMock;
    let serverSaveService: ServerSaveService;
    let dataAccessService: DataAccessService;
    let testMetadata: Metadata;
    let testMetadata2: Metadata;
    let testinformation: CanvasInformation;
    let testinformation2: CanvasInformation;
    let sandbox: sinon.SinonSandbox;

    beforeEach(async () => {
        databaseService = new DatabaseServiceMock();
        metadataService = new MetadataService(databaseService as any);
        serverSaveService = new ServerSaveService();
        dataAccessService = new DataAccessService(metadataService, serverSaveService);
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
            format: 'jpeg',
            height: 300,
            width: 300,
        };
        testinformation = {
            codeID: new ObjectId('507f1f77bcf86cd799439011').toHexString(),
            name: 'DessinTest',
            tags: ['tag1', 'tag2'],
            format: 'png',
            height: 300,
            width: 300,
            imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAe8AAADICAYAgCwdx/6eZ4uCaQM',
        };
        testinformation2 = {
            codeID: new ObjectId('507f1f77bcf86cd799439012').toHexString(),
            name: 'DessinTest2',
            tags: ['tagUnique', 'tag2'],
            format: 'jpeg',
            height: 300,
            width: 300,
            imageData: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD',
        };
        sandbox = sinon.createSandbox();
    });

    afterEach(async () => {
        sandbox.restore();
    });

    it('should  return all the information of drawing saved on server and DB', async () => {
        const spyGetAllData = sinon.spy(dataAccessService, 'getAllData');
        sandbox.stub(metadataService, 'getAllMetadata').resolves([testMetadata, testMetadata2]);
        sandbox.stub(serverSaveService, 'createCanvasInformation').returns([testinformation, testinformation2]);
        await dataAccessService.getAllData();
        expect(spyGetAllData.returned(Promise.resolve([testinformation, testinformation2]))).to.eql(true);
    });
    it('should  return error in getAllData if getAllMetadata throws an error', async () => {
        sandbox.stub(metadataService, 'getAllMetadata').returns(Promise.reject(new Error('something happened')));  
        expect(dataAccessService.getAllData()).to.eventually.be.rejectedWith(Error);
    });
    it('should  return error in getAllData if createCanvasInformation throws an error', async () => {
        sandbox.stub(serverSaveService, 'createCanvasInformation').yields(Error('something happened'));
        expect(dataAccessService.getAllData()).to.eventually.be.rejectedWith(Error);
    });

    it('should  return the information of drawing saved on server and DB that have at least one of the tags', async () => {
        const spyGetDataByTags = sinon.spy(dataAccessService, 'getDataByTags');
        sandbox.stub(metadataService, 'getMetadataByTags').resolves([testMetadata, testMetadata2]);
        sandbox.stub(serverSaveService, 'createCanvasInformation').returns([testinformation, testinformation2]);
        await dataAccessService.getDataByTags('someTag');
        expect(spyGetDataByTags.returned(Promise.resolve([testinformation, testinformation2]))).to.eql(true);
    });
    it('should  return error in getDataByTags if getAllMetadata throws an error', async () => {
        sandbox.stub(metadataService, 'getMetadataByTags').returns(Promise.reject(new Error('something happened')));
        expect(dataAccessService.getDataByTags('someTag')).to.eventually.be.rejectedWith(Error);
    });
    it('should  return error in getDataByTags if createCanvasInformation throws an error', async () => {
        sandbox.stub(serverSaveService, 'createCanvasInformation').yields(Error('something happened'));
        expect(dataAccessService.getDataByTags('someTag')).to.eventually.be.rejectedWith(Error);
    });

    it('should  not return anything if data is correctly added by addData', async () => {
        const spyAddData = sinon.spy(dataAccessService, 'addData');
        sandbox.stub(metadataService, 'addMetadata').resolves();
        sandbox.stub(serverSaveService, 'saveImage').returns();
        await dataAccessService.addData(testinformation);
        expect(spyAddData.returned(Promise.resolve())).to.eql(true);
    });
    it('should  return error in  addData if addMetadata throws an error', async () => {
        sandbox.stub(metadataService, 'addMetadata').returns(Promise.reject(new Error('something happened')));
        expect(dataAccessService.addData(testinformation)).to.eventually.be.rejectedWith(Error);
    });
    it('should  return error in  addData if saveImage throws an error', async () => {
        sandbox.stub(serverSaveService, 'saveImage').yields(Error('something happened'));
        expect(dataAccessService.addData(testinformation)).to.eventually.be.rejectedWith(Error);
    });

    it('should  not return anything if data is correctly deleted by deleteData', async () => {
        const spyDeleteData = sinon.spy(dataAccessService, 'deleteData');
        sandbox.stub(metadataService, 'deleteMetadata').resolves();
        sandbox.stub(serverSaveService, 'deleteCanvasInformation').returns();
        await dataAccessService.deleteData('aRandomCode');
        expect(spyDeleteData.returned(Promise.resolve())).to.eql(true);
    });
    it('should  return error in  deleteData if deleteMetadata throws an error', async () => {
        sandbox.stub(metadataService, 'deleteMetadata').returns(Promise.reject(new Error('something happened')));
        expect(dataAccessService.deleteData('aRandomCode')).to.eventually.be.rejectedWith(Error);
    });
    it('should  return error in  deleteData if deleteCanvasInformation throws an error', async () => {
        sandbox.stub(serverSaveService, 'deleteCanvasInformation').yields(Error('something happened'));
        expect(dataAccessService.deleteData('aRandomCode')).to.eventually.be.rejectedWith(Error);
    });
});
