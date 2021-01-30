import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material/slider/slider';
import { WidthSliderComponent } from './width-slider.component';

fdescribe('WidthSliderComponent', () => {
    let component: WidthSliderComponent;
    let fixture: ComponentFixture<WidthSliderComponent>;
    let matSliderChange: MatSliderChange;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [WidthSliderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WidthSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        matSliderChange = {
            value: 12,
        } as MatSliderChange;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('width slider verifier', () => {
        component.getSliderValue(matSliderChange);
        expect(component.width).toEqual(matSliderChange.value || 1);
    });

    it('verifying if the form shows the right value after the slider is change', () => {
        component.getSliderValue(matSliderChange);
        expect(parseInt((<HTMLInputElement>document.getElementById('width')).value)).toEqual(matSliderChange.value || 1);
    });

    it('veryfying that form sets a new width', () => {
        //On doit faire comme si le form contenait une nouvelle valeur
        (<HTMLInputElement>document.getElementById('width')).value = String(matSliderChange.value) || '1';
        component.setWidth();
        expect(component.width).toEqual(matSliderChange.value || 1);
    });

    it('verifying that the slider is updated after the form changes', () => {
        //On set le slider a 12 pis on change ensuite le form pour voir si ca
        //change le width qui va ensuite etre appliqué automatiquement au slider dans le html
        //en utilisant [ngmodel]
        component.getSliderValue(matSliderChange);
        (<HTMLInputElement>document.getElementById('width')).value = '2';
        component.setWidth();
        expect(component.width).toEqual(2);
    });
    it(' Dans le cas ou matsliderchange est null pour le slider', () => {
        matSliderChange.value = null;
        component.getSliderValue(matSliderChange);
        expect(component.width).toEqual(1);
        expect(parseInt(sessionStorage.getItem('width') || '0')).toEqual(1);
    });
});
