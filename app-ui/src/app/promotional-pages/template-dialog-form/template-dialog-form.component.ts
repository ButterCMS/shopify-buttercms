import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import * as mammoth from 'mammoth/mammoth.browser';

@Component({
  selector: 'promotional-pages-template-dialog-form',
  templateUrl: './template-dialog-form.component.html',
  styleUrls: ['./template-dialog-form.component.scss'],
})
export class TemplateDialogFormComponent implements OnInit {
  @Input() errorMessage: string;
  @Input() isSubmitting: boolean;

  @Output() formSubmitted = new EventEmitter<void>();

  form: FormGroup;
  hasExamples = false;
  exampleTemplate = `<h1>{{fields.twitter_card.title}}</h1>
<img style="max=width: 100%" src="{{fields.twitter_card.image}}"/>
<p>{{fields.twitter_card.Description}}</p>
<h2>{{fields.product_promo_banner.headline}}</h2>
<div style="display: flex; flex-wrap: wrap; justify-content: space-between">
{{#fields.product_promo_banner.product}}
  <div style="flex:1; padding: 10px">
    <a href="/collections/all/products/{{name}}">{{name}}</a>
    <img style="width: 100%" src="{{image}}"/>
    <p>{{description}}</p>
  </div>
{{/fields.product_promo_banner.product}}
</div>`;
  templateError: string;

  constructor() {}

  ngOnInit(): void {
    this.form = new FormGroup({
      template: new FormControl('', Validators.required),
    });
  }

  get template() {
    return this.form.get('template');
  }

  submitForm() {
    if (!this.form.valid) {
      this.form.markAsTouched();
      return;
    }
    this.formSubmitted.emit(this.template.value);
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }
    const type = file.name.split('.').pop();
    if (type === 'txt') {
      this.readTxtFile(file);
    } else if (type === 'doc' || type === 'docx') {
      this.readDocFile(file);
    } else {
      this.templateError =
        'Invalid file format. Only .txt, .doc and .docx are supported';
    }
  }

  private readDocFile(file: File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const arrayBuffer = reader.result;

      mammoth.extractRawText({ arrayBuffer }).then((resultObject) => {
        this.template.setValue(resultObject.value);
      });
    };
    reader.readAsArrayBuffer(file);
  }

  private readTxtFile(file: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const contents = event.target.result;
      this.template.setValue(contents);
    };

    reader.readAsText(file);
  }
}
