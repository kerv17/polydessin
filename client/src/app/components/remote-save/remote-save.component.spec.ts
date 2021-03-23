/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ServerRequestService } from '@app/services/index/server-request.service';
import { RemoteSaveService } from '@app/services/remote-save/remote-save.service';
import { ResizePoint } from '@app/services/resize-Point/resize-point.service';
// import { CanvasInformation } from '@common/communication/canvas-information';
import { RemoteSaveComponent } from './remote-save.component';
// tslint:disable:no-any
describe('RemoteSaveComponent', () => {
    let component: RemoteSaveComponent;
    let fixture: ComponentFixture<RemoteSaveComponent>;
    let remoteSaveService: RemoteSaveService;
    let tagHandlerSpy: jasmine.Spy;
    let postSpy: jasmine.Spy;
    // let testInformation: CanvasInformation;
    const drawingStub = new DrawingService({} as ResizePoint);

    beforeEach(async(() => {
        remoteSaveService = new RemoteSaveService(drawingStub, {} as ServerRequestService);
        TestBed.configureTestingModule({
            declarations: [RemoteSaveComponent],
            providers: [{ provide: RemoteSaveService, useValue: remoteSaveService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RemoteSaveComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        fixture.debugElement.nativeElement.style.visibility = 'hidden';
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set the right mode', () => {
        const test = 'test';
        component.toggleMode(test);
        expect(component.saveMode).toEqual(test);
    });

    it('should call methods of remote-save service to save the picture', () => {
        component.saveMode = 'png';
        component.fileName = 'DessinTest';
        component.tagsName = 'something';

        tagHandlerSpy = spyOn(remoteSaveService, 'tagsHandler').and.returnValue(['something']);

        postSpy = spyOn(remoteSaveService, 'post');

        component.savePicture();
        expect(tagHandlerSpy).toHaveBeenCalled();
        expect(postSpy).toHaveBeenCalled();
    });

    it('should change the showModal value when calling close', () => {
        (component as any).remoteSaveService.showModalSave = true;
        component.close();
        expect((component as any).remoteSaveService.showModalSave).not.toBeTrue();
    });
});
