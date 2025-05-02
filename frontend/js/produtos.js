document.addEventListener("DOMContentLoaded", () => {
  fetch("js/produtos.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao carregar o JSON");
      }
      return response.json();
    })
    .then(produtos => {
      const container = document.getElementById("produtos-container");

      produtos.forEach(produto => {
        // Criação do card
        const card = document.createElement("div");
        card.className = "card m-2";
        card.style.width = "18rem";

        // Imagem do produto
        const img = document.createElement("img");
        img.src = produto.imagem;
        img.className = "card-img-top";
        img.alt = produto.nome;

        // Corpo do card
        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        // Nome do produto
        const title = document.createElement("h5");
        title.className = "card-title";
        title.textContent = produto.nome;

        cardBody.appendChild(title);
        card.appendChild(img);
        card.appendChild(cardBody);
        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Erro ao carregar os produtos:", error);
    });
});