import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprayAmountSliderComponent } from './spray-amount-slider.component';

describe('SprayAmountSliderComponent', () => {
    let component: SprayAmountSliderComponent;
    let fixture: ComponentFixture<SprayAmountSliderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SprayAmountSliderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SprayAmountSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
