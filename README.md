## Intructions

### Environment variables

Add to .env file the following variables:

```
DATABASE_URL="postgresql://${user}:${passowrd}@${host:por}/${dbname}"
```

### Running app in dev

1️⃣ Install dependencies: `npm install`  
2️⃣ Run migrations (small changes): `npx prisma migrate dev`  
3️⃣ Generate prisma client: `npx prisma generate`  
4️⃣ Start the app: `next dev --turbopack`

### Running app in prod

1️⃣ Install dependencies: `npm install`  
2️⃣ Run migrations (small changes): `npx prisma migrate dev`  
3️⃣ Generate prisma client: `npx prisma generate`  
4️⃣ Build the app: `next build`  
5️⃣ Start the app: `next start`
