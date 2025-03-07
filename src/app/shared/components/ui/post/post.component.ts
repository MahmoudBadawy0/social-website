import { Component, input, InputSignal } from '@angular/core';
import { CommentComponent } from '../comment/comment.component';
import {  post } from '../../../interfaces/ipost';
import { DatePipe } from '@angular/common';
import {  ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-post',
  imports: [CommentComponent, DatePipe, ReactiveFormsModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {

  inPost: InputSignal<post> = input.required();








}
