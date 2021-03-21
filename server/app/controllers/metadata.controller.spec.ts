import { Application } from '@app/app';
//import { DataAccessService } from '@app/services/data-access.service';
import { TYPES } from '@app/types';
import { CanvasInformation } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { expect } from 'chai';
import * as supertest from 'supertest';
import { /*Stubbed,*/ testingContainer } from '../../test/test-utils';

// tslint:disable:no-any
const HTTP_STATUS_OK = 200;
//const HTTP_STATUS_CREATED = 201;

describe('MetadataController', () => {
    const baseMessage = { title: 'Hello world', body: 'anything really' } as Message;
    const baseInformation = { name: "aName", tags:['tag1','tag2'] ,format : 'png', width: 0, height: 0, imageData: '' } as CanvasInformation;
    //let dataAccessService: Stubbed<DataAccessService>;
    let app: Express.Application;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.DataAccessService).toConstantValue({
            getAllData: sandbox.stub().resolves([baseInformation,baseInformation]),
            getDataByTags: sandbox.stub().resolves(baseInformation),
            addData: sandbox.stub().resolves(),
            deleteData: sandbox.stub().resolves(baseMessage),
        });
        //dataAccessService = container.get(TYPES.DataAccessService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it('should return canvasInformation from data access service on valid get request to root', async () => {
        //dataAccessService.getAllData.returns([baseInformation,baseInformation]);
        return supertest(app)
            .get('/api/metadata/')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal([baseInformation,baseInformation]);
            });
    });

    it('should return canvasInformation from data access service on valid get request to tag route', async () => {
        //dataAccessService.getDataByTags.returns(baseInformation);
        return supertest(app)
            .get('/api/metadata/:tags')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(baseInformation);
            });
    });

    /*it('should store message in the array on valid post request to /send', async () => {
        const message: Message = { title: 'Hello', body: 'World' };
        return supertest(app).post('/api/metadata/send').send(message).set('Accept', 'application/json').expect(HTTP_STATUS_CREATED);
    });

    it('should return an arrat of messages on valid get request to /all', async () => {
        indexService.getAllMessages.returns([baseMessage, baseMessage]);
        return supertest(app)
            .get('/api/index/all')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal([baseMessage, baseMessage]);
            });
    });*/
});
