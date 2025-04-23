type Pizza = {
  id: number;
  name: string;
  toppings: string[];
  price: number;
  image: string;
}

type Cart = {
  [key: string]: number;
}

type OrderedPizza = Pizza & {
  qty: number;
}

type Order = {
  id: string;
  date: string;
  sum: number;
  pizzas: OrderedPizza[]
}

const getPizzas = async (): Promise<Pizza[]> => {
  const response = await fetch('/api/pizzas/all');
  const data = await response.json();
  console.log(data);
  return data;
}

const getPizza = async (id: string | number): Promise<Pizza> => {
  const response = await fetch(`/api/pizzas/pizza/${id}`)
  return await response.json();
}

const getOrder = async (id: string): Promise<Order> => {
  const response = await fetch(`/api/orders/order/${id}`);
  return await response.json();
}

const checkoutOrder = async (cart: string) => {
  const response = await fetch('/api/orders/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: cart
  });
  return await response.json();
}

const pizzaComponent = (pizza: Pizza) => `
  <div class="pizza" id="pizza-${pizza.id}">
    <h2>${pizza.name}</h2>
    <h3>price: ${pizza.price} huf</h3>
    <div>toppings: ${pizza.toppings.map(topping => `<span>${topping}</span>`).join(', ')}</div>
    <button class="add-to-cart">add to cart</button>
  </div>
`;

const pizzasComponent = (pizzas: Pizza[]) => `
  <div class="pizzas">
    ${pizzas.map(pizza => pizzaComponent(pizza)).join('')}
  </div>
`;

const pizzaPriceComponent = (pizza: Pizza, qty: number) => `
  <li>
    <h3>${pizza.name}</h3>
    <span>${qty} x ${pizza.price} = </span>
    <span>${qty * pizza.price}</span>
  </li>
`;

const cartComponent = async (cart: Cart) => {
  const entries = Object.entries(cart);
  let totalSum = 0;
  let cartHtml = "";

  const promises = entries.map(async ([pizzaId, pizzaQty]) => {
    const pizzaData = await getPizza(pizzaId);
    
    cartHtml += pizzaPriceComponent(pizzaData, pizzaQty);

    const sum = pizzaQty * pizzaData.price;
    return sum
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
}

const orderComponent = (order: Order) => `
  <div class="order">
    <h1>${order.id}</h1>
    <h2>${order.date}</h2>
    <h3>${order.sum}</h3>
    <div class="ordered-pizzas">
      ${order.pizzas.map(pizza => `
        <div class="ordered-pizza">
          <p>${pizza.name}</p>
          <p>${pizza.qty} x ${pizza.price}</p>
          <p>${pizza.toppings.join(', ')}</p>
        </div>
      `)}
    </div>
    <button class="menu">back to menu</button>
  </div>
`;

const createBackToMenuEvent = () => {
  const menuButtonElement = document.querySelector('button.menu');
  if (menuButtonElement) {
    menuButtonElement.addEventListener('click', () => {
      const rootElement = document.querySelector('#root');
      if (rootElement) {
        rootElement.innerHTML = "";
        init();
      }
    })
  }
}

const clearCart = () => {
  localStorage.removeItem('cart');
  document.querySelector('div.cart')?.remove();
}

const addPizzaToCart = async (pizzaId: number) => {
  const currentCart = JSON.parse(localStorage.getItem('cart') || '{}');
  if (Object.keys(currentCart).includes(String(pizzaId))) {
    currentCart[pizzaId] = currentCart[pizzaId] + 1;
  } else {
    currentCart[pizzaId] = 1;
  }
  localStorage.setItem('cart', JSON.stringify(currentCart));

  const cartHtml = await cartComponent(currentCart);
  
  const cartElement = document.querySelector('div.cart');
  if (cartElement) cartElement.remove();
  
  const rootElement = document.querySelector('#root');
  rootElement?.insertAdjacentHTML('beforeend', cartHtml);
  createCheckoutEvent();
}

const createAddToCartEvents = () => {
  const rootElement = document.querySelector('#root');
  rootElement?.querySelectorAll('button.add-to-cart').forEach(button => {
    button.addEventListener('click', async () => {
      const pizzaId = Number(button.parentElement?.id.split('-')[1]);
      const pizzaData = await getPizza(pizzaId);

      await addPizzaToCart(pizzaId);
    })
  })
}

const createCheckoutEvent = () => {
  const checkoutButtonElement = document.querySelector('button.checkout');
  checkoutButtonElement?.addEventListener('click', async () => {
    const cart = localStorage.getItem('cart');
    if (cart) {
      const data = await checkoutOrder(cart);
      if (data.orderId) {
        clearCart();
        const orderData = await getOrder(data.orderId);
        const rootElement = document.querySelector('#root');

        if (rootElement) rootElement.innerHTML = orderComponent(orderData);
        createBackToMenuEvent();
      }
    }
  })
}

const init = async () => {
  const pizzas = await getPizzas();
  const rootElement = document.querySelector('#root');
  rootElement?.insertAdjacentHTML('beforeend', pizzasComponent(pizzas));
  createAddToCartEvents();
}; 

init();