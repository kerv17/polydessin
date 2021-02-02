import { Injectable } from '@angular/core';

// à mettre dans un fichier de constantes
const maxSize = 10;
const maxDecimal = 255;
const maxSingleDigit = 9;

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    primaryColor: string = 'rgba(0,0,0,1)';
    secondaryColor: string = 'rgba(0,0,0,1)';
    currentColor: string;
    modalVisibility: boolean;
    recentColors: string[] = new Array();

    constructor() {
        this.modalVisibility = false;
    }

    isHexadecimal(value: string): boolean {
        if (value.length === 2) {
            const num: number = parseInt(value, 16);
            if (num >= maxSize && num <= maxDecimal) {
                return true;
            }
        } else if (value.length === 1) {
            const num: number = parseInt(value, 16);
            if (num >= 0 && num <= maxSingleDigit) {
                return true;
            }
        }
        return false;
    }

    saveColor(color: string): void {
        if (this.recentColors.length < maxSize) {
            this.recentColors.push(color);
        } else {
            this.recentColors.shift();
            this.recentColors.push(color);
        }
    }
}
