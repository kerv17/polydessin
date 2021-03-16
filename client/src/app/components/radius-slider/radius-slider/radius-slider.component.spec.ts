import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiusSliderComponent } from './radius-slider.component';

describe('RadiusSliderComponent', () => {
    let component: RadiusSliderComponent;
    let fixture: ComponentFixture<RadiusSliderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RadiusSliderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RadiusSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
