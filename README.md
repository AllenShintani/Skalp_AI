## 準備


ルートとbackendディレクトリで`npm i `を行ってください。
フロントエンドで下記のコマンドを打ち込んでください
```
cp .env.local.example .env.local
cp .env.production.example .env.production
```

backendディレクトリで下記のコマンドを打ってください。
```
cp .env.example .env
cp .env.local.example .env.local
cp hanayama-firebaseadmin.json.example hanayama-firebaseadmin.json
docker-compose up -d
npx prisma generate
npx prisma migrate dev
```

起動はそれぞれのディレクトリで`npm run dev`

## 規約

・function禁止
・interface禁止
・ブランチ名はリリースまでは基本feature/#ISSUE番号
