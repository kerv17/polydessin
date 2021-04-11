import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { MatSliderChange } from '@angular/material/slider/slider';
import { BucketToleranceComponent } from '@app/components/bucket-tolerance/bucket-tolerance.component';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { AerosolService } from '@app/services/tools/ToolServices/aerosol-service.service';
import { BucketService } from '@app/services/tools/ToolServices/bucket.service';
import { EllipsisService } from '@app/services/tools/ToolServices/ellipsis-service';
import { LineService } from '@app/services/tools/ToolServices/line-service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { RectangleService } from '@app/services/tools/ToolServices/rectangle-service';
import { SelectionService } from '@app/services/tools/ToolServices/selection.service';
import { StampService } from '@app/services/tools/ToolServices/stamp.service';
describe('BucketToleranceComponent', () => {
    let component: BucketToleranceComponent;
    let fixture: ComponentFixture<BucketToleranceComponent>;
    let matSliderChange: MatSliderChange;
    let toolController: ToolControllerService;
    let bucket: BucketService;

    const defaultToolValue = 5;

    beforeEach(async(() => {
        bucket = new BucketService({} as DrawingService);
        toolController = new ToolControllerService(
            {} as PencilService,
            {} as RectangleService,
            {} as LineService,
            {} as EllipsisService,
            {} as AerosolService,
            {} as SelectionService,
            {} as StampService,
            bucket,
        );

        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [BucketToleranceComponent, MatSlider],
            providers: [BucketToleranceComponent, { provide: ToolControllerService, useValue: toolController }],
        }).compileComponents();
    }));

    beforeEach(() => {
        matSliderChange = {
            value: Globals.TEST_MAT_SLIDER_VALUE, // valeur uniquement utilisé pour les test
        } as MatSliderChange;

        bucket.tolerance = defaultToolValue;

        toolController.currentTool = bucket;
        fixture = TestBed.createComponent(BucketToleranceComponent);
        component = fixture.componentInstance;
        component.change = true;
        fixture.detectChanges();
    });
    it('should create PencilService', () => {
        expect(component).toBeTruthy();
    });

    it('should create PencilService and attribute it to toolController', () => {
        expect(toolController.currentTool).toBeTruthy();
    });

    it('should create ToolController', () => {
        expect(toolController).toBeTruthy();
    });

    it('should create the widthSlider component', () => {
        expect(component).toBeTruthy();
    });

    it('Verifying that the component sets the right width value', () => {
        component.updateWidthValues(matSliderChange);

        expect(bucket.tolerance).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
    });

    it('Verifying that updateWidthValues does nothing if the evt.value is null', () => {
        const previousTolerance: number = component.tolerance;
        const previousToolTolerance: number = bucket.tolerance;
        matSliderChange.value = null;
        component.updateWidthValues(matSliderChange);
        expect(component.tolerance).toEqual(previousTolerance);
        expect(bucket.tolerance).toEqual(previousToolTolerance);
    });

    it('Verifying that the component sets the right width value for the tool', () => {
        component.updateWidthValues(matSliderChange);
        expect(bucket.tolerance).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
    });

    it('verifying ngOnchanges with the change value changing', () => {
        component.updateWidthValues(matSliderChange);
        const newValue = 8;
        bucket.tolerance = newValue;
        // On doit faire comme si le form contenait une nouvelle valeur
        const temp = bucket.tolerance;

        component.ngOnChanges({ change: new SimpleChange(null, component.change, true) });
        expect(bucket.tolerance).toEqual(temp);
        expect(component.tolerance).toEqual(newValue);
    });

    it('verifying ngOnchanges with the change value not changing', () => {
        // set the value of width to 12
        component.updateWidthValues(matSliderChange);
        component.ngOnChanges({});
        // On doit faire comme si le form contenait une nouvelle valeur

        // on change pas la valeur de set
        expect(component.tolerance).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
        expect(bucket.tolerance).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
    });
});