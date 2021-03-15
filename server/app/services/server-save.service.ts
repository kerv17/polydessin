import { injectable } from 'inversify';

@injectable()
export class ServerSaveService {
    constructor() {}
    showModalExport: boolean = false;

    saveImage(type: string, name: string,data:string): void {
        if (type != undefined && name !== '') {
            
                const a = document.createElement('a');
                a.href=data;
                a.download = name;
                document.body.appendChild(a);
                a.click();
        }
    }
}
