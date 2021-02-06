import { AfterViewInit, Component } from '@angular/core';
import { ColorService } from '@app/services/color/color.service';

@Component({
    selector: 'app-color',
    templateUrl: './color.component.html',
    styleUrls: ['./color.component.scss'],
})
export class ColorComponent implements AfterViewInit {
    primaryColor: string;
    secondaryColor: string;
    visibility: boolean;
    recentColors: string[] = new Array();

    constructor(private colorService: ColorService) {}

    ngAfterViewInit(): void {
        this.updateColor();
        this.visibility = this.colorService.modalVisibility;
        this.recentColors = this.colorService.recentColors;
    }

    invert(): void {
        const tempColor: string = this.primaryColor;
        this.primaryColor = this.secondaryColor;
        this.secondaryColor = tempColor;

        this.colorService.primaryColor = this.primaryColor;
        this.colorService.secondaryColor = this.secondaryColor;
    }

    openModal(color: string): void {
        this.colorService.modalVisibility = true;
        this.colorService.currentColor = color;
        this.visibility = this.colorService.modalVisibility;
    }

    closeModal(): void {
        this.visibility = false;
    }

    updateColor(): void {
        this.primaryColor = this.colorService.primaryColor;
        this.secondaryColor = this.colorService.secondaryColor;
    }

    selectPrimaryColor(color: string): void {
        this.colorService.saveColor(this.primaryColor);
        this.primaryColor = color;
        this.colorService.primaryColor = this.primaryColor;
    }

    selectSecondaryColor(color: string, event: MouseEvent): boolean {
        this.colorService.saveColor(this.secondaryColor);
        this.secondaryColor = color;
        this.colorService.secondaryColor = this.secondaryColor;
        return false;
    }
    /*
    updateOpacityPrimary(): void {
        let opacity: string = this.OP;
        if (parseFloat(opacity) > maxOpacity) {
            opacity = '1';
            this.OP = '100';
        } else {
            opacity = (parseFloat(opacity) / 100.0).toString();
        }
        const subColor: string = this.primaryColor.substring(rgbValueStart, this.primaryColor.length - 1);
        const splitColor: string[] = subColor.split(',');
        this.primaryColor = 'rgba(' + splitColor[0] + ',' + splitColor[1] + ',' + splitColor[2] + ',' + opacity + ')';
        this.colorService.primaryColor = this.primaryColor;
    }

    updateOpacitySecondary(): void {
        let opacity: string = this.OS;
        if (parseFloat(opacity) > maxOpacity) {
            opacity = '1';
            this.OS = '100';
        } else {
            opacity = (parseFloat(opacity) / 100.0).toString();
        }
        const subColor: string = this.secondaryColor.substring(rgbValueStart, this.secondaryColor.length - 1);
        const splitColor: string[] = subColor.split(',');
        this.secondaryColor = 'rgba(' + splitColor[0] + ',' + splitColor[1] + ',' + splitColor[2] + ',' + opacity + ')';
        this.colorService.secondaryColor = this.secondaryColor;
    }

    setOpacityValue(): void {
        const subColorP: string = this.primaryColor.substring(rgbValueStart, this.primaryColor.length - 1);
        const splitColorP: string[] = subColorP.split(',');
        this.OP = (parseFloat(splitColorP[3]) * 100).toString();

        const subColorS: string = this.secondaryColor.substring(rgbValueStart, this.secondaryColor.length - 1);
        const splitColorS: string[] = subColorS.split(',');
        this.OS = (parseFloat(splitColorS[3]) * 100).toString();
    }*/
}
