import { Injectable } from '@angular/core';
import {
    DEFAULT_COLOR,
    MAX_OPACITY,
    MAX_RGB_VALUE,
    MAX_SIZE_RECENT_COLORS,
    PRIMARY_COLOR,
    RGB_STRING_VALUE_POSITION,
    SECONDARY_COLOR,
} from '@app/Constants/constants';

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    primaryColor: string = DEFAULT_COLOR;
    secondaryColor: string = DEFAULT_COLOR;
    currentColor: string;
    modalVisibility: boolean = false;
    recentColors: string[] = [];

    isHexadecimal(value: string): boolean {
        const num: number = parseInt(value, 16);
        return num >= 0 && num <= MAX_RGB_VALUE;
    }

    saveColor(color: string): void {
        if (this.recentColors.length < MAX_SIZE_RECENT_COLORS) {
            this.recentColors.push(color);
        } else {
            this.recentColors.shift();
            this.recentColors.push(color);
        }
    }

    selectedColor(): string {
        if (this.currentColor === PRIMARY_COLOR) {
            return this.primaryColor;
        } else if (this.currentColor === SECONDARY_COLOR) {
            return this.secondaryColor;
        }
        return '';
    }

    confirmColorSelection(color: string): void {
        if (this.currentColor === PRIMARY_COLOR) {
            if (color !== this.primaryColor) {
                if (this.rgbaToRgb(color) !== this.rgbaToRgb(this.primaryColor)) {
                    this.saveColor(this.primaryColor);
                }
                this.primaryColor = color;
            }
        } else if (this.currentColor === SECONDARY_COLOR) {
            if (color !== this.secondaryColor) {
                if (this.rgbaToRgb(color) !== this.rgbaToRgb(this.secondaryColor)) {
                    this.saveColor(this.secondaryColor);
                }
                this.secondaryColor = color;
            }
        }
    }

    readRGBValues(color: string): string[] {
        if (color !== '' && color !== undefined) {
            const subColor: string = color.substring(RGB_STRING_VALUE_POSITION, color.length - 1);
            return subColor.split(',');
        }
        return ['00', '00', '00', '1'];
    }

    verifyOpacityInput(opacity: string): string {
        return opacity !== '' && parseFloat(opacity) <= MAX_OPACITY ? (parseInt(opacity, 10) / 100).toString() : '1';
    }

    resetColorValues(): void {
        this.recentColors = [];
        this.primaryColor = DEFAULT_COLOR;
        this.secondaryColor = DEFAULT_COLOR;
        this.modalVisibility = false;
    }

    rgbaToRgb(color: string): string {
        const values = this.readRGBValues(color);
        return 'rgb(' + values[0] + ',' + values[1] + ',' + values[2] + ')';
    }
}
