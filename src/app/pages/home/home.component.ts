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

@Component({
  selector: 'app-home',
  imports: [PostComponent, SkeletonComponent, InfiniteScrollDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  counter = signal<number>(1);
  readonly skeletonLoading = signal(false);
  private readonly postsService = inject(PostsService);
  skeletonArr = [1, 2, 3, 4];
  allPosts: WritableSignal<post[]> = signal([]);
  getPostsUnsubscribe: Subscription = new Subscription();
  previewUrl: string | null = null;

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;

  ngOnInit(): void {
    this.getPosts(this.counter());
  }

  getPosts(count: number) {
    this.getPostsUnsubscribe = this.postsService.getAllPosts(count).subscribe({
      next: (res) => {
        this.allPosts.update((posts) => [...posts, ...res.posts]);
        this.skeletonLoading.set(false);
        console.log(res);
      },
    });
  }

  onScroll() {
    this.skeletonLoading.set(true);
    this.counter.update((count) => count + 1);
    console.log('scrolled!!');
    console.log(this.counter());
    this.getPosts(this.counter());
  }

  showPreview(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  clearImage() {
    this.previewUrl = null;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  ngOnDestroy(): void {
    this.getPostsUnsubscribe.unsubscribe();
  }
}
