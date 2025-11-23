import { createMetadataKey, customError, metadata, SchemaPath, validate } from '@angular/forms/signals';

export const MIN_WORDS = createMetadataKey<number>();

export function minWords(p: SchemaPath<string>, minWordsCount: number | (() => number)) {
  const effectiveCount = typeof minWordsCount === 'number' ? minWordsCount : minWordsCount();

  metadata(p, MIN_WORDS, ctx => effectiveCount);
  validate(p, (ctx) => {
    const val = ctx.value();
    const wordsCount = val ? val.trim().split(/\s+/).length : 0;
    if (wordsCount < effectiveCount) {
      return customError({
        message: `Description must be at least ${effectiveCount} words (currently ${wordsCount})`,
      });
    }

    return undefined;
  });
}
