import { CanvasInformation } from '@common/communication/canvas-information';
import * as https from 'https';
import { injectable } from 'inversify';
@injectable()
export class ImgurSaveService {
    private token: string = '5b34cdfdfaa5535b3ec50bb72548f36a2646124b';
    constructor() {}

    /*async authorize(): Promise<void> {
        /*     const options = {
            hostname: 'api.imgur.com',

            path: '/oauth2/authorize',

            client_id: '2ab87126888d8b5',
            response_type: 'token',
        };
        const req = https.request(
            //    options,
            'https://api.imgur.com/oauth2/authorize?client_id=2ab87126888d8b5&response_type=token&state=APPLICATION_STATE',
            function (res) {
                console.log(`statusCode: ${res.statusCode}`);
                console.log(res.headers['set-cookie']);
            },
        );
        req.end();
    }*/

    async addData(information: CanvasInformation): Promise<void> {
        const image = encodeURIComponent(
            'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
        );
        //   const image = 'https://static.wikia.nocookie.net/software/images/5/51/Orca_Browser.png';

        const options = {
            hostname: 'api.imgur.com',
            method: 'POST',
            port: 443,

            path: '/3/image?' + 'type=base64&name=test&title=hereYouGo&image=' + image,

            headers: {
                Authorization: 'Bearer ' + this.token,
                'content-type': 'application/json',
                //    'content-lenght': ('/3/image?' + 'type=base64&name=test&title=aloha&image=' + image).length,
                //  Authorization: 'Client-ID 2ab87126888d8b5 ',
            },
        };
        const req = https.request(options, function (res) {
            console.log(`statusCode: ${res.statusCode}`);
            //  console.log(res);
            res.setEncoding('utf8');
            res.on('data', function (data) {
                console.log(JSON.parse(data));
            });

            res.on('error', console.error);
        });
        req.end();
    }
}
