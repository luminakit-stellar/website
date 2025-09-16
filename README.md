# 🌟 LumenKit Demo

Este é um aplicativo React de demonstração que mostra como integrar a biblioteca [LumenKit](https://lumenkit.dev) para conectar com carteiras Stellar.

## 🚀 Funcionalidades

- **Conexão com múltiplas carteiras Stellar**: Freighter, Albedo, Rabet, Lobstr, xBull, Hana, HotWallet, Klever
- **Seleção de rede**: Testnet e Mainnet
- **Assinatura de mensagens**: Demonstra como assinar mensagens personalizadas
- **Assinatura de transações**: Exemplo de como assinar transações XDR
- **Interface moderna**: UI responsiva e intuitiva
- **Gerenciamento de estado**: Controle completo do estado de conexão

## 📦 Instalação

1. **Clone o repositório**:
   ```bash
   git clone <repository-url>
   cd demo-lumenkit
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Certifique-se de que a biblioteca LumenKit está construída**:
   ```bash
   cd ../lumenkit
   npm run build
   cd ../demo-lumenkit
   ```

## 🛠️ Desenvolvimento

Para executar o projeto em modo de desenvolvimento:

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`.

## 🏗️ Build

Para construir o projeto para produção:

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`.

## 📚 Como Usar

### 1. Conectar Carteira

1. Clique no botão "Conectar Carteira"
2. Selecione uma das carteiras disponíveis no modal
3. Autorize a conexão na sua carteira
4. O endereço será exibido na interface

### 2. Assinar Mensagem

1. Conecte uma carteira primeiro
2. Digite uma mensagem personalizada no campo de texto
3. Clique em "Assinar Mensagem"
4. Autorize a assinatura na sua carteira
5. A mensagem assinada será exibida

### 3. Assinar Transação

1. Conecte uma carteira primeiro
2. Clique em "Assinar Transação (Demo)"
3. Autorize a assinatura na sua carteira
4. A transação assinada será exibida

## 🔧 Configuração

### Redes Suportadas

- **Testnet**: Rede de teste do Stellar
- **Mainnet**: Rede principal do Stellar

### Carteiras Suportadas

- **Freighter**: Extensão para navegadores
- **Albedo**: Aplicação web
- **Rabet**: Extensão para navegadores
- **Lobstr**: Aplicação móvel e web
- **xBull**: Aplicação móvel
- **Hana**: Aplicação móvel
- **HotWallet**: Aplicação web
- **Klever**: Aplicação móvel

## 🎨 Personalização

### Temas

O aplicativo usa temas personalizados para o modal e botões:

```typescript
const modalTheme: IModalTheme = {
  ...ModalThemes.dark,
  backgroundColor: '#1a1a1a',
  accentColor: '#646cff',
};

const buttonTheme: IButtonTheme = {
  ...ButtonThemes.dark,
  backgroundColor: '#646cff',
  textColor: '#ffffff',
};
```

### Módulos

Você pode adicionar ou remover módulos de carteira conforme necessário:

```typescript
const modules = [
  new FreighterModule(),
  new AlbedoModule(),
  new RabetModule(),
  new LobstrModule(),
  new XBullModule(),
  new HanaModule(),
  new HotWalletModule(),
  new KleverModule(),
];
```

## 📖 Documentação da LumenKit

Para mais informações sobre a biblioteca LumenKit, consulte:

- [Documentação oficial](https://lumenkit.dev)
- [Repositório GitHub](https://github.com/luminakit-stellar/lumenkit)
- [NPM Package](https://www.npmjs.com/package/@lumenkit/stellar-wallets)

## 🐛 Solução de Problemas

### Carteira não aparece no modal

- Verifique se a extensão da carteira está instalada
- Recarregue a página
- Verifique se a carteira está desbloqueada

### Erro de conexão

- Verifique sua conexão com a internet
- Certifique-se de que está usando a rede correta (Testnet/Mainnet)
- Tente desconectar e reconectar a carteira

### Erro de assinatura

- Verifique se a carteira está desbloqueada
- Certifique-se de que tem XLM suficiente para as taxas de transação
- Verifique se a transação é válida

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [LumenKit](https://lumenkit.dev) - Biblioteca para integração com carteiras Stellar
- [Stellar Development Foundation](https://stellar.org) - Plataforma blockchain
- Comunidade Stellar - Suporte e feedback
