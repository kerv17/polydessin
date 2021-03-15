import { Injectable } from '@angular/core';
import { IndexService } from '@app/services/index/index.service';
import { CanvasInformation } from '@common/communication/canvas-information';
@Injectable({
    providedIn: 'root',
})
export class CarouselService {
    showCarousel: boolean = false;
    pictures: CanvasInformation[] = [];

    constructor(private indexService: IndexService) {}

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
        this.indexService.basicGet().subscribe((x) => {
            this.pictures = new Array(x.length);

            console.log(x);

            this.pictures = x;
            this.setSlides();
        });
    }

    setSlides(): void {
        console.log('test');

        for (let element of this.pictures) {
            element.imageData = 'data:image/png;base64,' + element.imageData;
            element = element;
        }

        this.showCarousel = true;
    }
}
