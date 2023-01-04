import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetFeedResponseInterface } from '../types/getFeedResponse.interface';

@Injectable()
export class FeedService {
  constructor(private http: HttpClient) {}
  getFeed(url: string): Observable<GetFeedResponseInterface> {
    const fullUrl = `http://localhost:3000/api${url}`;

    return this.http.get<GetFeedResponseInterface>(fullUrl);
  }
}
