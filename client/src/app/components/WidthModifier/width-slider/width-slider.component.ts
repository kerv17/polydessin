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
        sessionStorage.setItem('width', String(evt.value) || '1');
        this.width = evt.value || 4;
        this.updateWidth();
    }
    ngAfterViewInit(): void {
        this.updateWidth();
    }
    updateWidth() {
        (<HTMLInputElement>document.getElementById('width')).value = this.width.toString();
        this.updateSlider();
    }
    updateSlider() {}
    setWidth() {
        let placeholder: string = (<HTMLInputElement>document.getElementById('width')).value;
        this.width = parseInt(placeholder);
        sessionStorage.setItem('width', String(this.width) || '1');
        //window.alert(this.width);
        this.updateWidth();
    }
    ngOnInit(): void {}
}
