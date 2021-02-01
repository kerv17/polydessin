import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorService } from '@app/services/color/color.service';
import { ColorModalComponent } from './color-modal.component';


describe('ColorModalComponent', () => {
  let component: ColorModalComponent;
  let fixture: ComponentFixture<ColorModalComponent>;
  let colorService: ColorService;
  let saveSpy: jasmine.Spy<any>;
  let updateSpy: jasmine.Spy<any>;
  let setColorSpy:jasmine.Spy<any>;

  beforeEach(async(() => {
    colorService = new ColorService();
    TestBed.configureTestingModule({
      declarations: [ ColorModalComponent ],
      providers: [
        { provide: ColorService, useValue: colorService },
    ],
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(' confirmColor should update primary color if primary color was modified', () => {
    colorService.currentColor = 'Primary';
    component.color = 'rgba(34,56,78,1)';
    component.confirmColor();
    expect(colorService.primaryColor).toEqual(component.color);
  });

  it(' confirmColor should update secondary color if secondary color was modified', () => {
    colorService.currentColor = 'Secondary';
    component.color = 'rgba(34,56,78,1)';
    component.confirmColor();
    expect(colorService.secondaryColor).toEqual(component.color);
  });

  it(' confirmColor should call saveColor if primaryColor was modified', () => {
    saveSpy = spyOn<any>(colorService, 'saveColor');
    colorService.currentColor = 'Primary';
    component.color = 'rgba(34,56,78,1)';
    colorService.primaryColor = 'rgba(00,00,00,1)';
    component.confirmColor();
    expect(saveSpy).toHaveBeenCalled();
  });

  it(' confirmColor should call saveColor if secondaryColor was modified', () => {
    saveSpy = spyOn<any>(colorService, 'saveColor');
    colorService.currentColor = 'Secondary';
    component.color = 'rgba(34,56,78,1)';
    colorService.secondaryColor = 'rgba(00,00,00,1)';
    component.confirmColor();
    expect(saveSpy).toHaveBeenCalled();
  });

  it(' confirmColor should not call saveColor if primaryColor was not modified', () => {
    saveSpy = spyOn<any>(colorService, 'saveColor');
    colorService.currentColor = 'Primary';
    component.color = 'rgba(34,56,78,1)';
    colorService.primaryColor = 'rgba(34,56,78,1)';
    component.confirmColor();
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it(' confirmColor should not call saveColor if secondaryColor was not modified', () => {
    saveSpy = spyOn<any>(colorService, 'saveColor');
    colorService.currentColor = 'Secondary';
    component.color = 'rgba(34,56,78,1)';
    colorService.secondaryColor = 'rgba(34,56,78,1)';
    component.confirmColor();
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it(' setColorInputValue should set the rgb values to 00 if color is undefined', () => {
    component.color;
    expect(component.rValue).toEqual('00');
    expect(component.gValue).toEqual('00');
    expect(component.bValue).toEqual('00');
  });

  it(' setColorInputValue should set the rgb values to the correct value of color', () => {
    component.color = 'rgba(125,43,200,1)';
    let r:number = 125;
    let g:number = 43;
    let b:number = 200;
    component.setColorInputValue();
    expect(component.rValue).toEqual(r.toString(16));
    expect(component.gValue).toEqual(g.toString(16));
    expect(component.bValue).toEqual(b.toString(16));
  });

  it(' updateColorFromInput should call isHexadecimal to verify if value parsed is a correct value', () => {
    updateSpy = spyOn<any>(colorService, 'isHexadecimal');
    component.rValue = '23';
    component.gValue = 'fb';
    component.bValue = '00';
    component.updateColorFromInput();
    expect(updateSpy).toHaveBeenCalled();
  });

  it(' updateColorFromInput should call setColorInputValue if rgb values are not hexadecimal ', () => {
    setColorSpy = spyOn<any>(component, 'updateColorFromInput');
    component.rValue = 'gg';
    component.gValue = '345';
    component.bValue = '00';
    component.updateColorFromInput();
    expect(setColorSpy).toHaveBeenCalled();
  });
  

  it(' updateColorFromInput should update color & hue to correct rgba value if all values provided are hexadecimal ', () => {
    let expectedResult:string = 'rgba(' + parseInt('72', 16) + ',' + parseInt('fb', 16) + ',' + parseInt('aa', 16) + ',1)';
    component.rValue = '72';
    component.gValue = 'fb';
    component.bValue = 'aa';
    component.updateColorFromInput();
    expect(component.color).toEqual(expectedResult);
    expect(component.hue).toEqual(expectedResult);
  });

  it(' ngAfterViewInit should initialize the primary color value if we are modifying the primary color value', () => {
    colorService.primaryColor = 'rgba(23,45,67,1)';
    colorService.currentColor = 'Primary';
    component.ngAfterViewInit();
    expect(component.color).toEqual(colorService.primaryColor);
  });

  it(' ngAfterViewInit should initialize the secondary color value if we are modifying the secondary color value', () => {
    colorService.secondaryColor = 'rgba(23,45,67,1)';
    colorService.currentColor = 'Secondary';
    component.ngAfterViewInit();
    expect(component.color).toEqual(colorService.secondaryColor);
  });

  it(' cancel emits false as visibility value ', () => {
    let visibilityEmitterSpy = spyOn<any>(component.isVisible, 'emit');
    component.cancel();
    expect(visibilityEmitterSpy).toHaveBeenCalledWith(false);
  });

  it(' confirmColor emits false as visibility value ', () => {
    let visibilityEmitterSpy = spyOn<any>(component.isVisible, 'emit');
    component.confirmColor();
    expect(visibilityEmitterSpy).toHaveBeenCalledWith(false);
  });

  it(' confirmColor emits color as color value ', () => {
    let colorEmitterSpy = spyOn<any>(component.colorModified, 'emit');
    component.confirmColor();
    expect(colorEmitterSpy).toHaveBeenCalledWith(component.color);
  });

});
