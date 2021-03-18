import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { IndexService } from '@app/services/index/index.service';
import { CanvasInformation } from '@common/communication/canvas-information';

const MAX_SIZE_TAG = 20;
const MIN_SIZE_TAG = 3;
@Injectable({
    providedIn: 'root',
})
export class RemoteSaveService {
    constructor(public drawingService: DrawingService, private indexService: IndexService) {}
    showModalSave: boolean = false;

    validateMetadata(name: string, tags: string[]): boolean {
        return this.validateName(name) && this.validateTags(tags);
    }
    // TODO define name acceptance rules
    private validateName(name: string): boolean {
        return name.startsWith('Dessin');
    }

    post(information: CanvasInformation): void {
        const data: string = this.drawingService.canvas.toDataURL('image/' + information.format);
        information.imageData = data;
        information.height = this.drawingService.canvas.height;
        information.width = this.drawingService.canvas.width;

        this.indexService.basicPost(information).subscribe();
    }

    // TODO define tags acceptance rules
    private validateTags(tags: string[]): boolean {
        if (tags.length === 0) {
            // il est accepter qu'un dessin peut ne pas avoir de tag
            return true;
        } else {
            if (
                this.verifyTagsNotNull(tags) &&
                this.verifyTagsTooLong(tags) &&
                this.verifyTagsTooShort(tags) &&
                this.verifyTagsNoSpecialChracter(tags)
            ) {
                return true;
            }
            return false;
        }
    }
    private verifyTagsNotNull(tags: string[]): boolean {
        return tags.every((elem) => elem.length > 0);
    }
    private verifyTagsTooLong(tags: string[]): boolean {
        return tags.every((elem) => elem.length <= MAX_SIZE_TAG);
    }
    private verifyTagsTooShort(tags: string[]): boolean {
        return tags.every((elem) => elem.length >= MIN_SIZE_TAG);
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
/*
initialiserCanvas(): void {
  this.indexService.basicGet().subscribe((x) => {
      this.pictures = new Array(x.length);
      console.log(x);
      let i = 0;
      for (const element of x) {
          this.pictures[i] = element;

          i++;
      }
      console.log(this.pictures[0]);
  });
}*/
