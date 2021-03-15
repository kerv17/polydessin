import { Component, HostListener, ViewChild } from '@angular/core';
import { CarouselService } from '@app/services/Carousel/carousel.service';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
const nombreImage = 3;
const nombreImagePair = 2;
@Component({
    selector: 'app-caroussel',
    templateUrl: './caroussel.component.html',
    styleUrls: ['./caroussel.component.scss'],
})
export class CarousselComponent {
    currentTag: string;
    fileName: string;
    constructor(public carouselService: CarouselService) {
        this.resetOptions();
    }
    customOptions: OwlOptions;
    @ViewChild('owlCar') owlCar: CarouselComponent;
    slides: string[] = [
        '../../../SavedCanvas/dessin1.jpeg',
        '../../../SavedCanvas/dessin2.jpeg',
        '../../../SavedCanvas/dessin3.jpeg',
        '../../../SavedCanvas/dessin4.jpeg',
        '../../../SavedCanvas/dessin5.jpeg',
    ];
    resetOptions(): void {
        this.customOptions = {
            loop: true,
            mouseDrag: true,
            // TODO gèrer les cas ou moins de 2
            merge: true,
            touchDrag: true,

            pullDrag: true,
            margin: 20,

            dots: true,
            navSpeed: 600,
            navText: ['&#8249', '&#8250;'],
            center: this.slides.length % nombreImagePair === 0 ? false : true,
            items: this.slides.length >= nombreImage ? nombreImage : this.slides.length,
            autoWidth: true,

            responsive: { 0: { items: 3 }, 400: { items: 3 }, 740: { items: 3 }, 960: { items: 3 } },
            nav: true,
        };
    }
    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'ArrowRight') {
            // Very useful for when im gonna have to do the update
            this.owlCar.next();
            this.customOptions.responsive = { 0: { items: 1 }, 400: { items: 1 }, 740: { items: 1 }, 960: { items: 1 } };
            this.slides = [];
            // for (let i = 0; i < this.slides.length - 1; i++) {
            //   this.slides.pop();
            // }
            this.slides[0] = '../../../SavedCanvas/dessin1.jpeg';
            this.slides[1] = '../../../SavedCanvas/dessin1.jpeg';

            console.log(this.owlCar.slidesData);
            console.log(this.slides);

            this.customOptions.center = false;
            //  this.resetOptions();
        } else if (event.key === 'ArrowLeft') this.owlCar.prev();
    }
}
