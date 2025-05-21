const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');

const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductPrice = document.querySelector('#update-price');
const updateProductDescription = document.querySelector('#update-description');

const updateModal = new bootstrap.Modal(document.getElementById('updateModal'));

const route = "http://18.224.15.132:3000";

async function fetchProducts() {
  const response = await fetch(route + '/products');
  const products = await response.json();

  productList.innerHTML = '';

  if (products.length === 0) {
    const li = document.createElement('li');
    li.className = 'list-group-item text-center';
    li.textContent = 'Nenhum produto cadastrado.';
    productList.appendChild(li);
    return;
  }

  products.forEach(product => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex flex-column flex-md-row justify-content-between align-items-center';

    li.innerHTML = `
      <div class="ms-2 me-auto py-3">
        <div class="fw-bold">${product.name}</div>
        Descrição: ${product.description || 'Sem Descrição'}<br>
        Preço: R$ ${product.price}
      </div>
    `;

    const btnGroup = document.createElement('div');
    btnGroup.className = 'd-flex justify-content-center gap-2 py-2';

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-sm btn-danger py-2 px-3';
    deleteButton.textContent = 'Excluir';
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id);
      location.reload();
    });

    const updateButton = document.createElement('button');
    updateButton.className = 'btn btn-sm btn-warning py-2 px-3';
    updateButton.textContent = 'Editar';
    updateButton.addEventListener('click', () => {
      updateProductId.value = product.id;
      updateProductName.value = product.name;
      updateProductPrice.value = product.price;
      updateProductDescription.value = product.description;
      updateModal.show();
    });

    btnGroup.appendChild(updateButton);
    btnGroup.appendChild(deleteButton);
    li.appendChild(btnGroup);

    productList.appendChild(li);
  });
}

// Adicionar Produto
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = addProductForm.elements['name'].value;
  const price = addProductForm.elements['price'].value;
  const description = addProductForm.elements['description'].value;

  const response = await fetch(route + '/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, description })
  });

  if (response.ok) {
    location.reload();
  } else {
    alert('Erro ao adicionar produto.');
  }
});

// Atualizar Produto
updateProductForm.addEventListener('submit', async event => {
  event.preventDefault();

  const id = updateProductId.value;
  const name = updateProductName.value;
  const description = updateProductDescription.value;
  const price = updateProductPrice.value;

  const response = await fetch(`${route}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price })
  });

  if (response.ok) {
    updateModal.hide();
    location.reload();
  } else {
    alert('Erro ao atualizar produto!');
  }
});

// Deletar Produto
async function deleteProduct(id) {
  const response = await fetch(route + '/products/' + id, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    alert('Erro ao deletar produto.');
  }
}

// Carrega os produtos ao abrir a página
fetchProducts();
