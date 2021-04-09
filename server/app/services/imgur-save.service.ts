import { CanvasInformation } from '@common/communication/canvas-information';
import axios from 'axios';
import { injectable } from 'inversify';

@injectable()
export class ImgurSaveService {
    //  private token: string = '5b34cdfdfaa5535b3ec50bb72548f36a2646124b';

    async uploadImage(information: CanvasInformation): Promise<string> {
        const base64Data = information.imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

        const data = {
            image: base64Data,
            type: 'image/' + information.format,
            name: information.name,
            title: information.name,
        };

        const header = {
            Authorization: 'Client-ID ' + '2ab87126888d8b5',
        };

        return axios
            .post('https://api.imgur.com/3/image', data, { headers: header })
            .then((res) => {
                const jsonData = res.data.data;
                return jsonData.link;
            })
            .catch((err) => {
                throw { message: "erreur lors de l'envoi de la requete " } as Error;
            });
    }
}
