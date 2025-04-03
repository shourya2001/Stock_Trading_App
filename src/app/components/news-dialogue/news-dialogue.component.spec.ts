import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsDialogueComponent } from './news-dialogue.component';

describe('NewsDialogueComponent', () => {
  let component: NewsDialogueComponent;
  let fixture: ComponentFixture<NewsDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsDialogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewsDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
