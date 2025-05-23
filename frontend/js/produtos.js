import { produtos } from './data/dados.js';

const container = document.getElementById("produtos-container");
const botoesFiltro = document.querySelectorAll('.filtro');

function renderizarProdutos(lista) {
  container.innerHTML = ''; // Limpa o conteúdo antes de renderizar

  lista.forEach(produto => {
    const cardProd = `
      <div class="card" id="produto-${produto.nome}">
        <h6 class= "produto-disponivel"> Produto disponível </h6> 
        <img src="${produto.imagem}" class="card-img" alt="${produto.nome}">
        <div class="card-body">
          <span class="fa-solid fa-trash delete-icon"></span>
          <h5 class="card-title">${produto.nome}</h5>
          <i class="bx bxs-user"></i>
          <p class="card-title">${produto.tipo}</p>
        </div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", cardProd);

    // Agora adiciona o evento de deletar
    const trashIcon = container.querySelector(
      `#produto-${produto.nome} .delete-icon`
    );

    trashIcon.onclick = function () {
      const cardToRemove = document.querySelector(`#produto-${produto.nome}`);
      cardToRemove.remove();
    };
  });
}


function filtrarProdutos(tipo) {
  const filtrados = produtos.filter(produto => produto.tipo === tipo);
  renderizarProdutos(filtrados);
}

botoesFiltro.forEach(botao => {
  botao.addEventListener('click', () => {
    const tipo = botao.dataset.tipo;
    if (tipo === "Todos") {
      renderizarProdutos(produtos);
    } else {
      filtrarProdutos(tipo);
    }
  });
});

// Renderiza todos inicialmente
renderizarProdutos(produtos);


