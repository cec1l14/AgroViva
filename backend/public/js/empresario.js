async function carregarProdutos() {
    const res = await fetch(`/api/produtos`); // rota atual
    const produtos = await res.json();

    const lista = document.getElementById('lista-produtos');
    lista.innerHTML = '';

    produtos.forEach(produto => {
        const div = document.createElement('div');
        div.classList.add('card-produto');

        div.innerHTML = `
            <img src="${produto.imagem || '../imagens/default.jpg'}" alt="${produto.descricao}">
            <h3>${produto.descricao}</h3>
            <p>Preço: R$ ${produto.preco.toFixed(2)}</p>
            <p>Produtor: ${produto.produtor.nome}</p>
            <p>Contato: ${produto.produtor.telefone}</p>
            <div class="contato">
                <a href="https://wa.me/${produto.produtor.telefone}"</a>
                <p href="tel:${produto.produtor.telefone}" class="ligar">Ligar</p>
            </div>
        `;
        lista.appendChild(div);
    });
}

document.getElementById('logout').addEventListener('click', () => {
    window.location.href = '/';
});

carregarProdutos();
