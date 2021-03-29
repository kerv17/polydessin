import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StampComponent } from './stamp.component';
// tslint:disable: no-any
describe('StampComponent', () => {
    let component: StampComponent;
    let fixture: ComponentFixture<StampComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StampComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StampComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create', () => {
        component.setImage('test.jpg');
        expect((component as any).stampService.toolMode).toEqual('test.jpg');
        expect(component.currentStamp).toEqual('test.jpg');
    });

    it('ngOnInit', () => {
        component.ngOnInit();
        expect(component.currentStamp).toEqual((component as any).stampService.toolMode);
    });
});
