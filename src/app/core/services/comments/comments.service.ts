import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IComment,
  updateCommentData,
} from '../../../shared/interfaces/icomment';
import { environments } from '../../environments/api_environment';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(private http: HttpClient) {}
  private readonly baseUrl = environments.baseUrl;
  readonly EndPoint = '/comments';

  createComment(CommentsData: IComment): Observable<any> {
    return this.http.post(`${this.baseUrl}${this.EndPoint}`, CommentsData);
  }

  getPostComments(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/posts/${id}${this.EndPoint}`);
  }

  updateComment(id: string, CommentsData: updateCommentData): Observable<any> {
    return this.http.put(`${this.baseUrl}${this.EndPoint}/${id}`, CommentsData);
  }

  deleteComment(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}${this.EndPoint}/${id}`);
  }
}
