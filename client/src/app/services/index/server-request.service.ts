import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanvasInformation } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ServerRequestService {
    private readonly BASE_URL: string = 'http://localhost:3000/api/metadata';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');
    constructor(private http: HttpClient) {}

    basicGet(): Observable<HttpResponse<CanvasInformation[]>> {
        return this.http.get<CanvasInformation[]>(this.BASE_URL, { observe: 'response' });
    }
    getSome(tags: string): Observable<HttpResponse<CanvasInformation[]>> {
        return this.http.get<CanvasInformation[]>(this.BASE_URL + '/' + tags, { observe: 'response' });
    }

    basicPost(info: CanvasInformation): Observable<HttpResponse<Message>> {
        // idée pris de stack overflow ici :
        // https://stackoverflow.com/questions/50798592/angular-6-how-to-set-response-type-as-text-while-making-http-call

        return this.http.post<Message>(this.BASE_URL + '/', info, { observe: 'response' });
    }

    basicDelete(message: string): Observable<HttpResponse<Message>> {
        return this.http.delete<Message>(this.BASE_URL + '/' + message, { observe: 'response' });
    }
}