import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorSliderComponent } from './color-slider.component';

describe('ColorSliderComponent', () => {
    let component: ColorSliderComponent;
    let fixture: ComponentFixture<ColorSliderComponent>;
    let mouseEvent: MouseEvent;
    let drawSpy: jasmine.Spy;
    let emitColorSpy: jasmine.Spy;
    let getColorSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorSliderComponent],
        }).compileComponents();

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' MouseUp shoud set MouseDown to false when palette is unclicked', () => {
        const expectedValue = false;
        component.onMouseUp(mouseEvent);
        expect(component.mousedown).toEqual(expectedValue);
    });

    it(' MouseDown sets mouseDown to true when palette is clicked', () => {
        const expectedValue = true;
        component.onMouseDown(mouseEvent);
        expect(component.mousedown).toEqual(expectedValue);
    });

    it(' MouseDown sets selectedHeigth to offset values when palette is clicked', () => {
        const expectedValue: number = mouseEvent.offsetY;
        component.onMouseDown(mouseEvent);
        expect(component.selectedHeight).toEqual(expectedValue);
    });

    it(' MouseDown calls draw function when palette is clicked', () => {
        drawSpy = spyOn(component, 'draw');
        component.onMouseDown(mouseEvent);
        expect(drawSpy).toHaveBeenCalled();
    });

    it(' MouseDown calls getColorAtPosition function when palette is clicked', () => {
        getColorSpy = spyOn(component, 'getColorAtPosition');
        component.onMouseDown(mouseEvent);
        expect(getColorSpy).toHaveBeenCalled();
    });

    it(' MouseDown calls emitColor function when palette is clicked', () => {
        emitColorSpy = spyOn(component, 'emitColor');
        component.onMouseDown(mouseEvent);
        expect(emitColorSpy).toHaveBeenCalled();
    });

    it(' MouseMove sets selectedHeight to offset values if MouseDown is true', () => {
        component.mousedown = true;
        const expectedValue: number = mouseEvent.offsetY;
        component.onMouseMove(mouseEvent);
        expect(component.selectedHeight).toEqual(expectedValue);
    });

    it(' MouseMove calls draw function if MouseDown is true', () => {
        component.mousedown = true;
        drawSpy = spyOn(component, 'draw');
        component.onMouseMove(mouseEvent);
        expect(drawSpy).toHaveBeenCalled();
    });

    it(' MouseMove calls emitColor function if MouseDown is true', () => {
        component.mousedown = true;
        emitColorSpy = spyOn(component, 'emitColor');
        component.onMouseMove(mouseEvent);
        expect(emitColorSpy).toHaveBeenCalled();
    });

    it(" MouseMove doesn't sets selectedHeight to offset values if MouseDown is false", () => {
        component.mousedown = false;
        const expectedValue: number = mouseEvent.offsetY;
        component.onMouseMove(mouseEvent);
        expect(component.selectedHeight).not.toEqual(expectedValue);
    });

    it(" MouseMove doesn't call draw function if MouseDown is false", () => {
        component.mousedown = false;
        drawSpy = spyOn(component, 'draw');
        component.onMouseMove(mouseEvent);
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it(" MouseMove doesn't call emitColor function if MouseDown is false", () => {
        component.mousedown = false;
        emitColorSpy = spyOn(component, 'emitColor');
        component.onMouseMove(mouseEvent);
        expect(emitColorSpy).not.toHaveBeenCalled();
    });

    it(' emitColor calls getColorAtPosition ', () => {
        getColorSpy = spyOn(component, 'getColorAtPosition');
        component.emitColor(mouseEvent.offsetX, mouseEvent.offsetY);
        expect(getColorSpy).toHaveBeenCalled();
    });

    it(' getColorAtPosition returns correct rgba string ', () => {
        component.draw();
        const x = 5;
        const y = 5;
        const imageData = component.ctx.getImageData(x, y, 1, 1).data;
        const expectedResult: string = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
        expect(component.getColorAtPosition(x, y)).toEqual(expectedResult);
    });
});
