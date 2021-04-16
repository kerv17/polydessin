import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PopupService {
    showModal: boolean = false;
    popupText: string = 'test';

    close(): void {
        this.showModal = false;
    }
    openPopup(message: string): void {
        this.popupText = message;
        this.showModal = true;
    }
}
