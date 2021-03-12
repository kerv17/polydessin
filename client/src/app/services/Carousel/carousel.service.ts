import { Injectable } from '@angular/core';
import { IndexService } from '@app/services/index/index.service';
@Injectable({
    providedIn: 'root',
})
export class CarouselService {
    showCarousel: boolean = false;
    constructor(private indexService: IndexService) {}
    openCarousel(): void {
        this.showCarousel = true;
    }
    close(): void {
        this.showCarousel = false;
    }
    test(test: string): void {
        window.alert(test);
    }

    delete(): void {
        this.indexService.basicDelete('test');
    }
}
