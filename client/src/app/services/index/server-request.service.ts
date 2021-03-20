import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanvasInformation } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ServerRequestService {
    private readonly BASE_URL: string = 'http://localhost:3000/api/metadata';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');
    constructor(private http: HttpClient) {}

    basicGet(): Observable<CanvasInformation[]> {
        return this.http.get<CanvasInformation[]>(this.BASE_URL).pipe(catchError(this.handleError<CanvasInformation[]>('basicGet')));
    }
    getSome(tags: string): Observable<HttpResponse<CanvasInformation[]>> {
        return this.http.get<CanvasInformation[]>(this.BASE_URL + '/' + tags, { observe: 'response' });
    }

    basicPost(info: CanvasInformation): Observable<CanvasInformation> {
        return this.http.post<CanvasInformation>(this.BASE_URL + '/', info).pipe(catchError(this.handleError<CanvasInformation>('basicPost')));
    }

    basicDelete(message: string): Observable<Message> {
        return this.http.delete<Message>(this.BASE_URL + '/' + message).pipe(catchError(this.handleError<Message>('basicDelete')));
        // Cette étape transforme le Message en un seul string
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
