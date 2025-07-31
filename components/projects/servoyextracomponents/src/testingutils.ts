import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export async function runOnPushChangeDetection<T>(cf: ComponentFixture<T>): Promise<any>{
  const cd = cf.debugElement.injector.get<ChangeDetectorRef>(
    ChangeDetectorRef as any
  );
  cd.detectChanges();
  return cf.whenStable();
}

