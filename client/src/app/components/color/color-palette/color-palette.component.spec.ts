import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorPaletteComponent } from './color-palette.component';


describe('ColorPaletteComponent', () => {
  let component: ColorPaletteComponent;
  let fixture: ComponentFixture<ColorPaletteComponent>;
  let mouseEvent: MouseEvent;
  let drawSpy: jasmine.Spy<any>;
  let emitColorSpy: jasmine.Spy<any>;
  let getColorSpy: jasmine.Spy<any>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ColorPaletteComponent]
    })
      .compileComponents();

    mouseEvent = {
      offsetX: 25,
      offsetY: 25,
      button: 0,
    } as MouseEvent;

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(' ngOnChanges calls draw function if hue changed ', () => {
    component.hue = 'rgba(23,fc,a4,1)';
    drawSpy = spyOn<any>(component, 'draw');

    //directly call ngOnChanges
    component.ngOnChanges({
      hue: new SimpleChange(null, component.hue, true)
    });
    fixture.detectChanges();

    expect(drawSpy).toHaveBeenCalled();
  });

  it(' ngOnChanges does not call draw function if hue did not change ', () => {
    drawSpy = spyOn<any>(component, 'draw');


    component.ngOnChanges({
    });
    fixture.detectChanges();

    expect(drawSpy).not.toHaveBeenCalled();
  });

  it(' ngOnChanges calls emit color if position != 0', () => {
    emitColorSpy = spyOn<any>(component, 'emitColor');
    component.onMouseDown(mouseEvent);
    component.hue = 'rgba(23,fc,a4,1)';

    component.ngOnChanges({
      hue: new SimpleChange(null, component.hue, true)
    });
    fixture.detectChanges();

    expect(emitColorSpy).toHaveBeenCalled();
  });

  it(' ngOnChanges does not call emit color if position == 0', () => {
    emitColorSpy = spyOn<any>(component, 'emitColor');
    component.hue = 'rgba(23,fc,a4,1)';

    component.ngOnChanges({
      hue: new SimpleChange(null, component.hue, true)
    });
    fixture.detectChanges();

    expect(emitColorSpy).not.toHaveBeenCalled();
  });

  it(' MouseUp shoud set MouseDown to false when palette is unclicked', () => {
    const expectedValue: boolean = false;
    component.onMouseUp(mouseEvent);
    expect(component.mousedown).toEqual(expectedValue);
  });

  it(' MouseDown sets mouseDown to true when palette is clicked', () => {
    const expectedValue: boolean = true;
    component.onMouseDown(mouseEvent);
    expect(component.mousedown).toEqual(expectedValue);
  });

  it(' MouseDown sets selectedPosition to offset values when palette is clicked', () => {
    const expectedValue: { x: number; y: number } = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
    component.onMouseDown(mouseEvent);
    expect(component.selectedPosition).toEqual(expectedValue);
  });

  it(' MouseDown calls draw function when palette is clicked', () => {
    drawSpy = spyOn<any>(component, 'draw');
    component.onMouseDown(mouseEvent);
    expect(drawSpy).toHaveBeenCalled();
  });

  it(' MouseDown calls getColorAtPosition function when palette is clicked', () => {
    getColorSpy = spyOn<any>(component, 'getColorAtPosition');
    component.onMouseDown(mouseEvent);
    expect(getColorSpy).toHaveBeenCalled();
  });

  it(' MouseDown calls emitColor function when palette is clicked', () => {
    emitColorSpy = spyOn<any>(component, 'emitColor');
    component.onMouseDown(mouseEvent);
    expect(emitColorSpy).toHaveBeenCalled();
  });

  it(' MouseMove sets selectedPosition to offset values if MouseDown is true', () => {
    component.mousedown = true;
    const expectedValue: { x: number; y: number } = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
    component.onMouseMove(mouseEvent);
    expect(component.selectedPosition).toEqual(expectedValue);
  });

  it(' MouseMove calls draw function if MouseDown is true', () => {
    component.mousedown = true;
    drawSpy = spyOn<any>(component, 'draw');
    component.onMouseMove(mouseEvent);
    expect(drawSpy).toHaveBeenCalled();
  });

  it(' MouseMove calls emitColor function if MouseDown is true', () => {
    component.mousedown = true;
    emitColorSpy = spyOn<any>(component, 'emitColor');
    component.onMouseMove(mouseEvent);
    expect(emitColorSpy).toHaveBeenCalled();
  });

  it(' MouseMove doesn\'t sets selectedPosition to offset values if MouseDown is false', () => {
    component.mousedown = false;
    const expectedValue: { x: number; y: number } = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
    component.onMouseMove(mouseEvent);
    expect(component.selectedPosition).not.toEqual(expectedValue);
  });

  it(' MouseMove doesn\'t call draw function if MouseDown is false', () => {
    component.mousedown = false;
    drawSpy = spyOn<any>(component, 'draw');
    component.onMouseMove(mouseEvent);
    expect(drawSpy).not.toHaveBeenCalled();
  });

  it(' MouseMove doesn\'t call emitColor function if MouseDown is false', () => {
    component.mousedown = false;
    emitColorSpy = spyOn<any>(component, 'emitColor');
    component.onMouseMove(mouseEvent);
    expect(emitColorSpy).not.toHaveBeenCalled();
  });

  it(' emitColor calls getColorAtPosition ', () => {
    getColorSpy = spyOn<any>(component, 'getColorAtPosition');
    component.emitColor(5, 5);
    expect(getColorSpy).toHaveBeenCalled();
  });

  it(' getColorAtPosition returns correct rgba string ', () => {
    component.draw();
    const x: number = 5;
    const y: number = 5;
    const imageData = component.ctx.getImageData(x, y, 1, 1).data;
    const expectedResult: string = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    expect(component.getColorAtPosition(x, y)).toEqual(expectedResult);
  });

});
