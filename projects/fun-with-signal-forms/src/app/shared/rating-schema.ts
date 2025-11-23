import { max, min, required, schema } from '@angular/forms/signals';

export const ratingSchema = schema<{ rating: number; isVip: boolean }>((p) => {
  required(p.rating, {
    message: 'Rating is required',
  });
  max(p.rating, (ctx) => (ctx.valueOf(p.isVip) ? 10 : 5), {
    message: (ctx) => `Rating cannot be more than ${ctx.field().max?.() || 0}`,
  });
  min(p.rating, 1, {
    message: (ctx) => `Rating must be at least ${ctx.field().min?.() || 0}`,
  });
});
