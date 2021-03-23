import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import * as Globals from '@app/Constants/constants';
import { CarouselService } from '@app/services/Carousel/carousel.service';
import { BehaviorSubject } from 'rxjs';
@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'LOG2990';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');

    constructor(private router: Router, public carouselService: CarouselService) {}

    goToEditor(): void {
        this.router.navigate(['/editor']);
    }
    openCarousel(): void {
        this.carouselService.initialiserCarousel();
    }

    verifDessinExistant(): boolean {
        return false;
    }
    @HostListener('window:keydown', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key === Globals.CAROUSEL_SHORTCUT) {
            event.preventDefault();
            this.openCarousel();
        }
    }
}
