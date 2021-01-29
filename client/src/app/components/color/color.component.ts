import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-color',
    templateUrl: './color.component.html',
    styleUrls: ['./color.component.scss'],
})
export class ColorComponent implements OnInit {
    public hue: string;
    public color: string;

    constructor() {}

    ngOnInit(): void {}
}
