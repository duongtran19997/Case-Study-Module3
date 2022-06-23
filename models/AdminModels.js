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
    }
}

module.exports = AdminModels