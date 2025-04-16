type Pizza = {
  id: number,
  name: string,
  toppings: string[],
  price: number,
  image: string
}

const getPizzas = async (): Promise<Pizza[]> => {
  const response = await fetch('/api/pizzas/all');
  const data = await response.json();
  console.log(data);
  return data;
}

const pizzaComponent = (pizza: Pizza) => `
  <div class="pizza" id="pizza-${pizza.id}">
    <h2>${pizza.name}</h2>
    <h3>${pizza.price}</h3>
    <div>${pizza.toppings.map(topping => `<span>${topping}</span>`).join('')}</div>
  </div>
`;

const pizzasComponent = (pizzas: Pizza[]) => `
  <div class="pizzas">
    ${pizzas.map(pizza => pizzaComponent(pizza)).join('')}
  </div>
`;

(async () => {
  const pizzas = await getPizzas();
  const rootElement = document.querySelector('#root');
  rootElement?.insertAdjacentHTML('beforeend', pizzasComponent(pizzas));
})(); // immediately invoked function expression