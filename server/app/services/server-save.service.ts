import { CanvasInformation } from '@common/communication/canvas-information';
import * as fs from 'fs';
import { injectable } from 'inversify';
import { Metadata } from '../classes/metadata';

@injectable()
export class ServerSaveService {
    showModalExport: boolean = false;

    saveImage(type: string, code: string, data: string): void {
        if (type != undefined && code !== '') {
            const base64Data = data.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
            try {
                fs.writeFileSync('./' + code + '.' + type, base64Data, 'base64');
            } catch {
                throw new Error('la sauvegarde a échouée');
            }
        } else {
            throw new Error('nom ou type invalide');
        }
    }
    deleteCanvasInformation(canvaToDelete: string): void {
        if (fs.existsSync(canvaToDelete + '.png')) {
            try {
                fs.unlinkSync(canvaToDelete + '.png');
            } catch (err) {
                throw new Error('le serveur ne réussit pas à détruire le Canva');
            }
        } else if (fs.existsSync(canvaToDelete + '.jpeg')) {
            try {
                fs.unlinkSync(canvaToDelete + '.jpeg');
            } catch (err) {
                throw new Error('le serveur ne réussit pas à détruire le Canva');
            }
        } else {
            throw new Error('Canva non trouvé');
        }
    }
    createCanvasInformation(metadata: Metadata[]): CanvasInformation[] {
        const information: CanvasInformation[] = new Array(metadata.length);
        let j = 0;
        for (const elem of metadata) {
            if (fs.existsSync(elem.codeID + '.' + elem.format)) {
                information[j] = {} as CanvasInformation;
                try {
                    information[j].imageData = fs.readFileSync(elem.codeID + '.' + elem.format, 'base64');
                } catch (err) {
                    throw new Error('le serveur ne réussit pas à récuperer le dessin');
                }

                information[j].name = elem.name;
                information[j].codeID = elem.codeID.toHexString();
                information[j].height = elem.height;
                information[j].tags = elem.tags;
                information[j].width = elem.width;
                information[j].format = elem.format;
                j++;
            }
        }

        for (; j < metadata.length; j++) {
            information.pop();
        }

        return information;
    }
}
