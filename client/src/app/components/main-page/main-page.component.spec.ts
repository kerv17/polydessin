import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ServerRequestService } from '@app/services/index/server-request.service';
import { MainPageComponent } from './main-page.component';

import SpyObj = jasmine.SpyObj;

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let indexServiceSpy: SpyObj<ServerRequestService>;
    const router = {
        navigate: jasmine.createSpy('navigate'),
    };

    beforeEach(async(() => {
        indexServiceSpy = jasmine.createSpyObj<ServerRequestService>('ServerRequestService', ['basicGet']);
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [MainPageComponent],
            providers: [
                { provide: ServerRequestService, useValue: indexServiceSpy },
                { provide: Router, useValue: router },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should have as title 'LOG2990'", () => {
        expect(component.title).toEqual('LOG2990');
    });

    it('should go to editor ', () => {
        component.goToEditor();

        expect(router.navigate).toHaveBeenCalledWith(['/editor']);
    });
});
