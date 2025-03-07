import { DatePipe } from '@angular/common';
import { Comment, post } from './../../../interfaces/ipost';
import {
  Component,
  inject,
  input,
  InputSignal,
  OnInit,
  signal,
} from '@angular/core';
import { CommentsService } from '../../../../core/services/comments/comments.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comment',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);
  CommentId: InputSignal<string> = input.required();
  private readonly formBuilder = inject(FormBuilder);

  postComments = signal<Comment[]>([]);
  createCommentUnsubscribe: Subscription = new Subscription();
  checkBtn = signal<boolean>(false);
  errMsg = signal<string>('');
  commentForm!: FormGroup;

  ngOnInit(): void {
    this.initFrom();
    this.getPostComments(this.CommentId());
  }

  initFrom() {
    this.commentForm = this.formBuilder.group({
      content: [''],
      post: [''],
    });
  }

  submitForm() {
    this.commentForm.get('post')?.setValue(this.CommentId());
    if (this.commentForm.valid) {
      this.checkBtn.set(true);
      this.createCommentUnsubscribe = this.commentsService
        .createComment(this.commentForm.value)
        .subscribe({
          next: (res) => {
            console.log('submitForm', res);
            this.checkBtn.set(false);
            this.commentForm.reset();
            this.errMsg.set('');
            this.getPostComments(this.CommentId());
          },
          error: (err) => {
            this.checkBtn.set(false);
            this.errMsg.set(err.error.error);
          },
        });
    }
  }

  getPostComments(id: string) {
    return this.commentsService.getPostComments(id).subscribe({
      next: (res) => {
        console.log('getPostComments', res);
        this.postComments.set(res.comments);
      },
      error: (err) => {
        console.log('err', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.createCommentUnsubscribe.unsubscribe();
  }
}
