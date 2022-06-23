let Database = require('./Database');
const util = require('util');
class AdminModels {
    constructor() {
        this.conn = Database.connect();
    }
    showMenu(){
      return  new Promise((resolve, reject) => {
            let sql = 'select * from adminManager';
            this.conn.query(sql,(err,data)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(data);
                }
            })
        })
    };

    showDrink(idDrinks){
        return  new Promise((resolve, reject) => {
            let sql = `select * from adminManager where id = ${idDrinks}`;
            this.conn.query(sql,(err,data)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(data);
                }
            })
        })
    };

    createDrinks(dataHTML){
        return new Promise((resolve, reject) => {
            let sql =`insert into adminManager (name,type,price)
        values ('${dataHTML.name}','${dataHTML.typeDrinks}','${dataHTML.price}')`;
          this.conn.query(sql,(err,data)=>{
              if(err){
                  reject(err);
              }else{
                  resolve(data);
              }
          })
        })
    };

    deleteDrinksSQL(idDrinks){
        return new Promise((resolve, reject) => {
            let sqlDelete =`DELETE FROM adminManager WHERE id = ${idDrinks};`;
            this.conn.query(sqlDelete,(err,data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            })
        })
    };

    editDrinksSQL(dataHTML,idDrinks){
        return new Promise((resolve, reject) => {
            let sqlUpdate =`UPDATE adminManager
SET name = '${dataHTML.name}', type = '${dataHTML.typeDrinks}', price = '${dataHTML.price}'
WHERE id = '${idDrinks}';`;
            this.conn.query(sqlUpdate,(err,data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            })
        })
    }
}

module.exports = AdminModels