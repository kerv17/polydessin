import { CanvasInformation } from '@common/communication/canvas-information';
import axios from 'axios';
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

    async uploadImage(information: CanvasInformation): Promise<string> {
        //   const imagteste = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
        //   const image = 'https://static.wikia.nocookie.net/software/images/5/51/Orca_Browser.png';
        const base64Data = information.imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        // TODO Could try to write file and send file instead cuz thats just easier

        const data = {
            image: base64Data,
            type: 'image/' + information.format,
            name: information.name,
            title: information.name,
        };

        const header = {
            Authorization: 'Bearer ' + this.token,
            'content-type': 'application/json',
        };

        return axios
            .post('https://api.imgur.com/3/image', data, { headers: header })
            .then((res) => {
                const data = res.data.data;
                return data.link;
            })
            .catch((err) => {
                throw { message: "erreur lors de l'envoi de la requete " } as Error;
            });

        /*const options = {
            hostname: 'api.imgur.com',
            method: 'POST',
            port: 443,

            path: '/3/image?' + 'type=image/png&name=test&title=hereYouGo&image=' + base64Data,

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
                //  console.log(JSON.parse(data));
            });

            res.on('error', console.error);
        });
        req.end();*/
    }
}
