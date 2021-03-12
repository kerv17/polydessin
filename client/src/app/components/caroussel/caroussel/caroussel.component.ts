import { Component, HostListener, ViewChild } from '@angular/core';
import { CarouselService } from '@app/services/Carousel/carousel.service';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-caroussel',
    templateUrl: './caroussel.component.html',
    styleUrls: ['./caroussel.component.scss'],
})
export class CarousselComponent {
    constructor(public carouselService: CarouselService) {}
    @ViewChild('owlCar') owlCar: CarouselComponent;
    slides = [
        '../../../SavedCanvas/dessin1.jpeg',
        '../../../SavedCanvas/dessin2.jpeg',
        '../../../SavedCanvas/dessin3.jpeg',
        '../../../SavedCanvas/dessin4.jpeg',
        '../../../SavedCanvas/dessin5.jpeg',
    ];

    customOptions: OwlOptions = {
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
        center: this.slides.length % 2 == 0 ? false : true,
        items: this.slides.length >= 3 ? 3 : this.slides.length,
        autoWidth: false,

        nav: true,
    };
    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'ArrowRight') {
            this.owlCar.next();
        } else if (event.key === 'ArrowLeft') this.owlCar.prev();
    }
    delete(): void {}
}
