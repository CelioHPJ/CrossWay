# 🛍️ Crossway - E-commerce Full-Stack

Um e-commerce completo de roupas desenvolvido com foco na experiência do usuário e em uma gestão de inventário segura. O sistema conta com vitrine dinâmica, autenticação de usuários e um painel administrativo protegido para o controle do catálogo de produtos.

## ✨ Funcionalidades

* **Autenticação e Segurança:** Login e cadastro de usuários com controle de sessão.
* **Controle de Acesso (RBAC):** Rotas protegidas verificando a *role* do usuário. Apenas contas com nível de `ADMIN` conseguem acessar o painel de controle.
* **Gestão de Catálogo (Admin):** Interface completa para criar, editar e excluir produtos, incluindo o gerenciamento de variações (tamanhos/cores) e controle de estoque.
* **Navegação Dinâmica:** As páginas de categorias leem os parâmetros da URL para buscar e renderizar produtos específicos diretamente do banco de dados relacional.
* **Tratamento de Erros:** Sistema robusto de *fallbacks* e loadings dinâmicos para garantir que falhas de rede não quebrem a experiência do cliente.

## 🚀 Tecnologias Utilizadas

**Frontend:**
* **React** (Componentização, Context API para estado global de autenticação)
* **Vite** (Build tool e servidor de desenvolvimento rápido)
* **React Router** (Navegação SPA e rotas dinâmicas)
* **Tailwind CSS** (Estilização utilitária e design responsivo)
* **Lucide React** (Ícones)

**Backend as a Service (BaaS) & Banco de Dados:**
* **Supabase** (PostgreSQL)
* **Supabase Auth** (Gerenciamento de usuários)
* **Row Level Security (RLS)** (Políticas de segurança aplicadas diretamente nas tabelas do banco)

## 🗄️ Estrutura do Banco de Dados

O banco de dados relacional foi desenhado para escalabilidade, utilizando o modelo de relacionamento entre produtos e categorias:

* `profiles`: Armazena dados extras dos usuários e define a role (`CUSTOMER` ou `ADMIN`).
* `categories`: Gerencia as categorias da loja (id, name, slug).
* `products`: Catálogo central com chave estrangeira (`category_id`) referenciando a tabela de categorias.

## ⚙️ Como rodar o projeto localmente

Siga os passos abaixo para testar o projeto na sua máquina:

1. **Clone o repositório**
   ```bash
    git clone https://github.com/CelioHPJ/crest-clothing.git

2. **Acesse a pasta do frontend**
   ```bash
    cd crest-clothing/frontend

3. **Instale as dependências**
   ```bash
    npm install

4. **Configure as Variáveis de Ambiente**
   
    Dentro da pasta `frontend`, crie um arquivo chamado `.env.local` e adicione suas chaves do Supabase:
    ```bash
    VITE_SUPABASE_URL=sua_url_do_supabase
    VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

5. **Inicie o servidor de desenvolvimento**
   ```bash
    npm run dev

---
*Desenvolvido por [Célio Henrique](https://github.com/CelioHPJ).*
