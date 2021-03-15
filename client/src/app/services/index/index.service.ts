import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Metadata } from '@app/Constants/constants';
import { CanvasInformation } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class IndexService {
    private readonly BASE_URL: string = 'http://localhost:3000/api/metadata';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');
    constructor(private http: HttpClient) {}

    basicGet(): Observable<Metadata[]> {
        return this.http.get<Metadata[]>(this.BASE_URL).pipe(catchError(this.handleError<Metadata[]>('basicGet')));
    }

    basicPost(info: CanvasInformation): Observable<CanvasInformation> {
        debugger
        return this.http.post<CanvasInformation>(this.BASE_URL + '/', info).pipe(catchError(this.handleError<CanvasInformation>('basicPost')));
    }

    basicDelete(message: string): Observable<Message> {
        const test = this.http.delete<Message>(this.BASE_URL + '/' + message);
        // Cette étape transforme le Message en un seul string

        return test;
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
