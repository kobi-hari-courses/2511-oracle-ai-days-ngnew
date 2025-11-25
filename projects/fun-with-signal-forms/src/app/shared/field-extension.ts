import { computed, Directive, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

@Directive({
  selector: '[field]',
  host: {
    '[class.invalid]': 'invalid()'
  }
})
export class FieldExtensionDirective<T> {
  readonly field = input.required<FieldTree<T>>();

  readonly invalid = computed(() => this.field()().invalid());

  constructor() { }

}
