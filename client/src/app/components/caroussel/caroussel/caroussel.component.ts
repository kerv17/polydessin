import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
declare let $: any;

@Component({
    selector: 'app-caroussel',
    templateUrl: './caroussel.component.html',
    styleUrls: ['./caroussel.component.scss'],
})
export class CarousselComponent {
    slides = [
        { image: '../../assets/b151576e-c5cd-4703-bac1-3ae2462d7d16.png' },
        { image: '../../../assets/b151576e-c5cd-4703-bac1-3ae2462d7d16.png' },
        { image: '../../../assets/b151576e-c5cd-4703-bac1-3ae2462d7d16.png' },
        { image: 'https://via.placeholder.com/800/5342ac' },
        { image: 'https://via.placeholder.com/800/5342ac' },
    ];
    dynamicSlides = [
        {
            id: 1,
            src: 'https://via.placeholder.com/800/842acf',
            alt: 'Side 1',
            title: 'Side 1',
        },
        {
            id: 2,
            src: 'https://via.placeholder.com/800/842acf',
            alt: 'Side 2',
            title: 'Side 2',
        },
        {
            id: 3,
            src: 'https://via.placeholder.com/800/842acf',
            alt: 'Side 3',
            title: 'Side 3',
        },
        {
            id: 4,
            src: 'https://via.placeholder.com/800/d32776',
            alt: 'Side 4',
            title: 'Side 4',
        },
        {
            id: 5,
            src: 'https://via.placeholder.com/800/d32776',
            alt: 'Side 5',
            title: 'Side 5',
        },
    ];
    customOptions: OwlOptions = {
        loop: true,
        mouseDrag: false,
        merge: true,
        touchDrag: true,
        margin: 10,
        pullDrag: false,
        dots: true,
        navSpeed: 600,
        navText: ['&#8249', '&#8250;'],
        center: true,
        items: 3,
        autoWidth: true,
        nav: true,
    };
}
