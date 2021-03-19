/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RemoteSaveComponent } from './remote-save.component';

describe('RemoteSaveComponent', () => {
    let component: RemoteSaveComponent;
    let fixture: ComponentFixture<RemoteSaveComponent>;

    beforeEach(async(() => {
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
