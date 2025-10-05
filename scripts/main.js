//DESCONTINUADO
import { db } from './database.js';
import { setupAutoValidation, notificar } from './utils.js';

const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = e.target.href;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split('/').pop();

    switch(path) {
        case 'cadastro.html':
            initCadastro();
            break;
        case 'estoque.html':
            initEstoque();
            break;
        case 'vendas.html':
            initVendas();
            break;
        default:
            initHome();
    }
});

function initHome() {
}

function initCadastro() {
    const form = document.getElementById('formProduto');
    const selectCategoria = document.getElementById('categoria');
    
    db.categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        selectCategoria.appendChild(option);
    });

    setupAutoValidation(form);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const produto = {
            nome: form.nome.value,
            codigo: form.codigo.value,
            preco: parseFloat(form.preco.value),
            categoria: form.categoria.value,
            quantidade: parseInt(form.quantidade.value)
        };

        db.adicionarProduto(produto);
        notificar('Produto cadastrado com sucesso!');
        form.reset();
    });

    document.getElementById('btnEditar').addEventListener('click', () => {
        const codigo = prompt('Digite o código do produto para editar:');
        if (codigo) {
            const produto = db.produtos.find(p => p.codigo === codigo);
            if (produto) {
                form.nome.value = produto.nome;
                form.codigo.value = produto.codigo;
                form.preco.value = produto.preco;
                form.quantidade.value = produto.quantidade;
                form.categoria.value = produto.categoria;
                notificar('Produto carregado para edição');
            } else {
                notificar('Produto não encontrado', 'error');
            }
        }
    });
}

function initEstoque() {
    const selectFiltro = document.getElementById('filtro');
    const btnAtualizar = document.querySelector('button.primary');
    const tabela = document.querySelector('tbody');

    function carregarEstoque(categoria = '') {
        tabela.innerHTML = '';
        const produtos = db.getProdutosPorCategoria(categoria);
        
        produtos.forEach(produto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${produto.nome}</td>
                <td>${produto.quantidade}</td>
                <td class="${produto.quantidade < 5 ? 'warning' : 'success'}">
                    ${produto.quantidade < 5 ? 'Baixo estoque' : 'Disponível'}
                </td>
            `;
            tabela.appendChild(tr);
        });
    }

    selectFiltro.addEventListener('change', () => {
        carregarEstoque(selectFiltro.value);
    });

    btnAtualizar.addEventListener('click', carregarEstoque);
    carregarEstoque();
}

function initVendas() {
    const form = document.querySelector('form');
    const tabela = document.querySelector('tbody');

    function carregarHistorico() {
        tabela.innerHTML = '';
        db.vendas.forEach(venda => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${venda.produto}</td>
                <td>${venda.quantidade}</td>
                <td>${new Date(venda.data).toLocaleDateString()}</td>
            `;
            tabela.appendChild(tr);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const venda = {
            produto: form.produto.value,
            quantidade: parseInt(form.quantidade.value),
            data: new Date().toISOString()
        };

        db.registrarVenda(venda);
        alert('Venda registrada com sucesso!');
        form.reset();
        carregarHistorico();
    });

    carregarHistorico();
}