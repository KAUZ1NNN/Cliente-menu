const menu = [
  { item: "Hambúrguer", preco: 18 },
  { item: "Batata Frita", preco: 12 },
  { item: "Refrigerante", preco: 6 },
];

let carrinho = [];
let pedido = [];
let order_id = Date.now(); // número único do pedido

function renderMenu() {
  const menuDiv = document.getElementById("menu");
  menu.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${item.item}</h3>
      <p>Preço: R$ ${item.preco.toFixed(2)}</p>
      <button onclick="adicionarItem(${i})">Adicionar</button>
    `;
    menuDiv.appendChild(card);
  });
}


function adicionarItem(index) {
  const selecionado = menu[index];
  const existente = pedido.find(p => p.item === selecionado.item);

  if (existente) {
    existente.quantity += 1;
  } else {
    pedido.push({ item: selecionado.item, quantity: 1, preco: selecionado.preco });
  }

  atualizarResumo();
}

function atualizarResumo() {
  const resumo = document.getElementById("resumoPedido");
  const total = document.getElementById("total");
  resumo.innerHTML = "";

  let totalValor = 0;

  pedido.forEach(p => {
    totalValor += p.quantity * p.preco;
    const li = document.createElement("li");
    li.textContent = `${p.item} x${p.quantity} = R$ ${(p.quantity * p.preco).toFixed(2)}`;
    resumo.appendChild(li);
  });

  total.textContent = totalValor.toFixed(2);
}

async function concluirPedido() {
  if (pedido.length === 0) return;

  try {
    const resposta = await fetch("http://localhost:3002/pedido", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itens: pedido }),
    });

    const data = await resposta.json();
    const orderId = data.order_id;

    // Redireciona para a página de status
    window.location.href = `status.html?order_id=${orderId}`;
  } catch (error) {
    alert("Erro ao enviar pedido!");
    console.error(error);
  }
}



renderMenu();
