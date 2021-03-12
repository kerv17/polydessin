import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import * as Globals from '@app/Constants/constants';
import { CarouselService } from '@app/services/Carousel/carousel.service';
import { IndexService } from '@app/services/index/index.service';
import { Message } from '@common/communication/message';
import { BehaviorSubject } from 'rxjs';
@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'LOG2990';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');

    constructor(private basicService: IndexService, private router: Router, public carouselSerivce: CarouselService) {}

    sendTimeToServer(): void {
        const newTimeMessage: Message = {
            title: 'Hello from the client',
            body: 'Time is : ' + new Date().toString(),
        };
        // Important de ne pas oublier "subscribe" ou l'appel ne sera jamais lancé puisque personne l'observe
        this.basicService.basicPost(newTimeMessage).subscribe();
    }

    goToEditor(): void {
        this.router.navigate(['/editor']);
    }

    verifDessinExistant(): boolean {
        return false;
    }
    @HostListener('window:keydown', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key === Globals.CAROUSEL_SHORTCUT) {
            event.preventDefault();
            this.carouselSerivce.openCarousel();
        }
    }
}
