import { Injectable } from '@angular/core';

// à mettre dans un fichier de constantes
const maxSize = 10;
const maxDecimal = 255;
const rgbValueStart = 5;
const maxOpacity = 100;

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
        const num: number = parseInt(value, 16);
        if (num >= 0 && num <= maxDecimal) {
            return true;
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

    selectedColor(): string {
        if (this.currentColor === 'Primary') {
            return this.primaryColor;
        } else if (this.currentColor === 'Secondary') {
            return this.secondaryColor;
        }
        return '';
    }

    confirmColorSelection(color: string): void {
        if (this.currentColor === 'Primary') {
            if (color !== this.primaryColor) {
                this.saveColor(this.primaryColor);
                this.primaryColor = color;
            }
        } else if (this.currentColor === 'Secondary') {
            if (color !== this.secondaryColor) {
                this.saveColor(this.secondaryColor);
                this.secondaryColor = color;
            }
        }
    }

    readRGBValues(color: string): string[] {
        if (color !== '' && color !== undefined) {
            const subColor: string = color.substring(rgbValueStart, color.length - 1);
            return subColor.split(',');
        }
        return ['00', '00', '00', '1'];
    }

    verifyOpacityInput(opacity: string): string {
        if (parseFloat(opacity) > maxOpacity) {
            window.alert('La valeur fournie est invalide! Veuillez entrez une valeur entre 0 et 100.');
            return '1';
        } else {
            return (parseInt(opacity, 10) / 100).toString();
        }
    }
}
