import { CanvasInformation } from '@common/communication/canvas-information';
import * as fs from 'fs';
import { injectable } from 'inversify';
import { Metadata } from '../classes/metadata';

@injectable()
export class ServerSaveService {
    constructor() {}
    showModalExport: boolean = false;

    saveImage(type: string, name: string, data: string): void {
        if (type != undefined && name !== '') {
            const base64Data = data.replace(/^data:image\/(png|jpg);base64,/, '');
            fs.writeFile('./' + name + '.' + type, base64Data, 'base64', function (err) {
                if (err) return console.log(err);
                console.log(name);
            });
        }
    }

    createCanvasInformation(metadata: Metadata[]): CanvasInformation[] {
        const information: CanvasInformation[] = new Array(metadata.length);
        let j = 0;
        console.log(metadata);
        for (let i = 0; i < metadata.length; i++) {
            if (fs.existsSync(metadata[i].codeID + '.' + metadata[i].format)) {
                information[j] = {} as CanvasInformation;
                information[j].imageData = fs.readFileSync(metadata[i].codeID + '.' + metadata[i].format, 'base64');
                console.log('test');

                information[j].name = metadata[i].name;
                information[j].codeID = metadata[i].codeID.toHexString();
                information[j].height = metadata[i].height;
                information[j].tags = metadata[i].tags;
                information[j].width = metadata[i].width;
                information[j].format = metadata[i].format;
                j++;
            }
        }

        for (; j < metadata.length; j++) {
            information.pop();
        }

        return information;
    }
}
