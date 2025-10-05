//DESCONTINUADO
class Database {
    constructor() {
        this.produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        this.vendas = JSON.parse(localStorage.getItem('vendas')) || [];
        this.categorias = [
            'Alimentos',
            'Bebidas',
            'Frios e Laticínios',
            'Padaria',
            'Limpeza',
            'Higiene Pessoal',
            'Bebidas Alcoólicas',
            'Pet Shop',
            'Hortifruti'
        ];
    }

    adicionarProduto(produto) {
        this.produtos.push(produto);
        this.salvarNoLocalStorage();
    }

    atualizarProduto(codigo, novosDados) {
        const index = this.produtos.findIndex(p => p.codigo === codigo);
        if (index !== -1) {
            this.produtos[index] = { ...this.produtos[index], ...novosDados };
            this.salvarNoLocalStorage();
        }
    }

    removerProduto(codigo) {
        this.produtos = this.produtos.filter(p => p.codigo !== codigo);
        this.salvarNoLocalStorage();
    }

    registrarVenda(venda) {
        this.vendas.push(venda);
        
        const produto = this.produtos.find(p => p.nome === venda.produto);
        if (produto) {
            produto.quantidade -= venda.quantidade;
        }
        
        this.salvarNoLocalStorage();
    }

    salvarNoLocalStorage() {
        localStorage.setItem('produtos', JSON.stringify(this.produtos));
        localStorage.setItem('vendas', JSON.stringify(this.vendas));
    }

    getProdutosPorCategoria(categoria) {
        return categoria 
            ? this.produtos.filter(p => p.categoria === categoria)
            : this.produtos;
    }
}

export const db = new Database();