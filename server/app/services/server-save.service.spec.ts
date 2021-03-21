/* tslint:disable:no-unused-variable */
import { CanvasInformation } from '@common/communication/canvas-information';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as chaiSpies from 'chai-spies';
import { describe } from 'mocha';
import { ObjectId } from 'mongodb';
import { ServerSaveService } from './server-save.service';
// let chaiSpies = require('chai-spies');
chai.use(chaiAsPromised); // this allows us to test for rejection
chai.use(chaiSpies);

describe('Service: Metadata', () => {
    let serverSaveService: ServerSaveService;
    let testinformation: CanvasInformation;
    let testinformation2: CanvasInformation;

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
    });

    it('should  save the image of a jpeg format', () => {
       // const spy = chai.spy(fs.writeFile);
        //serverSaveService.saveImage(testinformation2.format, testinformation2.codeID, testinformation2.imageData);
        //expect(spy).to.have.been.called();
        expect(() => serverSaveService.saveImage(testinformation2.format, testinformation2.codeID, testinformation2.imageData)).to.be.ok;
        serverSaveService.deleteCanvasInformation(testinformation2.codeID);
    });
    it('should  save the image of a png format', () => {
        expect(() => serverSaveService.saveImage(testinformation.format, testinformation.codeID, testinformation.imageData)).to.be.ok;
        serverSaveService.deleteCanvasInformation(testinformation.codeID);
    });

    /* TODO: find how to make fs.writefile go in errorr
    it('should  not save the image and throw error if the writefile fails', () => {
        const testinformation3: CanvasInformation = {
            codeID: new ObjectId('507f1f77bcf86cd799439013').toHexString(),
            name: 'DessinTest3',
            tags: ['tagUnique', 'tag2'],
            format: 'jpeg',
            height: 300,
            width: 300,
            imageData: '',
        };
        expect(() => serverSaveService.saveImage(testinformation3.format, testinformation3.codeID, testinformation3.imageData)).to.throw(
            Error,
            'la sauvegarde a échouée',
        );
    });*/
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
        expect(() => serverSaveService.saveImage(testinformation3.format, testinformation3.codeID, testinformation3.imageData)).to.throw(
            Error,
            'nom ou type invalide',
        );
    });

    it('should  delete the image of a jpeg format', () => {
        serverSaveService.saveImage(testinformation2.format, testinformation2.codeID, testinformation2.imageData);
        expect(() => serverSaveService.deleteCanvasInformation(testinformation2.codeID)).to.be.ok;
    });
    it('should  delete the image of a png format', () => {
        serverSaveService.saveImage.bind(testinformation.format, testinformation.codeID, testinformation.imageData);
        expect(() => serverSaveService.deleteCanvasInformation(testinformation.codeID)).to.be.ok;
    });
});
