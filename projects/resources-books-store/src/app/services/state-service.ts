import { Injectable, resource, signal } from '@angular/core';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  readonly apiBase = 'http://localhost:3000/api/books';

  readonly #keywords = signal('the');

  get keyword() {
    return this.#keywords.asReadonly();
  }

  setKeyword(value: string) {
    this.#keywords.set(value);

    console.log(`Keyword set to: ${value}`);
  }

  readonly #searchResult = resource({
    params: () => ({ keyword: this.keyword() } ),
    loader: options => this.#searchBooks(options.params.keyword, options.abortSignal)
  });

  get searchResult() {
    return this.#searchResult.asReadonly();
  };


#searchBooks(keyword: string, abortSignal?: AbortSignal): Promise<Book[]> {
  return fetch(`${this.apiBase}/search?q=${encodeURIComponent(keyword)}`, {
    signal: abortSignal
  }).then(
    res => res.json() as Promise<Book[]>
  );
}
  
}
