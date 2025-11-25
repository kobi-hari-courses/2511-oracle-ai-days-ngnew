import { inject, Injectable, linkedSignal, resource, ResourceStreamItem, signal } from '@angular/core';
import { Book } from '../models/book';
import { HttpClient, httpResource } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  readonly apiBase = 'http://localhost:3000/api/books';

  readonly wsBase = 'ws://localhost:3000/ws';


  readonly http = inject(HttpClient);

  readonly #keywords = signal('the');

  get keyword() {
    return this.#keywords.asReadonly();
  }

  setKeyword(value: string) {
    this.#keywords.set(value);

    console.log(`Keyword set to: ${value}`);
  }

  // readonly #searchResult = resource({
  //   params: () => ({ keyword: this.keyword() } ),
  //   loader: options => this.#searchBooks(options.params.keyword, options.abortSignal)
  // });

  readonly #searchResult = httpResource<Book[]>(() => ({
    url: `${this.apiBase}/search`,
    params: {
      q: this.keyword()
    }
  }), 
  {
    defaultValue: []
  }
)

  get searchResult() {
    return this.#searchResult.asReadonly();
  };

  #selectedBookId = linkedSignal<Book[], string>({
    source: () => this.searchResult.value(), 
    computation: (src, prev) => {
      if (!prev) {
        // first computation
        return src.length > 0 ? src[0].id : '';
      }
      if (prev.value === '' && src.length > 0) {
        return src[0].id;
      }

      return prev.value;
    }
  });

  get selectedBookId() {
    return this.#selectedBookId.asReadonly();
  }

  setSelectedBookId(value: string) {
    this.#selectedBookId.set(value);
  }


#selectedBook = rxResource({
  params: () => ({ id: this.selectedBookId() }),
  stream: options => options.params.id 
    ? this.http.get<Book>(`${this.apiBase}/${options.params.id}`)
    : of(null)
});

get selectedBook() {
  return this.#selectedBook.asReadonly();
}

#selectedStock = resource({
  params: () => ({ id : this.selectedBookId() }),
  stream: async options => {
    const res = signal<ResourceStreamItem<number>>({value: 0});
  
    if (options.params.id) {
      const ws = new WebSocket(`${this.wsBase}/stock/${options.params.id}`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data?.stock !== undefined) {
          res.set({ value: data.stock });
        }
      }

      options.abortSignal.addEventListener('abort', () => {
        ws.close();
      })
    }

    return res;
  }
})

get selectedStock() {
  return this.#selectedStock.asReadonly();
}

#searchBooks(keyword: string, abortSignal?: AbortSignal): Promise<Book[]> {
  return fetch(`${this.apiBase}/search?q=${encodeURIComponent(keyword)}`, {
    signal: abortSignal
  }).then(
    res => res.json() as Promise<Book[]>
  );
}


  
}
