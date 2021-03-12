import { Injectable } from '@angular/core';
import { Metadata } from '@app/Constants/constants';
import { IndexService } from '@app/services/index/index.service';
@Injectable({
    providedIn: 'root',
})
export class CarouselService {
    showCarousel: boolean = false;
    private pictures: Metadata[] = [];
    constructor(private indexService: IndexService) {}
    openCarousel(): void {
        this.showCarousel = true;
    }
    close(): void {
        this.showCarousel = false;
    }
    test(test: string): void {
        // window.alert(test);
    }

    delete(): void {
        this.initialiserCanvas();
        // this.indexService.basicDelete('test').subscribe((x) => window.alert(x.title));
    }
    initialiserCanvas(): void {
        this.indexService.basicGet().subscribe((x) => {
            this.pictures = new Array(x.length);
            console.log(x);
            let i = 0;
            for (const element of x) {
                this.pictures[i] = element;

                i++;
            }
            console.log(this.pictures[0]);
        });
    }
}
