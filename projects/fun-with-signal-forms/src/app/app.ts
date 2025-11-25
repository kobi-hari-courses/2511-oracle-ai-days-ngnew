import { Component, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DinnerReview } from './models/dinner-review.model';
import { apply, customError, Field, form, max, MIN, min, required, validate } from '@angular/forms/signals';
import { CommonModule } from '@angular/common';
import { FieldExtensionDirective } from './shared/field-extension';
import { StarRating } from "./shared/star-rating/star-rating";
import { ratingSchema } from './shared/rating-schema';
import { minWords } from './shared/words-validators';
import { FieldWrapper } from "./shared/field/field";
import { withLabel } from './shared/title-validation';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Field, FieldExtensionDirective, StarRating, FieldWrapper],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly model = signal<DinnerReview>({
    username: 'Kobi',
    isVip: false, 
    rating: 3 , 
    description: ''
  });

  readonly dinnerForm = form(this.model, p => {
    required(p.username, {
      message: 'Username is required'
    });
    apply(p, ratingSchema);
    minWords(p.description, 10);
    withLabel(p.description, 'Dinner Description');
    withLabel(p.username, 'User Name');
    withLabel(p.isVip, 'VIP Status');
    withLabel(p.rating, 'Dinner Rating');

  });

  constructor() {
    effect(() => {
      const userField = this.dinnerForm.username();
      const min = userField.metadata(MIN)();
    })
  }

}
