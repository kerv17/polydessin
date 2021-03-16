import { Injectable } from '@angular/core';
import { IndexService } from '@app/services/index/index.service';
import { CanvasInformation } from '@common/communication/canvas-information';
import { SlideModel } from 'ngx-owl-carousel-o/lib/models/slide.model';
@Injectable({
    providedIn: 'root',
})
export class CarouselService {
    showCarousel: boolean = false;
    pictures: CanvasInformation[] = [];

    constructor(private indexService: IndexService) {}

    close(): void {
        this.showCarousel = false;
    }
    test(test: string): void {
        window.alert(test);
    }

    delete(activeSlides: SlideModel[] | undefined): void {
        if (activeSlides != undefined) {
            const selectedSlide = activeSlides.length === 1 ? activeSlides[0] : activeSlides[1];
            if (confirm('Voulez-vous supprimez ce dessin')) {
                this.indexService.basicDelete(selectedSlide.id).subscribe((x) => window.alert(x.title));
                this.removeCanvasInformation(selectedSlide.id);
            }
        }
    }
    removeCanvasInformation(codeID: string): void {
        for (let elem of this.pictures) {
            if (elem.codeID === codeID) {
                elem = this.pictures[this.pictures.length - 1];
                this.pictures.pop();
            }
        }
    }

    initialiserCarousel(): void {
        this.indexService.basicGet().subscribe((x: CanvasInformation[] | undefined) => {
            // this.pictures = new Array(x.length);

            if (x !== undefined) {
                if (x.length === 0) {
                    window.alert('Aucun dessin enregistrer le server');
                    this.close();
                    return;
                }

                this.pictures = x;

                this.setSlides();
            } else {
                window.alert('Aucun connection avec le server');
                this.close();
            }
        });
    }

    setSlides(): void {
        for (let element of this.pictures) {
            element.imageData = 'data:image/png;base64,' + element.imageData;
            element = element;
        }

        this.showCarousel = true;
    }
}
