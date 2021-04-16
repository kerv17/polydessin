import { ServiceCalculator } from './service-calculator';
import { Vec2 } from './vec2';

describe('ServiceCalculator', () => {

    let service:ServiceCalculator = ServiceCalculator;

    it('RNG', () => {
      const value = 7;
      const result = ServiceCalculator.rng(value);
      expect(Math.abs(result)).toBeLessThanOrEqual(value);
    });

    it(' getShiftAngle should return the angle from the x-axis', () => {
      let expectedValue: Vec2;
      const pointA: Vec2 = { x: 0, y: 0 };
      let pointB: Vec2;
      let distance;

      // Test 1
      expectedValue = { x: 0, y: 15 };
      pointB = { x: 5, y: 15 };
      distance = (service as any).getShiftAngle(pointA, pointB);
      expect(distance).toEqual(expectedValue);

      // Test 2
      expectedValue = { x: 15, y: 0 };
      pointB = { x: 15, y: 5 };
      distance = (service as any).getShiftAngle(pointA, pointB);
      expect(distance).toEqual(expectedValue);

      // Test 3
      expectedValue = { x: 15, y: 15 };
      pointB = { x: 15, y: 15 };
      distance = (service as any).getShiftAngle(pointA, pointB);
      expect(distance).toEqual(expectedValue);

      // Test 4
      expectedValue = { x: 15, y: -15 };
      pointB = { x: 15, y: -15 };
      distance = (service as any).getShiftAngle(pointA, pointB);
      expect(distance).toEqual(expectedValue);

      // Test 5
      expectedValue = { x: -15, y: 15 };
      pointB = { x: -15, y: 15 };
      distance = (service as any).getShiftAngle(pointA, pointB);
      expect(distance).toEqual(expectedValue);

      // Test 6
      expectedValue = { x: -15, y: -15 };
      pointB = { x: -15, y: -15 };
      distance = (service as any).getShiftAngle(pointA, pointB);
      expect(distance).toEqual(expectedValue);
  });

  it(' distanceBetweenPoints should return the right distance ', () => {
    const expectedValue = 15;
    const pointA: Vec2 = { x: 25, y: 40 };
    const pointB: Vec2 = { x: 34, y: 28 };
    const distance = (service as any).distanceBewteenPoints(pointA, pointB);
    expect(distance).toEqual(expectedValue);
});

it(' getAngle should return the angle from the x-axis', () => {
    const expectedValue = -135;
    const pointA: Vec2 = { x: 25, y: 40 };
    const pointB: Vec2 = { x: 20, y: 35 };
    const distance = (service as any).getAngle(pointA, pointB);
    expect(distance).toEqual(expectedValue);
});

it('Intersect', ()=>{
    const lines: Vec2[][] = [[{x:0,y:0},{x:10,y:10}],[{x:10,y:0},{x:0,y:10}]];
    expect(ServiceCalculator.intersect(lines[0],lines[1])).toBeTrue();

    const lines2: Vec2[][] = [[{x:0,y:0},{x:0,y:10}],[{x:10,y:0},{x:10,y:10}]];
    expect(ServiceCalculator.intersect(lines2[0],lines2[1])).toBeFalse();
});

it('maxSize', ()=> {
      const shape:Vec2[] = [ {x:15,y:25}, {x:30,y:15}, {x:45,y: 50}, {x:10,y:30}, {x:25,y:25}];
      expect(ServiceCalculator.maxSize(shape)).toEqual([{x:10,y:15},{x:45,y:50}]);
  })
});
