import { Component, computed, contentChild, effect } from '@angular/core';
import { Field, REQUIRED } from '@angular/forms/signals';
import { LABEL } from '../title-validation';
import { MIN_WORDS } from '../words-validators';

@Component({
  selector: 'app-field',
  imports: [],
  templateUrl: './field.html',
  styleUrl: './field.scss',
})
export class FieldWrapper<T> {
  readonly fieldDirective = contentChild.required(Field<T>);

  readonly label = computed(() => this.fieldDirective().state().metadata(LABEL));
  readonly required = computed(() => this.fieldDirective().state().metadata(REQUIRED)());
  readonly errors = computed(() => this.fieldDirective().state().errors());
  readonly hasErrors = computed(() => this.errors().length > 0);
  readonly wordsCount = computed(() => this.fieldDirective().state().metadata(MIN_WORDS));

  readonly displayedLabel = computed(() => `${this.required() ? '*' : ''}${this.label()}`);
  constructor() {
    effect(() => {
      console.log('field', this.label());
    })
  }


}
