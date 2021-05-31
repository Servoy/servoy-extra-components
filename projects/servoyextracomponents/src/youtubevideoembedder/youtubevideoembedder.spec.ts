import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServoyExtraYoutubeVideoEmbedder } from './youtubevideoembedder';

describe('ServoyExtraYoutubeVideoEmbedder', () => {
  let component: ServoyExtraYoutubeVideoEmbedder;
  let fixture: ComponentFixture<ServoyExtraYoutubeVideoEmbedder>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServoyExtraYoutubeVideoEmbedder ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServoyExtraYoutubeVideoEmbedder);
    component = fixture.componentInstance;
    component.servoyApi =  jasmine.createSpyObj('ServoyApi', ['getMarkupId','trustAsHtml','registerComponent','unRegisterComponent']);
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
