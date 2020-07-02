import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDialogFormComponent } from './template-dialog-form.component';

describe('TemplateDialogFormComponent', () => {
  let component: TemplateDialogFormComponent;
  let fixture: ComponentFixture<TemplateDialogFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateDialogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
