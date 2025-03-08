import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { rdetailsResolver } from './rdetails.resolver';

describe('rdetailsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => rdetailsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
