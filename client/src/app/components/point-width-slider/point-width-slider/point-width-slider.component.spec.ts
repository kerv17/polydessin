import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointWidthSliderComponent } from './point-width-slider.component';

describe('PointWidthSliderComponent', () => {
    let component: PointWidthSliderComponent;
    let fixture: ComponentFixture<PointWidthSliderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PointWidthSliderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PointWidthSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
