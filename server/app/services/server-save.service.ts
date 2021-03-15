import * as fs from 'fs';
import { injectable } from 'inversify';
@injectable()
export class ServerSaveService {
    constructor() {}
    showModalExport: boolean = false;

    saveImage(type: string, name: string,data:string): void {
        if (type != undefined && name !== '') {
            const base64Data= data.replace(/^data:image\/(png|jpg);base64,/, "");
            fs.writeFile('./'+name+'.'+type, base64Data, 'base64',function (err) {
              if (err) return console.log(err);
              console.log(name);
            });    
             
        }
    }
}
