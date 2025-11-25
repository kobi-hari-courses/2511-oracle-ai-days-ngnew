import { Component, computed, input, model, signal } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  imports: [],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.scss',
})
export class StarRating {
  readonly value = model.required<number>();
  readonly max = input<number | undefined>(5);


  readonly stars = computed(() => Array.from({ length: this.max() ?? 5 }, (_, i) => i + 1));

}
