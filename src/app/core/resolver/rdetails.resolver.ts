import { get } from 'http';
import { ResolveFn } from '@angular/router';
import { post } from '../../shared/interfaces/ipost';
import { PostsService } from '../services/posts/posts.service';
import { inject } from '@angular/core';

export const rdetailsResolver: ResolveFn<post> = (route, state) => {
  const postsService = inject(PostsService);
  const postId = route.paramMap.get('id');

  return postsService.getSinglePostById(postId!);
};
