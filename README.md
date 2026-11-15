# BusSP — Aplicativo de Transporte Público

## Sobre o projeto

O BusSP é um aplicativo desenvolvido em React Native com Expo e TypeScript para facilitar a consulta de linhas de ônibus da cidade de São Paulo.

O projeto foi desenvolvido como atividade acadêmica da FIAP, na disciplina de Cross-Platform Application Development.

## Funcionalidades

- Tela inicial com apresentação do aplicativo.
- Pesquisa de linhas de ônibus.
- Modo de demonstração com linhas simuladas.
- Integração com a API Olho Vivo da SPTrans, dependente de autenticação válida.
- Adição e remoção de linhas favoritas.
- Armazenamento local dos favoritos utilizando AsyncStorage.
- Consulta de posições simuladas de ônibus.
- Visualização dos veículos em um mapa.

## Tecnologias utilizadas

- React Native
- Expo
- TypeScript
- Node.js
- Express
- AsyncStorage
- React Native Maps
- API Olho Vivo — SPTrans

## Estrutura do projeto

```text
BusSP/
├── backend/
│   ├── server.js
│   └── .env.example
├── src/
│   ├── app/
│   │   ├── index.tsx
│   │   ├── explore.tsx
│   │   └── posicoes.tsx
│   └── components/
│       └── app-tabs.tsx
├── package.json
└── README.md
```

## Como executar

### 1. Instalar as dependências do aplicativo

Na pasta principal do projeto:

```bash
npm install
```

### 2. Instalar as dependências do backend

```bash
cd backend
npm install
```

### 3. Configurar o token

Criar o arquivo `backend/.env` com:

```env
SPTRANS_TOKEN=SEU_TOKEN_AQUI
```

### 4. Iniciar o backend

Dentro da pasta `backend`:

```bash
node server.js
```

### 5. Iniciar o aplicativo

Em outro terminal, na pasta principal do projeto:

```bash
npx expo start
```

Abrir o aplicativo utilizando o Expo Go.

Para acessar o backend pelo celular, configurar o endereço IPv4 do computador nos arquivos do aplicativo que realizam requisições.

O computador e o celular devem estar na mesma rede Wi-Fi.

## Observações

A API Olho Vivo da SPTrans exige autenticação. Como a autenticação não foi concluída com sucesso durante o desenvolvimento, o projeto oferece um modo de demonstração.

As posições dos ônibus apresentadas no mapa são simuladas e não representam o rastreamento em tempo real.

## Integrantes

- Nome: Pietro Visconti Bueno de Mello — RM: 567673
- Nome: Caio Moda Barbieri — RM: 566747
- Nome: Victor Puglia Neves — RM: 567854

## Repositório

https://github.com/pietrovisconti522/BusSP
