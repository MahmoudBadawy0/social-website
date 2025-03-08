import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { PostsService } from '../../core/services/posts/posts.service';
import { Subscription } from 'rxjs';
import { post } from '../../shared/interfaces/ipost';
import { PostComponent } from '../../shared/components/ui/post/post.component';
import { SkeletonComponent } from '../../shared/components/ui/skeleton/skeleton.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [
    PostComponent,
    SkeletonComponent,
    InfiniteScrollDirective,
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  counter = signal<number>(1);
  skeletonArr = [1, 2, 3, 4];
  allPosts: WritableSignal<post[]> = signal([]);
  getPostsUnsubscribe: Subscription = new Subscription();
  createPostUnsubscribe: Subscription = new Subscription();
  previewUrl = signal<string | null>(null);
  uploadedFile = signal<File | undefined>(undefined);
  postContent = signal<string>('');
  isLoading = signal(false);
  
  readonly skeletonLoading = signal(false);
  private readonly postsService = inject(PostsService);
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;

  ngOnInit(): void {
    this.getPosts(this.counter());
  }

  getPosts(count: number) {
    this.getPostsUnsubscribe = this.postsService.getAllPosts(count).subscribe({
      next: (res) => {
        this.allPosts.update((posts) => [...posts, ...res.posts]);
        this.skeletonLoading.set(false);
      },
    });
  }

  onScroll() {
    this.skeletonLoading.set(true);
    this.counter.update((count) => count + 1);
    this.getPosts(this.counter());
  }
  showPreview(event: Event) {
    this.uploadedFile.set((event.target as HTMLInputElement).files?.[0]);
    if (this.uploadedFile() && this.uploadedFile()?.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => this.previewUrl.set(reader.result as string);
      reader.readAsDataURL(this.uploadedFile()!);
    }
  }
  clearImage() {
    this.previewUrl.set(null);
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  checkBtn() {
    if (this.postContent() && this.previewUrl()) {
      return true;
    }
    return false;
  }

  createPost() {
    const formData = new FormData();
    formData.append('body', this.postContent());
    formData.append('image', this.uploadedFile()!);
    this.isLoading.set(true);
    this.createPostUnsubscribe = this.postsService
      .createPost(formData)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.isLoading.set(false);
          this.clearImage();
          this.postContent.set('');
        },
        error: (err) => {
          console.log(err);
          this.isLoading.set(false);
          this.clearImage();
          this.postContent.set('');
        },
      });
  }

  ngOnDestroy(): void {
    this.getPostsUnsubscribe.unsubscribe();
    this.createPostUnsubscribe.unsubscribe();
  }
}
