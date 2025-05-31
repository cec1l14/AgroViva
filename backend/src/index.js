import express from 'express';
import { produtos } from './data/dados.js';
 
const app = express();

app.use(express.static('public'));
 
app.get('/', (req, res) => {
  return res.send('Hello World!');
});

app.get('/produtos', (req, res) => {
  return res.json(produtos);
});
 
app.listen(3000, () => {
  console.log('App running on port 3000');
});