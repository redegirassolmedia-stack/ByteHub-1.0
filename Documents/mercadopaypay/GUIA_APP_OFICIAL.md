# Guia para Publicação em Lojas Oficiais (App Store & Google Play)

Para transformar o projeto atual em um aplicativo oficial e publicá-lo nas lojas, o caminho recomendado é utilizar o **Capacitor**.

## 1. Preparação Técnica (Nativo)

O Capacitor permite "empacotar" seu código web (Vite/React) em um container nativo que roda no iOS e Android.

### Passos técnicos:
1.  **Instalação**: Adicionar o Capacitor ao projeto (`npm install @capacitor/core @capacitor/cli`).
2.  **Configuração**: Inicializar o Capacitor (`npx cap init`).
3.  **Plataformas**: Adicionar as plataformas desejadas (`npx cap add android`, `npx cap add ios`).
4.  **Build**: Rodar o comando de build do Vite e sincronizar com o Capacitor (`npm run build && npx cap copy`).

## 2. Contas de Desenvolvedor (Custo)

Para publicar nas lojas oficiais, você precisa de contas corporativas ou individuais:

-   **Google Play Store**: Taxa única de **$25 USD**. A conta é sua para sempre.
-   **Apple App Store**: Assinatura anual de **$99 USD**. Precisas renovar todos os anos para manter o app na loja.

## 3. Requisitos de Submissão

Ambas as lojas exigem Assets (Ativos Reais) e Informações Jurídicas:

-   **Ícones e Splash Screens**: É necessário gerar ícones em vários tamanhos específicos para cada dispositivo.
-   **Imagens de Divulgação (Screenshots)**: É necessário tirar prints de alta qualidade para as páginas das lojas.
-   **Política de Privacidade**: Já começamos em `/privacidade`, mas para as lojas ela precisa estar publicada em um link público (URL).
-   **Classificação Etária**: Você precisará responder a um questionário sobre o conteúdo do app.

## 4. Diferenças entre PWA e App Oficial

| Característica | PWA (Atual) | App Oficial (Lojas) |
| :--- | :--- | :--- |
| **Download** | Via Navegador | Via Loja (App Store/Play Store) |
| **Notificações** | Limitadas (iOS lento) | Push Notifications Integradas |
| **Confiança** | Moderada | Alta (Selo da Loja) |
| **Custo** | Grátis | $25 (Google) / $99/ano (Apple) |

---

> [!TIP]
> **Recomendação**: Como você já tem a base web pronta e funcionando com PWA, o próximo passo seria integrar o **Capacitor** para gerar os arquivos `.apk` (Android) e `.ipa` (iOS). 

**Eu posso te ajudar com a configuração inicial do Capacitor se você desejar começar esse processo agora!**
