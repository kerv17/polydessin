import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PopupService } from '@app/services/modal/popup.service';
import { ServerRequestService } from '@app/services/server-request/server-request.service';
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
    constructor(
        private requestService: ServerRequestService,
        public drawingService: DrawingService,
        private router: Router,
        private popupService: PopupService,
    ) {}

    close(): void {
        this.showCarousel = false;
    }

    delete(activeSlides: SlideModel[] | undefined): void {
        if (activeSlides == undefined) {
            return;
        }
        const selectedSlide = activeSlides.length === 1 ? activeSlides[0] : activeSlides[1];

        if (confirm('Voulez-vous supprimez ce dessin')) {
            this.requestService.basicDelete(selectedSlide.id).subscribe(
                (response) => {
                    if (response.body) this.popupService.openPopup(response.body.title);

                    this.removeCanvasInformation(selectedSlide.id);
                    if (this.pictures.length === 0) {
                        this.popupService.openPopup('Il ne reste plus de dessin avec ces critères');
                    }
                },
                (err: HttpErrorResponse) => {
                    this.handleCarouselErrors(err);
                },
            );
        }
    }
    // alterne la position du dernier et celui a enlever et ensuite fait simplement un pop
    private removeCanvasInformation(codeID: string): void {
        for (let i = 0; i < this.pictures.length; i++) {
            if (this.pictures[i].codeID === codeID) {
                this.pictures[i] = this.pictures[this.pictures.length - 1];
                this.pictures.pop();
            }
        }
    }
    loadCanvas(info: CanvasInformation): boolean {
        if (this.router.url.includes('/editor')) {
            if (this.drawingService.loadOldCanvas(info)) {
                this.close();
                return true;
            }
        } else {
            this.router.navigate(['/editor']);
            this.loadImage = true;
            this.imageToLoad = info;
        }
        return false;
    }
    initialiserCarousel(): void {
        this.currentTags = '';
        this.currentSearch = '';

        this.requestService.basicGet().subscribe(
            (response: HttpResponse<CanvasInformation[]>) => {
                this.getImages(response);
            },
            (err: HttpErrorResponse) => {
                this.handleCarouselErrors(err);
                this.close();
            },
        );
    }

    private setSlides(): void {
        for (const element of this.pictures) {
            element.imageData = 'data:image/' + element.format + ';base64,' + element.imageData;
        }

        this.showCarousel = true;
    }

    filterDrawing(): void {
        this.showLoad = true;

        this.requestService.getSome(this.currentTags).subscribe(
            (response: HttpResponse<CanvasInformation[]>) => {
                this.getImages(response);
                this.currentSearch = this.currentTags;
                this.showLoad = false;
            },
            (err: HttpErrorResponse) => {
                this.handleCarouselErrors(err);
                this.showLoad = false;
                this.currentTags = '';
            },
        );
    }
    private getImages(response: HttpResponse<CanvasInformation[]>): void {
        if (response.body != null) {
            this.pictures = response.body;
            this.setSlides();
        }
    }
    private handleCarouselErrors(err: HttpErrorResponse): void {
        if (err.status === Httpstatus.StatusCodes.NOT_FOUND) {
            this.popupService.openPopup(err.error);
        } else if (err.status === 0) {
            this.popupService.openPopup('Aucune connection avec le serveur');
            this.close();
        }
    }
}
