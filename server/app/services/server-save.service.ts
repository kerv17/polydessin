import { CanvasInformation } from '@common/communication/canvas-information';
import * as fs from 'fs';
import { injectable } from 'inversify';
import { Metadata } from '../classes/metadata';

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

    createCanvasInformation(metadata:Metadata[]): CanvasInformation[]{
        let information:CanvasInformation[]= new Array(metadata.length);
        for(let i:number=0;i<metadata.length;i++){
            if(fs.existsSync('./'+metadata[i].codeID+'.'+metadata[i].format)){
                information[i].imageData =fs.readFileSync('./'+metadata[i].codeID+'.'+metadata[i].format,{encoding:'base64'} );
                information[i].name=metadata[i].name;
                information[i].codeID=metadata[i].codeID.toHexString();
                information[i].height=metadata[i].height;
                information[i].tags=metadata[i].tags;
                information[i].width=metadata[i].width;
                information[i].format=metadata[i].format;
            }
        }
        return information;
       
       

    }
}
