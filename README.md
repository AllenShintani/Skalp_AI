これは[Next.js](https://nextjs.org/)を使用したTypeScript × reactのプロジェクトの開発環境テンプレートです。さああなたも今すぐ快適な新規プロジェクトを始めましょう！


## 何ができるか
・Github Pagesへの簡単なデプロイ
・React × Next.js × TypeScriptの簡単な環境構築
・prettierやlintによるコード整形
他


## 準備
以下のコマンドを打ち込んでください
`git clone -b material https://github.com/konjikun/our-ts-env.git [あなたのリポジトリの名前(以下hogeと呼ぶ)]`

＊[]は外してください


`cd hoge`


`code .`


`git remote set-url origin [hogeのurl]`


`yarn install`


これで準備は完了です！

## 使い方
`yarn dev`

をターミナルに打ち、[http://localhost:3000](http://localhost:3000)を開いてください。あなたの成果物が表示されます。
`pages/index.ts`を編集することで動きが変わることを実験してください。

## 注意点
・npmは使用しないでください。新たなパッケージをインストールをするときはyarnを推奨しています。


・このプロジェクトはstyled-componentsを採用しています。書き方は[こちらの記事](https://tekrog.com/styled-components/#css8220css)を参考にしてください。


・`pages/api`のディレクトリはreactページではなく[API ルート]として扱われます。



## デプロイ
もっとも簡単なデプロイ方法Github pagesです。あなたのGithubのリポジトリのsettingsからSourceをGithub Actionsにしてください。pushするだけでデプロイができるようになります。


materialのbrancheを使用する場合は`.github/workflows/deploy.yml`の6行目`branches: ['master']`を`branches: ['material']に必ず変更して下さい`


##
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.


The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Warnning
・Do not use npm. When installing a new package, yarn is recommended.


・This project employs styled-components. Please refer to [this article](https://styled-components.com/docs/basics) for how to write it.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Github pages

The easiest way to deploy your project is Github pages. you have only to push and done.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
