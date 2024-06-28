## 技術スタック

・フレームワーク： Trpc


・フロントエンド： React, Next.js, 


・バックエンド: Fastify


DB, ORM： MySQL, Prisma


## 準備
下記のコマンドを打ち込んでください。


`git clone git@github.com:AllenShintani/Skalp_AI.git`


`npm i`

次は`frontend`ディレクトリに移動しで下記のコマンドを打ち込んでください
```
cd frontend
npm i
cp .env.local.example .env.local
cp .env.production.example .env.production
npm run dev
```

backendディレクトリでコマンドを打ってください。
```
cd ../backend
cp .env.example .env
cp .env.local.example .env.local
cp skalpai-firebase-adminsdk.json.example skalpai-firebase-adminsdk.json
docker-compose up -d
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

起動はそれぞれのディレクトリで`npm run dev`


## PRを出す時
・ISSUEテンプレートを参考にしてください。


・手元でQA.mdのテスト項目を試してからPRを出してください
