import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { CarouselService } from '@app/services/Carousel/carousel.service';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
const nombreImage = 3;
//const nombreImagePair = 2;
@Component({
    selector: 'app-caroussel',
    templateUrl: './caroussel.component.html',
    styleUrls: ['./caroussel.component.scss'],
})
export class CarousselComponent implements AfterViewInit {
    @ViewChild('owlCar') owlCar: CarouselComponent;
    currentTag: string;

    constructor(public carouselService: CarouselService) {
        this.resetOptions();
    }
    customOptions: OwlOptions;

    resetOptions(): void {
        this.customOptions = {
            loop: true,
            mouseDrag: true,
            // TODO gèrer les cas ou moins de 2
            merge: true,
            touchDrag: true,

            pullDrag: true,
            margin: 20,

            dots: false,
            navSpeed: 600,

            center: true,
            items: this.carouselService.pictures.length >= nombreImage ? nombreImage : 1,
            autoWidth: false,

            responsive: { 0: { items: 3 }, 400: { items: 3 }, 740: { items: 3 }, 960: { items: 3 } },
            // I disactivate the provided nav because it doesnt work if the number of items is equal to amount of images
            nav: false,
        };
    }

    ngAfterViewInit(): void {
        // this.customOptions.responsive = { 0: { items: 1 }, 400: { items: 1 }, 740: { items: 1 }, 960: { items: 1 } };
        this.resetOptions();
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'ArrowRight') {
            // Very useful for when im gonna have to do the update

            this.owlCar.next();
            this.resetOptions();

            // for (let i = 0; i < this.slides.length - 1; i++) {
            //   this.slides.pop();
            // }

            console.log(this.owlCar.slidesData);

            //  this.resetOptions();
        } else if (event.key === 'ArrowLeft') this.owlCar.prev();
    }
}
