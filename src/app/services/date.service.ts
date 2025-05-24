import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

const pipe = new DatePipe('en-US');

@Injectable({ providedIn: 'root' })
export class DateService {

    constructor(private http: HttpClient) { }


    getData(): Observable<User[]> {
        return this.http.get<User[]>('http://localhost:3000/data')
    }

    PostData(obj): Observable<User> {
        return this.http.post<User>('http://localhost:3000/data', obj)
    }

    updateData(obj): Observable<any> {
        return this.http.put<any>(`http://localhost:3000/data/${obj.id}`, obj)
    }

    deleteData(id): Observable<any> {
        return this.http.delete(`http://localhost:3000/data/${id}`);
    }
}
