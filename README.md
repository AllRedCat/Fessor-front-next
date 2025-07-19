# Fessor - Plataforma de Relatórios Escolares

Fessor é uma plataforma SaaS desenvolvida para professores gerarem relatórios escolares de forma eficiente e profissional, utilizando inteligência artificial para formatar e estruturar as informações.

## 🚀 Funcionalidades

### Para Professores
- **Geração de Relatórios**: Formulário completo para inserir informações do aluno e ocorrido
- **Processamento com IA**: Relatórios formatados automaticamente pela inteligência artificial
- **Histórico Completo**: Visualização de todos os relatórios gerados
- **Download em PDF**: Exportação dos relatórios em formato PDF
- **Gerenciamento de Perfil**: Edição de informações pessoais e senha

### Sistema de Planos
- **Plano Gratuito**: 5 relatórios por mês
- **Plano Premium**: 100 relatórios por mês com recursos avançados

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React, TypeScript
- **Estilização**: Tailwind CSS
- **Autenticação**: Sistema próprio com cookies
- **Estado**: React Context API
- **Roteamento**: Next.js App Router

## 📁 Estrutura do Projeto

```
app/
├── (auth)/                 # Páginas de autenticação
│   ├── login/
│   └── register/
├── (page)/                 # Páginas principais
│   ├── home/              # Geração de relatórios
│   ├── history/           # Histórico de relatórios
│   └── profile/           # Perfil do usuário
├── components/            # Componentes reutilizáveis
│   └── navigation.tsx     # Navegação principal
├── lib/                   # Utilitários e configurações
│   └── api.ts            # Funções da API
├── providers/            # Context providers
│   ├── auth-provider.tsx # Autenticação
│   ├── theme-provider.tsx
│   └── sidebar-provider.tsx
└── layout.tsx            # Layout principal
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ ou Bun
- Backend da API rodando (configurado em `app/lib/api.ts`)

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd Fessor-front-next
```

2. Instale as dependências:
```bash
npm install
# ou
bun install
```

3. Configure as variáveis de ambiente:
```bash
# Crie um arquivo .env.local
NEXT_PUBLIC_API_URL=http://localhost:5005
```

4. Execute o projeto:
```bash
npm run dev
# ou
bun dev
```

5. Acesse `http://localhost:3000`

## 📋 Endpoints da API

### Autenticação
- `POST /auth/login` - Login do usuário
- `POST /auth/logout` - Logout do usuário
- `GET /api/me` - Obter dados do usuário logado
- `POST /api/Users` - Registro de novo usuário

### Relatórios
- `POST /api/reports` - Criar novo relatório
- `GET /api/reports` - Listar relatórios do usuário
- `GET /api/reports/:id` - Obter relatório específico
- `GET /api/reports/:id/download` - Download do relatório em PDF

### Perfil
- `GET /api/profile` - Obter perfil do usuário
- `PUT /api/profile` - Atualizar perfil do usuário

### Assinatura
- `POST /api/subscription/upgrade` - Fazer upgrade do plano
- `GET /api/subscription` - Obter informações da assinatura
- `POST /api/subscription/cancel` - Cancelar assinatura

## 🎨 Interface do Usuário

### Página Home (/home)
- Formulário completo para inserção de dados do aluno
- Campos para informações do ocorrido
- Validação de campos obrigatórios
- Feedback visual de sucesso/erro

### Página Histórico (/history)
- Lista de todos os relatórios gerados
- Status de processamento (Processando/Concluído/Erro)
- Modal para visualização detalhada
- Download de relatórios concluídos

### Página Perfil (/profile)
- Edição de informações pessoais
- Alteração de senha
- Visualização do plano atual
- Upgrade para plano premium
- Logout da conta

## 🔐 Autenticação e Segurança

- Sistema de autenticação baseado em cookies
- Rotas protegidas automaticamente
- Redirecionamento automático baseado no status de autenticação
- Validação de formulários no frontend e backend

## 📱 Responsividade

- Design responsivo para desktop, tablet e mobile
- Menu mobile com navegação otimizada
- Formulários adaptáveis para diferentes tamanhos de tela

## 🎯 Próximos Passos

- [ ] Implementar notificações em tempo real
- [ ] Adicionar templates de relatórios personalizáveis
- [ ] Sistema de backup automático
- [ ] Integração com sistemas escolares
- [ ] Dashboard com estatísticas
- [ ] Sistema de colaboração entre professores

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para suporte@fessor.com ou abra uma issue no repositório.
