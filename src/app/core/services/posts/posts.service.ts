import { EndPoint } from './../../enum/endPoint.enum';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createPostData } from '../../../shared/interfaces/ipost';
import { environments } from '../../environments/api_environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private http: HttpClient) {}
  private readonly baseUrl = environments.baseUrl;
  readonly EndPoint = '/posts';


  createPost(data: FormData): Observable<any> {
    return this.http.post(this.baseUrl + this.EndPoint, data);
  }

  getAllPosts(p: number = 1): Observable<any> {
    return this.http.get(this.baseUrl + this.EndPoint + `?page=${p}&limit=12`);
  }

  getUserPosts(): Observable<any> {
    return this.http.get(
      this.baseUrl + '/users/664bcf3e33da217c4af21f00/posts?limit=2'
    );
  }

  getSinglePostById(id: string): Observable<any> {
    return this.http.get(this.baseUrl + this.EndPoint + '/' + id);
  }

  updatePost(id: string, updatePostdata: createPostData): Observable<any> {
    return this.http.put(
      `${this.baseUrl}${this.EndPoint}/${id}`,
      updatePostdata
    );
  }

  deletePost(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}${this.EndPoint}/${id}`);
  }
}
