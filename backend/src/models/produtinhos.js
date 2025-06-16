import { produtos } from '../database/data.js';
 
function create({ nome, tipo}) {
  const id = uuidv4();
 
  const produtos = { nome, tipo, id };
 
  if (nome && tipo) {
    produtos.push(produtos);
 
    return produtos;
  } else {
    throw new Error('Unable to create produtos');
  }
}
 
function read(nome, tipo) {
  if (nome && tipo) {
    const filteredprodutos = produtos.filter((produtos) =>
      produtos[nome].includes(tipo)
    );
 
    return filteredprodutos;
  }
 
  return produtos;
}
 
function readById(id) {
  if (id) {
    const index = produtos.findIndex((produtos) => produtos.id === id);
 
    if (!produtos[index]) {
      throw new Error('produtos not found');
    }
 
    return produtos[index];
  } else {
    throw new Error('Unable to find produtos');
  }
}
 
function update({ id, nome, tipo }) {
  if (nome && tipo && id) {
    const newprodutos = { nome, tipo, id };
 
    const index = produtos.findIndex((produtos) => produtos.id === id);
 
    if (!produtos[index]) {
      throw new Error('produtos not found');
    }
 
    produtos[index] = newprodutos;
 
    return newprodutos;
  } else {
    throw new Error('Unable to update produtos');
  }
}
 
function remove(id) {
  if (id) {
    const index = produtos.findIndex((produtos) => produtos.id === id);
 
    produtos.splice(index, 1);
 
    return true;
  } else {
    throw new Error('produtos not found');
  }
}
 
export default { create, read, readById, update, remove };
 