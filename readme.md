# GorillaFund-Backend
This repository is backend of gorilla fund.

## Usage

1. Rename `.env.example` file to `.env`
2. Config `.env` file.
3. Install node_modules 
``` 
npm install
```
4. Config `config\db.js` file.
5. Create database.
```
npx sequelize-cli db:create
```
6. Create table.
```
npx sequelize-cli db:migrate
```
7. Fill data to table.
```
npx sequelize-cli db:seed:all
```