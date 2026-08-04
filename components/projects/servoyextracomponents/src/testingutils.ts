import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';

export async function runOnPushChangeDetection<T>(cf: ComponentFixture<T>): Promise<any>{
  const cd = cf.debugElement.injector.get<ChangeDetectorRef>(
    ChangeDetectorRef as any
  );
  cd.detectChanges();
  return cf.whenStable();
}

