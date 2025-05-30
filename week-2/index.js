'use strict';

const { EventEmitter } = require('node:events');

class Basket {
  #total;
  #limit;
  #errors;
  #products;

  constructor({ limit = 1050 }) {
    this.#total = 0;
    this.#limit = limit;
    this.#errors = [];
    this.#products = [];
  }

  addProduct(product, notify) {      
    const isOverLimit = this.#total + product.price > this.#limit;

    if (isOverLimit) {
      const error = new Error(`Basket limit of ${this.#limit} exceeded at product "${product.name} with price ${product.price}"`);

      notify?.('error', error);
      return this.#errors.push(error);
    }

    this.#total += product.price;
    this.#products.push(product);

    notify?.('success', { product, total: this.#total });
  }

  end() {
    const result = { products: this.#products, total: this.#total, errors: this.#errors };
    
    return {
      then: (onFulfilled, onRejected) => {
        if (this.#errors.length) {
          return onRejected(this.#errors);
        }

        onFulfilled(result);
      }
    };
  }
}

class PurchaseIterator {
  static async *create(products) {
    for (const product of products) {
      yield product;
    }
  }
}

(async () => {
  const purchase = [
    { name: "Mouse", price: 25 },
    { name: "Keyboard", price: 100 },
    { name: "HDMI cable", price: 10 },
    { name: "Bag", price: 50 },
    { name: "Mouse pad", price: 5 },
    { name: "Monitor", price: 2000 },
  ];
  
  const emitter = new EventEmitter();
  const basket = new Basket({ limit: 10000 });
  const purchaseIterator = PurchaseIterator.create(purchase);

  emitter.on('error', err => console.error('‼️ Error notification:', err.message));  
  emitter.on('success', payload => console.log('✅ Success notification:', payload));
  emitter.on('result', payload => console.log('Resutl:', payload));

  for await (const good of purchaseIterator) {
    basket.addProduct(good, (type, payload) => emitter.emit(type, payload));
  }

  basket.end().then(
    ({ products, total, errors }) => console.log('Final:', { products, total, errors }),
    errors => console.error('Escalated errors:', errors.map(e => e.message))
  );
})();
