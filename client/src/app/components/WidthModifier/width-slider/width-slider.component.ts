import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';

@Component({
    selector: 'app-width-slider',
    templateUrl: './width-slider.component.html',
    styleUrls: ['./width-slider.component.scss'],
})
export class WidthSliderComponent implements OnInit {
    constructor() {}
    getSliderValue(evt: MatSliderChange) {
        sessionStorage.setItem('width', String(evt.value) || '1');
    }

    ngOnInit(): void {}
}
