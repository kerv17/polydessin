import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { IndexService } from '@app/services/index/index.service';
import { CanvasInformation } from '@common/communication/canvas-information';
import { SlideModel } from 'ngx-owl-carousel-o/lib/models/slide.model';
@Injectable({
    providedIn: 'root',
})
export class CarouselService {
    showCarousel: boolean = false;
    pictures: CanvasInformation[] = [];

    constructor(private indexService: IndexService, private drawingService: DrawingService, private router: Router) {}

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
                this.indexService.basicDelete(selectedSlide.id).subscribe((x) => {
                    if (x != undefined) {
                        window.alert(x.title);
                    } else {
                        window.alert('Connexion impossible avec le serveur');
                        this.close();
                    }
                });
                this.removeCanvasInformation(selectedSlide.id);
            }
        }
    }
    removeCanvasInformation(codeID: string): void {
        for (let i = 0; i < this.pictures.length; i++) {
            if (this.pictures[i].codeID === codeID) {
                this.pictures[i] = this.pictures[this.pictures.length - 1];

                this.pictures.pop();
            }
        }
    }
    loadCanvas(info: CanvasInformation): void {
        this.router.navigate(['/editor']).then((x) => {
            window.alert('test');
            this.drawingService.loadOldCanvas(info);
            this.close();
        });
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
