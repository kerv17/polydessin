import { Component, Input, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';

@Component({
    selector: 'app-width-slider',
    templateUrl: './width-slider.component.html',
    styleUrls: ['./width-slider.component.scss'],
})
export class WidthSliderComponent implements OnInit {
    @Input() width: number = 1;
    constructor() {}
    getSliderValue(evt: MatSliderChange) {
        sessionStorage.setItem('width', String(evt.value));
        this.width = evt.value || 1;
        this.updateWidth();
    }
    ngAfterViewInit(): void {
        this.updateWidth();
    }
    updateWidth() {
        (<HTMLInputElement>document.getElementById('width')).value = this.width.toString();
    }

    setWidth() {
        let placeholder: string = (<HTMLInputElement>document.getElementById('width')).value;
        let verifier = parseInt(placeholder);

        this.width = verifier;
        sessionStorage.setItem('width', String(this.width));

        //window.alert(this.width);
    }
    ngOnInit(): void {}
}
