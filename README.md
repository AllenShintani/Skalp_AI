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
cp skalp.json.example skalp.json
docker-compose up -d
npx prisma generate
npx prisma migrate dev
npm run dev
```

起動はそれぞれのディレクトリで`npm run dev`
