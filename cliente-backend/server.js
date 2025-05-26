const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Supabase
const supabaseUrl = 'https://wfklpvkuhjfubohmiiwx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indma2xwdmt1aGpmdWJvaG1paXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxODM5MDUsImV4cCI6MjA2Mzc1OTkwNX0.hKhUCZeZEzxgrVCDhDuZysqmR41zQOHlknTDf3lr6ww'; // (mantenha em segredo em produção)
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  const { error } = await supabase.from('orders').select('*').limit(1);
  if (error) {
    console.error('❌ Erro ao conectar com o Supabase:', error.message);
  } else {
    console.log('✅ Supabase conectado com sucesso!');
  }
})();


// 🧾 Rota para novo pedido
app.post('/pedido', async (req, res) => {
  const { itens } = req.body;
  const order_id = uuidv4();

  const pedidos = itens.map(item => ({
  item_nome: item.item,
  quantity: item.quantity,
  status: 'em preparo',
  order_id
}));


  const { error } = await supabase.from('orders').insert(pedidos);
  if (error) return res.status(500).json({ erro: error.message });

  res.json({ order_id });
});

// 🧾 Buscar status do pedido
app.get('/pedido/:order_id', async (req, res) => {
  const { order_id } = req.params;
  const { data, error } = await supabase
    .from('orders')
    .select('item_nome, quantity, status')
    .eq('order_id', order_id);

  if (error) return res.status(500).json({ erro: error.message });

  res.json(data);
});

app.listen(3002, () => console.log('Cliente rodando na porta 3002'));
