"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const getPizzas = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch('/api/pizzas/all');
    const data = yield response.json();
    console.log(data);
    return data;
});
const pizzaComponent = (pizza) => `
  <div class="pizza" id="pizza-${pizza.id}">
    <h2>${pizza.name}</h2>
    <h3>${pizza.price}</h3>
    <div>${pizza.toppings.map(topping => `<span>${topping}</span>`).join('')}</div>
  </div>
`;
const pizzasComponent = (pizzas) => `
  <div class="pizzas">
    ${pizzas.map(pizza => pizzaComponent(pizza)).join('')}
  </div>
`;
(() => __awaiter(void 0, void 0, void 0, function* () {
    const pizzas = yield getPizzas();
    const rootElement = document.querySelector('#root');
    rootElement === null || rootElement === void 0 ? void 0 : rootElement.insertAdjacentHTML('beforeend', pizzasComponent(pizzas));
}))(); // immediately invoked function expression
