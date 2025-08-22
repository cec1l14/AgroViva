async function carregarProdutos() {
    try {
        // Buscar todos os produtos com dados do produtor
        const res = await fetch(`/api/produtos`);
        const produtos = await res.json();

        const lista = document.getElementById('lista-produtos');
        lista.innerHTML = '';

        produtos.forEach(produto => {
            const div = document.createElement('div');
            div.classList.add('card-produto');

            div.innerHTML = `
                <img src="${produto.imagem || '/imagens/default.jpg'}" alt="${produto.descricao}">
                <h3>${produto.descricao}</h3>
                <p>Preço: R$ ${produto.preco.toFixed(2)}</p>
                <p>Produtor: ${produto.produtor.nome}</p>
                <p>Telefone: ${produto.produtor.telefone}</p>
            `;
            lista.appendChild(div);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        const lista = document.getElementById('lista-produtos');
        lista.innerHTML = '<p>Erro ao carregar produtos.</p>';
    }
}

// Evento de logout
document.getElementById('logout').addEventListener('click', () => {
    window.location.href = '/';
});

// Carregar produtos ao abrir a página
window.addEventListener('DOMContentLoaded', carregarProdutos);
