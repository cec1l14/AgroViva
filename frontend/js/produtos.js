import { produtos } from './dados.js';

const container = document.getElementById("produtos-container");

produtos.forEach(function(produto) {
  const cardProd = `
    <div class="card" id="produto-${produto.nome}">
      <img src="${produto.imagem}" class="card-img" alt="${produto.nome}">
      <div class="card-body">
        <span class="fa-solid fa-trash delete-icon"></span>
        <h5 class="card-title">${produto.nome}</h5>
        <p class="card-title">${produto.tipo}</p>
      </div>
    </div>
  `;

  container.insertAdjacentHTML("beforeend", cardProd);

  const trashIcon = document.querySelector(
    `#produto-${produto.nome} .delete-icon`
  );

  trashIcon.onclick = function () {
    const cardToRemove = document.querySelector(`#produto-${produto.nome}`);
    cardToRemove.remove();
  };
});


