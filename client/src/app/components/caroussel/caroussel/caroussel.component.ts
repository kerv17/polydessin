import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import * as Globals from '@app/Constants/constants';
import { CarouselService } from '@app/services/carousel/carousel.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { CanvasInformation } from '@common/communication/canvas-information';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
const NUMBER_OF_IMAGES = 3;

@Component({
    selector: 'app-caroussel',
    templateUrl: './caroussel.component.html',
    styleUrls: ['./caroussel.component.scss'],
})
export class CarousselComponent implements AfterViewInit {
    @ViewChild('owlCar') owlCar: CarouselComponent;
    customOptions: OwlOptions;
    constructor(public carouselService: CarouselService, private toolController: ToolControllerService) {
        this.resetOptions();
    }

    resetOptions(): void {
        // J'attribue les options de mon owl-carousel-o
        // Le lien vers le repo github de ce carousel est:
        // https://github.com/vitalii-andriiovskyi/ngx-owl-carousel-o
        this.customOptions = {
            loop: true,
            mouseDrag: true,

            merge: true,
            touchDrag: true,

            pullDrag: true,
            margin: 20,

            dots: false,
            navSpeed: 600,

            center: true,
            items: this.carouselService.pictures.length >= NUMBER_OF_IMAGES ? NUMBER_OF_IMAGES : this.carouselService.pictures.length,
            autoWidth: false,

            // Cette petite partie  fait en sorte que le carousel s'adapate quand ca change de taille
            // J'ai du le mettre sinon parfois il y a des espaces qui se crée
            responsive: {
                0: { items: this.carouselService.pictures.length >= NUMBER_OF_IMAGES ? NUMBER_OF_IMAGES : this.carouselService.pictures.length },
                400: { items: this.carouselService.pictures.length >= NUMBER_OF_IMAGES ? NUMBER_OF_IMAGES : this.carouselService.pictures.length },
                740: { items: this.carouselService.pictures.length >= NUMBER_OF_IMAGES ? NUMBER_OF_IMAGES : this.carouselService.pictures.length },
                960: { items: this.carouselService.pictures.length >= NUMBER_OF_IMAGES ? NUMBER_OF_IMAGES : this.carouselService.pictures.length },
            },
            // I disactivate the provided nav because it doesnt work if the number of items is equal to amount of images
            nav: false,
        };
    }

    ngAfterViewInit(): void {
        this.resetOptions();
    }
    loadCarouselImage(slide: CanvasInformation): void {
        const isInEditor = this.carouselService.loadCanvas(slide);
        if (this.carouselService.drawingService.baseCanvas != undefined) {
            if (isInEditor) {
                this.toolController.lineService.clearPath();
                this.toolController.lassoService.clearPath();
            }
        }
    }
    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.key === Globals.RIGHT_ARROW_SHORTCUT) {
            // cette méthode change le slide courant vers la droite
            this.owlCar.next();
        } else if (event.key === Globals.LEFT_ARROW_SHORTCUT) this.owlCar.prev();
        // cette méthode change le slide courant vers la gauche
    }
}
