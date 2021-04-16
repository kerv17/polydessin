import { Vec2 } from './vec2';

export abstract class ServiceCalculator {
    // Inspiré de
    // https://bryceboe.com/2006/10/23/line-segment-intersection-algorithm/
    static intersect(line1: Vec2[], line2: Vec2[]): boolean {
        const intersect1 = this.ccw(line1[0], line2[0], line2[1]) !== this.ccw(line1[1], line2[0], line2[1]);
        const intersect2 = this.ccw(line1[0], line1[1], line2[0]) !== this.ccw(line1[0], line1[1], line2[1]);
        return intersect1 && intersect2;
    }

    private static ccw(A: Vec2, B: Vec2, C: Vec2): boolean {
        return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
    }
    // ----------------------------------------------------------------------

    static distanceBewteenPoints(a: Vec2, b: Vec2): number {
        const x = Math.abs(a.x - b.x);
        const y = Math.abs(a.y - b.y);
        const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        return distance;
    }

    static getAngle(p1: Vec2, p2: Vec2): number {
        const HALF_CIRCLE_DEG = 180;
        const angleDeg = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * HALF_CIRCLE_DEG) / Math.PI;
        return angleDeg;
    }

    static getShiftAngle(p1: Vec2, p2: Vec2): Vec2 {
        const solution: Vec2 = { x: p1.x, y: p1.y };

        const NOT_IN_INDEX = -1;

        // tslint:disable: no-magic-numbers
        const X_QUADRANTS: number[] = [0, 7];
        const Y_QUADRANTS: number[] = [3, 4];
        // tslint:enable: no-magic-numbers
        const HALF_QUADRANTS = 22.5;
        const angle = this.getAngle(p1, p2);
        const octant = Math.floor(Math.abs(angle / HALF_QUADRANTS));

        if (X_QUADRANTS.indexOf(octant) !== NOT_IN_INDEX) {
            solution.x = p2.x;
        } else if (Y_QUADRANTS.indexOf(octant) !== NOT_IN_INDEX) {
            solution.y = p2.y;
        } else {
            solution.x = p2.x;
            solution.y = p2.y > p1.y !== p2.x < p1.x ? p1.y + (p2.x - p1.x) : p1.y - (p2.x - p1.x);
        }
        return solution;
    }

    static rng(max: number): number {
        return Math.floor((Math.random() - 1.0 / 2.0) * 2 * max);
    }

    static maxSize(path: Vec2[]): Vec2[] {
        const size: Vec2[] = [
            { x: path[0].x, y: path[0].y },
            { x: path[0].x, y: path[0].y },
        ];
        for (let i = 1; i < path.length; i++) {
            size[0].x = size[0].x > path[i].x ? path[i].x : size[0].x;
            size[1].x = size[1].x < path[i].x ? path[i].x : size[1].x;

            size[0].y = size[0].y > path[i].y ? path[i].y : size[0].y;
            size[1].y = size[1].y < path[i].y ? path[i].y : size[1].y;
        }
        return size;
    }
}
