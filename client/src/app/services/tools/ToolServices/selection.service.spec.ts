import { TestBed } from '@angular/core/testing';
import { SelectionService } from './selection.service';

fdescribe('SelectionService', () => {
    let service: SelectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
