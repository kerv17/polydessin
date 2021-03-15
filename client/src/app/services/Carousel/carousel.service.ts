import { Injectable } from '@angular/core';
import { IndexService } from '@app/services/index/index.service';
import { CanvasInformation } from '@common/communication/canvas-information';
@Injectable({
    providedIn: 'root',
})
export class CarouselService {
    showCarousel: boolean = false;
    pictures: CanvasInformation[] = [];
    slides: string[];
    constructor(private indexService: IndexService) {
        window.alert('test');
    }

    close(): void {
        this.showCarousel = false;
    }
    test(test: string): void {
        window.alert(test);
    }

    delete(): void {
        this.indexService.basicDelete('test').subscribe((x) => window.alert(x.title));
    }
    initialiserCarousel(): void {
        this.showCarousel = true;
        this.indexService.basicGet().subscribe((x) => {
            this.pictures = new Array(x.length);

            console.log(x);

            this.pictures = x;
            this.setSlides();
        });
    }

    setSlides(): void {
        console.log('test');
        this.pictures[0] = {} as CanvasInformation;

        let i = 0;
        this.slides = new Array(this.pictures.length);
        for (let element of this.pictures) {
            this.slides[i] = 'data:image/png;base64,' + element.imageData;
            element = element;
            i++;
        }
    }
}
