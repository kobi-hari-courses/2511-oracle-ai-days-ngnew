import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DinnerReview } from './models/dinner-review.model';
import { Field, form, max, min, required } from '@angular/forms/signals';
import { CommonModule } from '@angular/common';
import { FieldExtensionDirective } from './shared/field-extension';
import { StarRating } from "./shared/star-rating/star-rating";

@Component({
  selector: 'app-root',
  imports: [CommonModule, Field, FieldExtensionDirective, StarRating],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly model = signal<DinnerReview>({
    username: 'Kobi',
    rating: 3    
  });

  readonly dinnerForm = form(this.model, p => {
    required(p.username, {
      message: 'Username is required'
    });
    required(p.rating, {
      message: 'Rating is required'
    });
    max(p.rating, () => 9, {
      message: (ctx) => `Rating cannot be more than ${ctx.field().max?.() || 0 }`
    });

  });

}
