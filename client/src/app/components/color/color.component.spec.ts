import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorService } from '@app/services/color/color.service';
import { ColorComponent } from './color.component';


describe('ColorComponent', () => {
  let component: ColorComponent;
  let fixture: ComponentFixture<ColorComponent>;
  let colorService: ColorService;
  let setOpacitySpy:jasmine.Spy<any>;
  let saveColorSpy:jasmine.Spy<any>;

  beforeEach(async(() => {
    colorService = new ColorService();
    TestBed.configureTestingModule({
      declarations: [ ColorComponent ],
      providers: [
        { provide: ColorService, useValue: colorService },
    ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    
    fixture = TestBed.createComponent(ColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(' invert should swap primaryColor value with secondaryColor value ', () => {
    component.primaryColor = 'rgba(23,4,56,1)';
    component.secondaryColor = 'rgba(5,78,fa,0.5)';
    component.invert();
    expect(component.primaryColor).toEqual('rgba(5,78,fa,0.5)');
    expect(component.secondaryColor).toEqual('rgba(23,4,56,1)');
  });

  it(' invert should update primaryColor & secondaryColor value with correct values ', () => {
    component.primaryColor = 'rgba(23,4,56,1)';
    component.secondaryColor = 'rgba(5,78,fa,0.5)';
    component.invert();
    expect(colorService.primaryColor).toEqual('rgba(5,78,fa,0.5)');
    expect(colorService.secondaryColor).toEqual('rgba(23,4,56,1)');
  });

  it(' invert should call setOpacityValue ', () => {
    setOpacitySpy = spyOn<any>(component, 'setOpacityValue');
    component.invert();
    expect(setOpacitySpy).toHaveBeenCalled();
  });

  it(' openModal should toggle visibility attribute to true ', () => {
    let colorType:string = 'Primary';
    component.openModal(colorType);
    expect(colorService.modalVisibility).toEqual(true);
  });

  it(' openModal should retrieve which color was clicked ', () => {
    let colorType:string = 'Primary';
    component.openModal(colorType);
    expect(colorService.currentColor).toEqual(colorType);
  });

  it(' closeModal should toggle visibility attribute to false ', () => {
    component.closeModal();
    expect(component.visibility).toEqual(false);
  });

  it(' closeModal should call setOpacityValue ', () => {
    setOpacitySpy = spyOn<any>(component, 'setOpacityValue');
    component.closeModal();
    expect(setOpacitySpy).toHaveBeenCalled();
  });

  it(' updateColor should initialise the color values ', () => {
    colorService.primaryColor = 'rgba(23,4,56,1)';
    colorService.secondaryColor = 'rgba(5,78,fa,0.5)';
    component.updateColor();
    expect(component.primaryColor).toEqual('rgba(23,4,56,1)');
    expect(component.secondaryColor).toEqual('rgba(5,78,fa,0.5)');
  });

  it(' selectPrimaryColor should call saveColor ', () => {
    saveColorSpy = spyOn<any>(colorService, 'saveColor');
    component.selectPrimaryColor('rgba(23,4,56,1)');
    expect(saveColorSpy).toHaveBeenCalled();
  });

  it(' selectSecondaryColor should call saveColor ', () => {
    saveColorSpy = spyOn<any>(colorService, 'saveColor');
    component.selectSecondaryColor('rgba(23,4,56,1)');
    expect(saveColorSpy).toHaveBeenCalled();
  });

  it(' selectPrimaryColor should update the primary color value ', () => {
    component.selectPrimaryColor('rgba(23,4,56,1)');
    expect(component.primaryColor).toEqual('rgba(23,4,56,1)');
    expect(colorService.primaryColor).toEqual('rgba(23,4,56,1)');
  });

  it(' selectSecondaryColor should update the secondary color value ', () => {
    component.selectSecondaryColor('rgba(5,78,fa,0.5)');
    expect(component.secondaryColor).toEqual('rgba(5,78,fa,0.5)');
    expect(colorService.secondaryColor).toEqual('rgba(5,78,fa,0.5)');
  });

  it(' updateOpacityPrimary should update primaryColor value with the new opacity value ', () => {
    component.primaryColor = 'rgba(23,4,56,1)';
    component.OP = '45';
    component.updateOpacityPrimary();
    expect(component.primaryColor).toEqual('rgba(23,4,56,0.45)');
    expect(colorService.primaryColor).toEqual('rgba(23,4,56,0.45)');
  });

  it(' updateOpacitySecondary should update secondaryColor value with the new opacity value ', () => {
    component.secondaryColor = 'rgba(5,78,fa,0.5)';
    component.OS = '25';
    component.updateOpacitySecondary();
    expect(component.secondaryColor).toEqual('rgba(5,78,fa,0.25)');
    expect(colorService.secondaryColor).toEqual('rgba(5,78,fa,0.25)');
  });

  it(' updateOpacityPrimary should set opacity to 100 if the provided value is greater than 100 ', () => {
    component.primaryColor = 'rgba(23,4,56,0.75)';
    component.OP = '235';
    component.updateOpacityPrimary();
    expect(component.primaryColor).toEqual('rgba(23,4,56,1)');
    expect(colorService.primaryColor).toEqual('rgba(23,4,56,1)');
  });

  it(' updateOpacitySecondary should set opacity to 100 if the provided value is greater than 100 ', () => {
    component.secondaryColor = 'rgba(5,78,fa,0.5)';
    component.OS = '525';
    component.updateOpacitySecondary();
    expect(component.secondaryColor).toEqual('rgba(5,78,fa,1)');
    expect(colorService.secondaryColor).toEqual('rgba(5,78,fa,1)');
  });

  it(' setOpacityValue should initialize the correct opacity value for both primary & secondary colors', () => {
    component.primaryColor = 'rgba(23,4,56,0.75)';
    component.secondaryColor = 'rgba(5,78,fa,0.38)';
    component.setOpacityValue();
    expect(component.OP).toEqual('75');
    expect(component.OS).toEqual('38');
  });

});
