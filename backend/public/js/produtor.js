const container = document.getElementById("produtos-container");
const nomeProdutor = document.getElementById("nome-produtor");
const emailProdutor = document.getElementById("email-produtor");
const telefoneProdutor = document.getElementById("telefone-produtor");
const cpfProdutor = document.getElementById("cpf-produtor");

// Pega dados do usuário logado
const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

if (!usuarioLogado) {
    // Se não estiver logado, redireciona para login
    window.location.href = 'login.html';
} else {
    // Mostra dados do produtor
    nomeProdutor.textContent = usuarioLogado.nome;
    emailProdutor.textContent = `Email: ${usuarioLogado.email}`;
    telefoneProdutor.textContent = `Telefone: ${usuarioLogado.telefone}`;
    cpfProdutor.textContent = `CPF: ${usuarioLogado.cpf}`;

    // Carrega produtos do produtor logado
    async function carregarProdutos() {
        try {
            const response = await fetch(`/api/produtos?cod_produtor=${usuarioLogado.cod_produtor}`);
            if (!response.ok) throw new Error("Erro ao buscar produtos");
            const produtos = await response.json();
            container.innerHTML = '';

            produtos.forEach(produto => {
                const cardProd = document.createElement("div");
                cardProd.classList.add("col");
                cardProd.innerHTML = `
                    <div class="card h-100 shadow-sm">
                        <img src="${produto.imagem || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${produto.descricao}">
                        <div class="card-body">
                            <h5 class="card-title">${produto.descricao}</h5>
                            <p class="card-text">Tipo: ${produto.tipo || 'Sem tipo'}</p>
                            <p class="card-text">Preço: R$ ${produto.preco.toFixed(2)}</p>
                            <p class="card-text">Validade: ${produto.validade}</p>
                        </div>
                    </div>
                `;
                container.appendChild(cardProd);
            });
        } catch (error) {
            console.error(error);
            container.innerHTML = "<p>Erro ao carregar produtos.</p>";
        }
    }

    carregarProdutos();
}
