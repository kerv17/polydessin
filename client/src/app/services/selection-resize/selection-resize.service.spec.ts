import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { SelectionResizeService } from './selection-resize.service';

describe('SelectionResizeService', () => {
    let service: SelectionResizeService;
    let path: Vec2[];
    const resizePathData = 'resizePathData';

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionResizeService);
        path = [
            { x: 100, y: 100 },
            { x: 200, y: 100 },
            { x: 200, y: 200 },
            { x: 100, y: 200 },
        ];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initializePath should push the values of the path to the resizePath if the resizePath is empty', () => {
        service[resizePathData] = [];
        path.push({ x: 0, y: 0 });
        service.initializePath(path);
        expect(service[resizePathData]).toEqual(path);
    });

    it('initializePath should push the first value of the path as the actual position if the path only has 4 values', () => {
        const expectedPath = [
            { x: 100, y: 100 },
            { x: 200, y: 100 },
            { x: 200, y: 200 },
            { x: 100, y: 200 },
            { x: 100, y: 100 },
        ];
        service[resizePathData] = [];
        service.initializePath(path);
        expect(service[resizePathData]).toEqual(expectedPath);
    });

    it('initializePath should do nothing if the resizePath is not empty', () => {
        service[resizePathData] = path;
        service.initializePath(path);
        expect(service[resizePathData]).toEqual(path);
    });

    it('resetPath should empty the resizePathData', () => {
        service[resizePathData] = path;
        service.resetPath();
        expect(service[resizePathData]).toEqual([]);
    });

    it('getActualResizedPosition should return the actual position', () => {
        service[resizePathData] = path;
        path.push({ x: 0, y: 0 });
        expect(service.getActualResizedPosition()).toEqual({ x: 0, y: 0 });
    });

    it('getActualResizedWidth should return the absolute value of the width', () => {
        service[resizePathData] = [
            { x: 100, y: 100 },
            { x: 200, y: 100 },
            { x: 50, y: 50 },
            { x: 100, y: 200 },
        ];
        const expectedWidth = 50;
        expect(service.getActualResizedWidth()).toEqual(expectedWidth);
    });

    it('getActualResizedHeight should return the absolute value of the height', () => {
        service[resizePathData] = [
            { x: 100, y: 100 },
            { x: 200, y: 100 },
            { x: 50, y: 50 },
            { x: 100, y: 200 },
        ];
        const expectedHeight = 50;
        expect(service.getActualResizedHeight()).toEqual(expectedHeight);
    });

    it('onMouseDown should return false if none of the handlers were clicked', () => {});

    it('onMouseDown should return true ans set the actual handler value if one of the handlers was clicked', () => {});

    it('onMouseMove should set hasResized to true, call the method corresponding to the clicked handler from the map', () => {});

    it('onMouseMove should call scale with -1, -1 and set the bottom right handler as the actual position of the path if width and height are negative', () => {});

    it('onMouseMove should call scale with -1, 1 and set the topright handler as the actual position if only width is negative', () => {});

    it('onMouseMove should call scale with 1, -1 and set the bottomleft handler as the actual position if only height is negative', () => {});

    it('onMouseMove should call drawImage if both width and height are positive', () => {});

    it('onMouseUp should return the hasResized boolean value', () => {});

    it('onMouseUp should call updatePathData if hasResized is true', () => {});

    it('setPathDataAfterMovement should call updatePathData if the path is not empty and the actual position changed', () => {});

    it('setPathDataAfterMovement should do nothing if the path is empty', () => {});

    it('setPathDataAfterMovement should do nothing if the actual position has not changed', () => {});

    it('updatePathData should modify the resizePathData based on the actual position of the selection', () => {});

    it('initMap should set the map with the different methods based on the handler that is clicked', () => {});

    it('resizeHandler0 should update the topleft handler with the mousePosition', () => {});

    it('resizeHandler0 should update the topleft handler wit the same values of width and height if shifted is true', () => {});

    it('resizeHandler2 should update the topRigth handler with the mousePosition', () => {});

    it('resizeHandler2 should update the topRigth handler wit the same values of width and height if shifted is true', () => {});

    it('resizeHandler4 should update the bottomRight handler with the mousePosition', () => {});

    it('resizeHandler4 should update the bottomRight handler wit the same values of width and height if shifted is true', () => {});

    it('resizeHandler6 should update the bottomleft handler with the mousePosition', () => {});

    it('resizeHandler6 should update the bottomleft handler wit the same values of width and height if shifted is true', () => {});

    it('resizeHandler1 should update the top handler with the mousePosition', () => {});

    it('resizeHandler3 should update the right handler with the mousePosition', () => {});

    it('resizeHandler5 should update the bottom handler with the mousePosition', () => {});

    it('resizeHandler7 should update the left handler with the mousePosition', () => {});
});
