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
    beforeEach(() => {
        serverSaveService = new ServerSaveService();
        testinformation = {
            codeID: new ObjectId('507f1f77bcf86cd799439011').toHexString(),
            name: 'DessinTest',
            tags: ['tag1', 'tag2'],
            format: 'png',
            height: 300,
            width: 300,
            imageData:
                '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',
        };
        testinformation2 = {
            codeID: new ObjectId('507f1f77bcf86cd799439012').toHexString(),
            name: 'DessinTest2',
            tags: ['tagUnique', 'tag2'],
            format: 'jpeg',
            height: 300,
            width: 300,
            imageData:
                'imageData/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBA',
        };
        sandbox = sinon.createSandbox();
    });
    afterEach(() => {
        sandbox.restore();
    });

    it('should  save the image of a jpeg format', () => {
        const spyWrite = sinon.spy(fs, 'writeFileSync');
        chai.expect(() => serverSaveService.saveImage(testinformation2.format, testinformation2.codeID, testinformation2.imageData)).to.not.throw(
            Error,
        );

        chai.expect(spyWrite.called).to.equal(true);

        serverSaveService.deleteCanvasInformation(testinformation2.codeID);
        spyWrite.restore();
    });
    it('should  save the image of a png format', () => {
        const spyWrite = sinon.spy(fs, 'writeFileSync');

        chai.expect(() => serverSaveService.saveImage(testinformation.format, testinformation.codeID, testinformation.imageData)).to.not.throw(Error);
        chai.expect(spyWrite.called).to.equal(true);

        serverSaveService.deleteCanvasInformation(testinformation.codeID);
        spyWrite.restore();
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
        sandbox.stub(fs, 'writeFileSync').yields(error);

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

        chai.expect(() => serverSaveService.deleteCanvasInformation(testinformation2.codeID)).to.not.throw(Error);
        chai.expect(spyUnlink.called).to.be.true;
        chai.expect(spyExists.returned(true)).to.eql(true);
        chai.expect(fs.existsSync(testinformation2.codeID + testinformation2.format)).to.be.false;

        spyUnlink.restore();
        spyExists.restore();
    });
    it('should  throw error on delete of image doesnt exists', () => {
        sandbox.stub(fs, 'existsSync').returns(false);
        chai.expect(() => serverSaveService.deleteCanvasInformation('random')).to.throw(Error, 'Canva non trouvé');
    });
    it('should  throw error on delete error of a jpeg image if unlink fails', () => {
        const error = new Error('That did not work');
        serverSaveService.saveImage(testinformation2.format, testinformation2.codeID, testinformation2.imageData);
        sandbox.stub(fs, 'unlinkSync').throws(error);
        chai.expect(() => serverSaveService.deleteCanvasInformation(testinformation2.codeID)).to.throw(
            Error,
            'le serveur ne réussit pas à détruire le Canva',
        );
    });
    it('should  delete the image of a png format', () => {
        const spyUnlink = sinon.spy(fs, 'unlinkSync');
        const spyExists = sinon.spy(fs, 'existsSync');

        serverSaveService.saveImage(testinformation.format, testinformation.codeID, testinformation.imageData);

        chai.expect(() => serverSaveService.deleteCanvasInformation(testinformation.codeID)).to.not.throw(Error);
        chai.expect(spyUnlink.called).to.be.true;
        chai.expect(spyExists.returned(true)).to.eql(true);
        chai.expect(fs.existsSync(testinformation.codeID + testinformation.format)).to.be.false;

        spyUnlink.restore();
        spyExists.restore();
    });

    it('should  throw error on delete error of a png image if unlink fails', () => {
        const error = new Error('That did not work');

        serverSaveService.saveImage(testinformation.format, testinformation.codeID, testinformation.imageData);
        sandbox.stub(fs, 'unlinkSync').throws(error);

        chai.expect(() => serverSaveService.deleteCanvasInformation(testinformation.codeID)).to.throw(
            Error,
            'le serveur ne réussit pas à détruire le Canva',
        );
    });

    it('should  create canvas information of metadata that has image saved on server', () => {
        const spyCreate = sinon.spy(serverSaveService, 'createCanvasInformation');
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
        const info = serverSaveService.createCanvasInformation(metadataArray);

        chai.expect(info.length).to.equal(2);
        chai.expect(spyCreate.returned([testinformation, testinformation2])).to.equal(true);
        chai.expect(info.find((x) => x.codeID === testinformation2.codeID)).to.deep.equals(testinformation2);
        chai.expect(info.find((x) => x.codeID === testinformation.codeID)).to.deep.equals(testinformation);

        serverSaveService.deleteCanvasInformation(testinformation2.codeID);
        serverSaveService.deleteCanvasInformation(testinformation.codeID);
        spyCreate.restore();
    });
    it('should  create canvas information of metadata that only has images from server', () => {
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
        const info = serverSaveService.createCanvasInformation(metadataArray);
        chai.expect(info.length).to.equal(2);
    });
    it('should  throw error if readfileSync fails', () => {
        const error = new Error('something didnt work on readFile');
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

        sandbox.stub(fs, 'readFileSync').throws(error);
        serverSaveService.saveImage(testinformation.format, testinformation.codeID, testinformation.imageData);
        serverSaveService.saveImage(testinformation2.format, testinformation2.codeID, testinformation2.imageData);
        chai.expect(() => serverSaveService.createCanvasInformation(metadataArray)).to.throw(
            Error,
            'le serveur ne réussit pas à récuperer le dessin',
        );
        serverSaveService.deleteCanvasInformation(testinformation2.codeID);
        serverSaveService.deleteCanvasInformation(testinformation.codeID);
    });
});
