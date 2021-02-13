import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { ColorService } from '@app/services/color/color.service';

const MAX_OPACITY = 100;

@Component({
    selector: 'app-color-modal',
    templateUrl: './color-modal.component.html',
    styleUrls: ['./color-modal.component.scss'],
})
export class ColorModalComponent implements AfterViewInit {
    hue: string;
    color: string;
    rValue: string = '0';
    gValue: string = '0';
    bValue: string = '0';
    opacity: string = '100';

    @Output()
    isVisible: EventEmitter<boolean> = new EventEmitter(true);

    @Output()
    colorModified: EventEmitter<string> = new EventEmitter(true);

    constructor(private colorService: ColorService) {}

    ngAfterViewInit(): void {
        this.color = this.colorService.selectedColor();
        this.setColorInputValue();
        if (this.color !== 'rgba(0,0,0,1)') {
            this.hue = this.color;
        }
    }

    confirmColor(): void {
        this.colorService.confirmColorSelection(this.color);
        this.colorModified.emit(this.color);
        this.isVisible.emit(false);
    }

    cancel(): void {
        this.isVisible.emit(false);
    }

    // affiche la valeur rgb de la couleur sélectionnée par la palette de couleur
    setColorInputValue(): void {
        if (this.color !== undefined) {
            const splitColor: string[] = this.colorService.readRGBValues(this.color);
            if (splitColor !== undefined) {
                this.rValue = parseInt(splitColor[0], 10).toString(16);
                this.gValue = parseInt(splitColor[1], 10).toString(16);
                this.bValue = parseInt(splitColor[2], 10).toString(16);
                this.opacity = Math.round(100 * parseFloat(splitColor[3])).toString();
            }
        }
    }

    // met à jour la couleur lorsqu'on entre manuellement des valeurs rgb
    updateColorFromInput(): void {
        if (
            this.colorService.isHexadecimal(this.rValue) &&
            this.colorService.isHexadecimal(this.gValue) &&
            this.colorService.isHexadecimal(this.bValue)
        ) {
            this.color =
                'rgba(' +
                parseInt(this.rValue, 16) +
                ',' +
                parseInt(this.gValue, 16) +
                ',' +
                parseInt(this.bValue, 16) +
                ',' +
                this.colorService.verifyOpacityInput(this.opacity) +
                ')';
            this.hue = this.color;
        }
    }

    // Restreint les caractères pour l'opacité à (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
    omitUnwantedChars(event: KeyboardEvent): boolean {
        const key = event.key.charCodeAt(0);
        return key >= '0'.charCodeAt(0) && key <= '9'.charCodeAt(0);
    }

    // Restreint les caractères pour la couleur à (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, a, b, c, d, e, f)
    omitUnwantedColorValue(event: KeyboardEvent): boolean {
        const key = event.key.charCodeAt(0);
        return (key >= '0'.charCodeAt(0) && key <= '9'.charCodeAt(0)) || (key >= 'a'.charCodeAt(0) && key <= 'f'.charCodeAt(0));
    }

    // empêche l'utilisateur d'entrer une valeur supérieure à 100
    verifyMax(): boolean {
        if (parseFloat(this.opacity) > MAX_OPACITY) {
            this.opacity = '100';
            return false;
        }
        return true;
    }

    // empêche l'input d'opacité d'être vide
    opacityIsNotEmpty(): boolean {
        if (this.opacity.length === 0) {
            this.opacity = '100';
            return false;
        }
        return true;
    }

    // empêche les inputs de couleur d'être vide
    verifyIfEmpty(): void {
        if (this.rValue === '') {
            this.rValue = '00';
        }
        if (this.gValue === '') {
            this.gValue = '00';
        }
        if (this.bValue === '') {
            this.bValue = '00';
        }
        this.updateColorFromInput();
    }
}
