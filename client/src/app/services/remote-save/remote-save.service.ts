import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ServerRequestService } from '@app/services/server-request/server-request.service';
import { CanvasInformation } from '@common/communication/canvas-information';
import { PopupService } from '../modal/popup.service';

const MAX_SIZE_TAG = 10;
const MIN_SIZE_TAG = 3;
const MAX_SIZE_NAME = 20;
const MIN_SIZE_NAME = 6;
const MAX_NUMBER_TAG = 5;
@Injectable({
    providedIn: 'root',
})
export class RemoteSaveService {
    constructor(public drawingService: DrawingService, private requestService: ServerRequestService, private popupService: PopupService) {}
    showModalSave: boolean = false;

    post(information: CanvasInformation): void {
        if (!this.validateMetadata(information)) {
            this.popupService.openPopup('Il faut respecter les critères pour le tag et le nom');
            return;
        }

        if (confirm('Êtes-vous sûr de vouloir sauvegarder le dessin')) {
            const data: string = this.drawingService.canvas.toDataURL('image/' + information.format);
            console.log(data);
            information.imageData = data;
            information.height = this.drawingService.canvas.height;
            information.width = this.drawingService.canvas.width;

            this.requestService.basicPost(information).subscribe(
                (response) => {
                    if (response.body) this.popupService.openPopup(response.body.title);
                },
                (err: HttpErrorResponse) => {
                    if (err.status === 0) this.popupService.openPopup('Aucune connection avec le serveur');
                    else {
                        this.popupService.openPopup(err.error);
                    }
                },
            );
        }
    }
    validateMetadata(information: CanvasInformation): boolean {
        return this.validateName(information.name) && this.validateTags(information.tags) && this.verifySaveMode(information.format);
    }

    tagsHandler(tags: string): string[] {
        if (tags === '') {
            const emptyArray: string[] = [];
            return emptyArray;
        } else {
            const tagInArray: string[] = tags.split(',');
            return tagInArray;
        }
    }

    private validateName(name: string): boolean {
        return name != undefined && name.startsWith('Dessin') && this.verifyNameLength(name);
    }
    private verifyNameLength(name: string): boolean {
        return name.length >= MIN_SIZE_NAME && name.length <= MAX_SIZE_NAME;
    }
    private verifySaveMode(saveMode: string): boolean {
        return saveMode === 'jpeg' || saveMode === 'png';
    }

    private validateTags(tags: string[]): boolean {
        if (tags.length === 0) {
            // il est accepter qu'un dessin peut ne pas avoir de tag
            return true;
        } else {
            return (
                this.verifyTagsNotNull(tags) && this.verifyTagsLength(tags) && this.verifyTagsNoSpecialChracter(tags) && this.verifyTagsNumber(tags)
            );
        }
    }
    private verifyTagsNumber(tags: string[]): boolean {
        return tags.length <= MAX_NUMBER_TAG;
    }
    private verifyTagsNotNull(tags: string[]): boolean {
        return tags.every((elem) => elem.length > 0);
    }
    private verifyTagsLength(tags: string[]): boolean {
        return tags.every((elem) => elem.length <= MAX_SIZE_TAG) && tags.every((elem) => elem.length >= MIN_SIZE_TAG);
    }
    /*
  RÉFÉRENCES POUR LE CODE DE LA METHODE  verifyTagsNoSpecialChracter :
  Le présent code est tiré du tutoriel "Check wheter String contains Special Characters using JavaScript" de Mudassar Khan,
  publié le 28 Decembre 2018
  disponible à l'adresse suivante : "https://www.aspsnippets.com/Articles/Check-whether-String-contains-Special-Characters-using-JavaScript.aspx"
  Quelques modifications y ont été apportées
  */
    private verifyTagsNoSpecialChracter(tags: string[]): boolean {
        // only accepts letters and numbers
        const regex = /^[A-Za-z0-9]+$/;
        return tags.every((elem) => regex.test(elem));
    }
}
