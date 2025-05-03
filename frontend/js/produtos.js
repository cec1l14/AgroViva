import { produtos } from './dados.js';

const container = document.getElementById("produtos-container");

produtos.forEach(function(produto) {
  const cardProd = `
    <div class="card">
      <img src="${produto.imagem}" class="card-img" alt="${produto.nome}">
      <div class="card-body">
        <h5 class="card-title">${produto.nome}</h5>
        <p class="card-title">${produto.tipo}</p>
      </div>
    </div>
  `;
  container.insertAdjacentHTML("beforeend", cardProd);
});