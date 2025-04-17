"use strict";
const getPizzas = async () => {
    const response = await fetch('/api/pizzas/all');
    const data = await response.json();
    console.log(data);
    return data;
};
const getPizza = async (id) => {
    const response = await fetch(`/api/pizzas/pizza/${id}`);
    return await response.json();
};
const checkoutOrder = async (cart) => {
    const response = await fetch('/api/orders/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: cart
    });
    console.log(response);
};
const pizzaComponent = (pizza) => `
  <div class="pizza" id="pizza-${pizza.id}">
    <h2>${pizza.name}</h2>
    <h3>price: ${pizza.price} huf</h3>
    <div>toppings: ${pizza.toppings.map(topping => `<span>${topping}</span>`).join(', ')}</div>
    <button class="add-to-cart">add to cart</button>
  </div>
`;
const pizzasComponent = (pizzas) => `
  <div class="pizzas">
    ${pizzas.map(pizza => pizzaComponent(pizza)).join('')}
  </div>
`;
const pizzaPriceComponent = (pizza, qty) => `
  <li>
    <h3>${pizza.name}</h3>
    <span>${qty} x ${pizza.price} = </span>
    <span>${qty * pizza.price}</span>
  </li>
`;
const cartComponent = async (cart) => {
    const entries = Object.entries(cart);
    let totalSum = 0;
    let cartHtml = "";
    const promises = entries.map(async ([pizzaId, pizzaQty]) => {
        const pizzaData = await getPizza(pizzaId);
        cartHtml += pizzaPriceComponent(pizzaData, pizzaQty);
        const sum = pizzaQty * pizzaData.price;
        return sum;
    });
    const sums = await Promise.all(promises);
    sums.forEach(sum => totalSum += sum);
    return `
    <div class="cart">
      <ul>
        ${cartHtml}
      </ul>

      <h2>total: ${totalSum}</h2>
      <button class="checkout">Checkout 💳</button>
    </cart>
  `;
};
const addPizzaToCart = async (pizzaId) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '{}');
    if (Object.keys(currentCart).includes(String(pizzaId))) {
        currentCart[pizzaId] = currentCart[pizzaId] + 1;
    }
    else {
        currentCart[pizzaId] = 1;
    }
    localStorage.setItem('cart', JSON.stringify(currentCart));
    const cartHtml = await cartComponent(currentCart);
    const cartElement = document.querySelector('div.cart');
    if (cartElement)
        cartElement.remove();
    const rootElement = document.querySelector('#root');
    rootElement?.insertAdjacentHTML('beforeend', cartHtml);
    createCheckoutEvent();
};
const createAddToCartEvents = () => {
    const rootElement = document.querySelector('#root');
    rootElement?.querySelectorAll('button.add-to-cart').forEach(button => {
        button.addEventListener('click', async () => {
            const pizzaId = Number(button.parentElement?.id.split('-')[1]);
            const pizzaData = await getPizza(pizzaId);
            await addPizzaToCart(pizzaId);
        });
    });
};
const createCheckoutEvent = () => {
    const checkoutButtonElement = document.querySelector('button.checkout');
    checkoutButtonElement?.addEventListener('click', () => {
        const cart = localStorage.getItem('cart');
        if (cart) {
            checkoutOrder(cart);
        }
    });
};
(async () => {
    const pizzas = await getPizzas();
    const rootElement = document.querySelector('#root');
    rootElement?.insertAdjacentHTML('beforeend', pizzasComponent(pizzas));
    createAddToCartEvents();
})(); // immediately invoked function expression
