import AOS from 'aos';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { updateOn } from '@rxweb/reactive-form-validators';
import { AuthService } from '../../core/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly id = inject(PLATFORM_ID);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  loginForm!: FormGroup;
  isLoading: WritableSignal<boolean> = signal(false);
  msgError: WritableSignal<string> = signal('');
  loginUnsubscribe: Subscription = new Subscription();

  ngOnInit(): void {
    this.aosInit();
    this.loginFormInit();
  }

  aosInit() {
    if (isPlatformBrowser(this.id)) {
      AOS.init();
    }
  }
  loginFormInit() {
    this.loginForm = this.formBuilder.group(
      {
        email: [
          null,
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
            ),
          ],
        ],
        password: [
          null,
          [
            Validators.required,
            Validators.pattern(/^(?=.*[A-Z])(?=.*[\W_]).{8,}$/),
          ],
        ],
      },
      {
        updateOn: 'submit',
      }
    );
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.loginUnsubscribe = this.authService
        .signin(this.loginForm.value)
        .subscribe({
          next: (res) => {
            if (res.message == 'success') {
              setTimeout(() => {
                localStorage.setItem('token', res.token);
                this.authService.isAuthenticated.set(true);
                this.authService.tokenDecode();
                this.router.navigate(['/home']);
              }, 500);
            }
            console.log(res);
            this.isLoading.set(false);
          },
          error: (err) => {
            this.isLoading.set(false);
            console.log(err);

            this.msgError.set(err.error.error);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.loginUnsubscribe.unsubscribe();
  }
}
