import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../core/services/posts/posts.service';
import { get } from 'http';
import { post } from '../../shared/interfaces/ipost';
import { CommentComponent } from '../../shared/components/ui/comment/comment.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post-details',
  imports: [CommentComponent, DatePipe],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss',
})
export class PostDetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);
  postId = signal<string>('');
  postDetails = signal<post | null>(null);

  ngOnInit(): void {
    this.postDetails.set(
      this.activatedRoute.snapshot.data['resolverDetails'].post
    );
    // this.getCurrentid();
  }

  // getCurrentid() {
  //   this.activatedRoute.params.subscribe((params) => {
  //     this.postId.set(params['id']);
  //     console.log(params['id']);
  //     this.getPostById();
  //   });
  // }

  // getPostById() {
  //   this.postsService.getSinglePostById(this.postId()).subscribe({
  //     next: (res) => {
  //       this.postDetails.set(res.post);
  //       console.log(res);
  //     },
  //     error(err) {
  //       console.log(err);
  //     },
  //   });
  // }

}
