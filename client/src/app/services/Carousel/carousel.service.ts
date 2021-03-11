import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CarouselService {
    showCarousel: boolean = false;
    constructor() {}
    openCarousel(): void {
        this.showCarousel = true;
    }
    close(): void {
        this.showCarousel = false;
    }
    test(test: string): void {
        window.alert(test);
    }
}
