import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDialogueComponent } from './transaction-dialogue.component';

describe('TransactionDialogueComponent', () => {
  let component: TransactionDialogueComponent;
  let fixture: ComponentFixture<TransactionDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionDialogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
