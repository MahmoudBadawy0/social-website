import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  let id = inject(PLATFORM_ID);
  let router = inject(Router);

  if (isPlatformBrowser(id)) {
    if (localStorage.getItem('token') !== null) {
      router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }
  else {
    return true
  }


};


