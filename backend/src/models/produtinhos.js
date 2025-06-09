import { v4 as uuidv4 } from 'uuid';
import { produtos } from '../data/data.js';
 
function create({ name, value }) {
  const id = uuidv4();
 
  const produtos = { name, value, id };
 
  if (name && value) {
    produtos.push(produtos);
 
    return produtos;
  } else {
    throw new Error('Unable to create produtos');
  }
}
 
function read(field, value) {
  if (field && value) {
    const filteredprodutos = produtos.filter((produtos) =>
      produtos[field].includes(value)
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
 
function update({ id, name, value }) {
  if (name && value && id) {
    const newprodutos = { name, value, id };
 
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
 