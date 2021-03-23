/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RemoteSaveService } from '@app/services/remote-save/remote-save.service';
import { CanvasInformation } from '@common/communication/canvas-information';
import { RemoteSaveComponent } from './remote-save.component';
xdescribe('RemoteSaveComponent', () => {
    let component: RemoteSaveComponent;
    let fixture: ComponentFixture<RemoteSaveComponent>;
    let remoteSaveService: RemoteSaveService;
    let testInformation: CanvasInformation;

    beforeEach(async(() => {
        remoteSaveService = new RemoteSaveService();
        TestBed.configureTestingModule({
            declarations: [RemoteSaveComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RemoteSaveComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
