import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ServerRequestService } from '@app/services/index/server-request.service';
import { CanvasInformation } from '@common/communication/canvas-information';
import * as Httpstatus from 'http-status-codes';
import { SlideModel } from 'ngx-owl-carousel-o/lib/models/slide.model';
@Injectable({
    providedIn: 'root',
})
export class CarouselService {
    showCarousel: boolean = false;
    pictures: CanvasInformation[] = [];
    currentTags: string;
    loadImage: boolean = false;
    imageToLoad: CanvasInformation = {} as CanvasInformation;
    showLoad: boolean = false;
    currentSearch: string = '';
    constructor(private requestService: ServerRequestService, private drawingService: DrawingService, private router: Router) {}

    close(): void {
        this.showCarousel = false;
    }

    delete(activeSlides: SlideModel[] | undefined): void {
        if (activeSlides != undefined) {
            const selectedSlide = activeSlides.length === 1 ? activeSlides[0] : activeSlides[1];

            if (confirm('Voulez-vous supprimez ce dessin')) {
                this.requestService.basicDelete(selectedSlide.id).subscribe((x) => {
                    if (x != undefined) {
                        window.alert(x.title);
                    } else {
                        window.alert('Connexion impossible avec le serveur');
                        this.close();
                    }
                });

                this.removeCanvasInformation(selectedSlide.id);
                if (this.pictures.length === 0) {
                    window.alert('Il ne reste plus de dessin');
                }
            }
        }
    }
    /*  loadImageButton(activeSlides: SlideModel[] | undefined): void {
        if (activeSlides != undefined) {
            const selectedSlide = activeSlides.length === 1 ? activeSlides[0] : activeSlides[1];
            const canvas = this.findCanvasInformation(selectedSlide.id);
            this.loadCanvas(canvas);
        }
    }*/

    removeCanvasInformation(codeID: string): void {
        for (let i = 0; i < this.pictures.length; i++) {
            if (this.pictures[i].codeID === codeID) {
                this.pictures[i] = this.pictures[this.pictures.length - 1];

                this.pictures.pop();
            }
        }
    }
    loadCanvas(info: CanvasInformation): void {
        if (this.router.url.includes('/editor')) {
            this.drawingService.loadOldCanvas(info);

            this.close();
        } else {
            this.router.navigate(['/editor']);
            this.loadImage = true;
            this.imageToLoad = info;
        }
    }
    initialiserCarousel(): void {
        this.currentTags = '';
        this.currentSearch = '';

        this.requestService.basicGet().subscribe((x: CanvasInformation[] | undefined) => {
            if (x !== undefined) {
                if (x.length === 0) {
                    window.alert('Aucun dessin enregistrer le serveur');
                    this.close();
                    return;
                }

                this.pictures = x;

                this.setSlides();
            } else {
                window.alert('Aucune connection avec le server');
                this.close();
            }
        });
    }
    /*  findCanvasInformationPosition(canvas: CanvasInformation): number {
        let i = 0;
        for (; i < this.pictures.length; i++) {
            if (canvas.codeID === this.pictures[i].codeID) break;
        }
        return i;
    }*/
    setSlides(): void {
        for (let element of this.pictures) {
            element.imageData = 'data:image/' + element.format + ';base64,' + element.imageData;
            element = element;
        }

        this.showCarousel = true;
    }

    filterdessin(): void {
        this.showLoad = true;

        this.requestService.getSome(this.currentTags).subscribe((response) => {
            console.log(response);
            if (response === undefined) {
                window.alert('Aucune connection avec le server');
                this.close();
                return;
            }

            if (response.status === Httpstatus.StatusCodes.NOT_FOUND) {
                window.alert('Aucun dessin rencontre ces critères');
                this.showLoad = false;
                this.currentTags = '';
                return;
            }

            //this.pictures = response.body | ([] as CanvasInformation[]);
            this.setSlides();

            this.currentSearch = this.currentTags;
            this.showLoad = false;
        });
    }
}
