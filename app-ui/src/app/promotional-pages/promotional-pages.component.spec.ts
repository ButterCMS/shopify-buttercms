import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionalPagesComponent } from './promotional-pages.component';

describe('PromotionalPagesComponent', () => {
  let component: PromotionalPagesComponent;
  let fixture: ComponentFixture<PromotionalPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionalPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionalPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
