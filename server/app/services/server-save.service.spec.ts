/* tslint:disable:no-unused-variable */
// tslint:disable:no-unused-expression
// tslint:disable:no-any
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import { describe } from 'mocha';
import { ObjectId } from 'mongodb';
import * as sinon from 'sinon';
import { CanvasInformation } from '../../../common/communication/canvas-information';
import { Metadata } from '../classes/metadata';
import { ServerSaveService } from './server-save.service';
chai.use(chaiAsPromised); // this allows us to test for rejection

describe('Service: Server-Save', () => {
    let serverSaveService: ServerSaveService;
    let testinformation: CanvasInformation;
    let testinformation2: CanvasInformation;
    let sandbox: sinon.SinonSandbox;

    beforeEach(async () => {
        serverSaveService = new ServerSaveService();
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
    afterEach(() => {
        sandbox.restore();
    });

    it('should  save the image of a jpeg format', () => {
        chai.expect(() => serverSaveService.saveImage(testinformation2.format, testinformation2.codeID, testinformation2.imageData)).to.be.ok;
        serverSaveService.deleteCanvasInformation(testinformation2.codeID);
    });
    it('should  save the image of a png format', () => {
        chai.expect(() => serverSaveService.saveImage(testinformation.format, testinformation.codeID, testinformation.imageData)).to.be.ok;
        serverSaveService.deleteCanvasInformation(testinformation.codeID);
    });

    it('should  not save the image and throw error if the writefile fails', () => {
        const error = new Error('la sauvegarde a échouée');
        const testinformation3: CanvasInformation = {
            codeID: new ObjectId('507f1f77bcf86cd799439013').toHexString(),
            name: 'DessinTest3',
            tags: ['tagUnique', 'tag2'],
            format: 'jpeg',
            height: 300,
            width: 300,
            imageData: '',
        };
        sandbox.stub(fs, 'writeFile').yields(error);
        chai.expect(() => serverSaveService.saveImage(testinformation3.format, testinformation3.codeID, testinformation3.imageData)).to.throw(
            Error,
            'la sauvegarde a échouée',
        );
    });

    it('should  not save the image and throw error if the type and name are undefined', () => {
        const testinformation3: CanvasInformation = {
            codeID: '',
            name: 'DessinTest',
            tags: ['tagUnique', 'tag2'],
            format: '',
            height: 300,
            width: 300,
            imageData: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD',
        };
        chai.expect(() => serverSaveService.saveImage(testinformation3.format, testinformation3.codeID, testinformation3.imageData)).to.throw(
            Error,
            'nom ou type invalide',
        );
    });

    it('should  delete the image of a jpeg format', () => {
        const spyUnlink = sinon.spy(fs, 'unlinkSync');
        const spyExists = sinon.spy(fs, 'existsSync');
        serverSaveService.saveImage(testinformation2.format, testinformation2.codeID, testinformation2.imageData);
        chai.expect(() => serverSaveService.deleteCanvasInformation(testinformation2.codeID)).to.be.ok;
        spyUnlink.called;
        spyExists.returned(true);
        chai.expect(fs.existsSync(testinformation2.codeID + testinformation2.format)).to.be.false;
        spyUnlink.restore();
        spyExists.restore();
    });
    it('should  throw ENOENT on delete of a jpeg image that doesnt exists', () => {
        const error: any = new Error('No such file or directory');
        error.code = 'ENOENT';
        sandbox.stub(fs, 'unlinkSync').throws(error);
        chai.expect(() => serverSaveService.deleteCanvasInformation(testinformation2.codeID)).to.throw(Error, 'Canva non trouvé');
    });
    it('should  throw error on delete error of a jpeg image that doesnt throw ENOENT', () => {
        const error = new Error('That did not work');

        sandbox.stub(fs, 'unlinkSync').throws(error);
        chai.expect(() => serverSaveService.deleteCanvasInformation(testinformation2.codeID)).to.throw(
            Error,
            'le serveur ne réussi pas detruire le Canva',
        );
    });
    it('should  delete the image of a png format', () => {
        const spyUnlink = sinon.spy(fs, 'unlinkSync');
        const spyExists = sinon.spy(fs, 'existsSync');
        serverSaveService.saveImage(testinformation.format, testinformation.codeID, testinformation.imageData);
        chai.expect(() => serverSaveService.deleteCanvasInformation(testinformation.codeID)).to.be.ok;
        spyUnlink.called;
        spyExists.returned(true);
        chai.expect(fs.existsSync(testinformation.codeID + testinformation.format)).to.be.false;
        spyUnlink.restore();
        spyExists.restore();
    });
    it('should  throw ENOENT on delete of a png image that doesnt exists', () => {
        const error: any = new Error('No such file or directory');
        error.code = 'ENOENT';
        sandbox.stub(fs, 'unlinkSync').throws(error);
        chai.expect(() => serverSaveService.deleteCanvasInformation(testinformation.codeID)).to.throw(Error, 'Canva non trouvé');
    });
    it('should  throw error on delete error of a png image that doesnt throw ENOENT', () => {
        const error = new Error('That did not work');

        sandbox.stub(fs, 'unlinkSync').throws(error);
        chai.expect(() => serverSaveService.deleteCanvasInformation(testinformation.codeID)).to.throw(
            Error,
            'le serveur ne réussi pas detruire le Canva',
        );
    });

    it('should  create canvas information of metadata that has image saved on server', () => {
        const spyExists = sinon.spy(serverSaveService, 'createCanvasInformation');
        const testMetadata: Metadata = {
            codeID: new ObjectId('507f1f77bcf86cd799439011'),
            name: 'DessinTest',
            tags: ['tag1', 'tag2'],
            format: 'png',
            height: 300,
            width: 300,
        };
        const testMetadata2: Metadata = {
            codeID: new ObjectId('507f1f77bcf86cd799439012'),
            name: 'DessinTest2',
            tags: ['tagUnique', 'tag2'],
            format: 'jpeg',
            height: 300,
            width: 300,
        };
        const metadataArray: Metadata[] = [testMetadata, testMetadata2];
        serverSaveService.saveImage(testinformation.format, testinformation.codeID, testinformation.imageData);
        serverSaveService.saveImage(testinformation2.format, testinformation2.codeID, testinformation2.imageData);
        serverSaveService.createCanvasInformation(metadataArray);
        chai.expect(spyExists.returned([testinformation, testinformation2]));
        serverSaveService.deleteCanvasInformation(testinformation2.codeID);
        serverSaveService.deleteCanvasInformation(testinformation.codeID);
    });
    it('should  create canvas information of metadata that only has images from server', () => {
        const spyExists = sinon.spy(serverSaveService, 'createCanvasInformation');
        const testMetadata: Metadata = {
            codeID: new ObjectId('507f1f77bcf86cd799439011'),
            name: 'DessinTest',
            tags: ['tag1', 'tag2'],
            format: 'png',
            height: 300,
            width: 300,
        };
        const testMetadata2: Metadata = {
            codeID: new ObjectId('507f1f77bcf86cd799439012'),
            name: 'DessinTest2',
            tags: ['tagUnique', 'tag2'],
            format: 'jpeg',
            height: 300,
            width: 300,
        };
        const testMetadata3: Metadata = {
            codeID: new ObjectId('507f1f77bcf86cd799439013'),
            name: 'DessinTest2',
            tags: ['tagUnique', 'tag2'],
            format: 'jpeg',
            height: 300,
            width: 300,
        };
        const metadataArray: Metadata[] = [testMetadata, testMetadata2, testMetadata3];
        serverSaveService.saveImage(testinformation.format, testinformation.codeID, testinformation.imageData);
        serverSaveService.saveImage(testinformation2.format, testinformation2.codeID, testinformation2.imageData);
        serverSaveService.createCanvasInformation(metadataArray);
        chai.expect(spyExists.returned([testinformation, testinformation2]));
        serverSaveService.deleteCanvasInformation(testinformation2.codeID);
        serverSaveService.deleteCanvasInformation(testinformation.codeID);
    });
    it('should  throw error if readfileSync fails', () => {
        const error = new Error('something didnt work on readFile');
        sandbox.stub(fs, 'readFileSync').throws(error);
        const testMetadata: Metadata = {
            codeID: new ObjectId('507f1f77bcf86cd799439011'),
            name: 'DessinTest',
            tags: ['tag1', 'tag2'],
            format: 'png',
            height: 300,
            width: 300,
        };
        const testMetadata2: Metadata = {
            codeID: new ObjectId('507f1f77bcf86cd799439012'),
            name: 'DessinTest2',
            tags: ['tagUnique', 'tag2'],
            format: 'jpeg',
            height: 300,
            width: 300,
        };
        const metadataArray: Metadata[] = [testMetadata, testMetadata2];
        serverSaveService.saveImage(testinformation.format, testinformation.codeID, testinformation.imageData);
        serverSaveService.saveImage(testinformation2.format, testinformation2.codeID, testinformation2.imageData);
        chai.expect(() => serverSaveService.createCanvasInformation(metadataArray)).to.throw(Error, 'le serveur ne réussi pas a recuperer le dessin');
        serverSaveService.deleteCanvasInformation(testinformation2.codeID);
        serverSaveService.deleteCanvasInformation(testinformation.codeID);
    });
});
