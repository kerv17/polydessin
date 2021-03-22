/* tslint:disable:no-unused-variable 
import { DataAccessService } from './data-access.service';
import { MetadataService } from './metadata.service';
import { ServerSaveService } from './server-save.service';

describe('Service: DataAccess', () => {
  let dataAccessService:DataAccessService;
  let metadataService:MetadataService;
  let serverSaveService:ServerSaveService;
  beforeEach(async () => {
   // dataAccessService = new DataAccessService(metadataService,serverSaveService);
  });

});*/
/* tslint:disable:no-unused-variable */
import { CanvasInformation } from '@common/communication/canvas-information';
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
    let sandbox: sinon.SinonSandbox ;

    beforeEach(async () => {
        databaseService = new DatabaseServiceMock();
        metadataService = new MetadataService(databaseService as any);
        serverSaveService = new ServerSaveService();
        dataAccessService = new DataAccessService(metadataService,serverSaveService);
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


    it('should  return all the information of drawing saved on server', async () => {
            
      const spyGetAllData= sinon.spy(dataAccessService,'getAllData');
      
      sandbox.stub(metadataService, 'getAllMetadata').returns(Promise.resolve([testMetadata,testMetadata2]));
      //sandbox.stub(serverSaveService, 'createCanvasInformation').returns([testinformation,testinformation2]);
      //const information = await dataAccessService.getAllData();
      spyGetAllData.returned(Promise.resolve([testinformation,testinformation2]));
     // expect(await information[0]).to.deep.equals(testMetadata);
      //expect(await information[1]).to.deep.equals(testMetadata2);
      //spyExists.reset();
    });
    it('should  return error if getAllMetadata throws an error', async () => {
      sandbox.stub(metadataService, 'getAllMetadata').returns( Promise.reject(new Error('something happened')));
      //sandbox.stub(serverSaveService, 'createCanvasInformation').returns([testinformation,testinformation2]);
      expect(dataAccessService.getAllData()).to.eventually.be.rejectedWith(Error('something happened'));
      //spyExists.reset();
    });
    it('should  return error if createCanvasInformation throws an error', async () => {
      
      sandbox.stub(serverSaveService, 'createCanvasInformation').yields( Error('something happened'));
      //sandbox.stub(serverSaveService, 'createCanvasInformation').returns([testinformation,testinformation2]);
      expect(dataAccessService.getAllData()).to.eventually.be.rejectedWith(Error('something happened'));
      //spyExists.reset();
    });
});