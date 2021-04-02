/* tslint:disable:no-unused-variable */
// tslint:disable:no-any
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { ObjectId } from 'mongodb';
import * as nock from 'nock';
import * as sinon from 'sinon';
import { CanvasInformation } from '../../../common/communication/canvas-information';
import { ImgurSaveService } from './imgur-save.service';

chai.use(chaiAsPromised);
const OK_STATUS = 200;
const ERROR_STATUS = 404;
describe('Service: ImgurSaveService', () => {
    const imgurSaveService = new ImgurSaveService();
    let testinformation: CanvasInformation;
    let testinformation2: CanvasInformation;
    let sandbox: sinon.SinonSandbox;

    const response = {
        data: {
            link: 'test',
        },
        success: true, // was the request successful
        status: 200, // http status code
    };
    beforeEach(async () => {
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
        let base64Data: string = testinformation.imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        const testdata = {
            image: base64Data,
            type: 'image/' + testinformation.format,
            name: testinformation.name,
            title: testinformation.name,
        };
        base64Data = testinformation2.imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        const testdata2 = { image: base64Data, type: 'image/' + testinformation2.format, name: testinformation2.name, title: testinformation2.name };
        nock('https://api.imgur.com').post('/3/image', testdata).reply(OK_STATUS, response);
        nock('https://api.imgur.com').post('/3/image', testdata2).reply(ERROR_STATUS, {
            message: 'something awful happened',
            code: 'AWFUL_ERROR',
        });

        sandbox = sinon.createSandbox();
    });

    afterEach(async () => {
        sandbox.restore();
    });

    it('should be able to send a post request to imgur', async () => {
        const promise = await imgurSaveService.uploadImage(testinformation);
        chai.expect(promise).to.eq('test');
    });

    it('should be able to catch an error on a postRequest', async () => {
        let rejected: Error = {} as Error;
        await imgurSaveService.uploadImage(testinformation2).catch((err) => {
            rejected = err;
        });
        chai.expect(rejected.message).to.eq("erreur lors de l'envoi de la requete ");
    });
});
