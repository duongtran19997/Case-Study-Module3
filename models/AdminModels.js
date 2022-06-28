let Database = require('./Database');
const util = require('util');

class AdminModels {
    constructor() {
        this.table = 'adminManager'
        this.conn = Database.connect();
    }

    showMenu() {
        return new Promise((resolve, reject) => {
            let sql = 'select * from adminManager';
            this.conn.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data);
                }
            })
        })
    };


    showDrink(idDrinks) {
        return new Promise((resolve, reject) => {
            let sql = `select * from adminManager where id = ${idDrinks}`;
            this.conn.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data);
                }
            })
        })
    };

    createDrinks(dataHTML) {
        return new Promise((resolve, reject) => {
            let sql = `insert into adminManager (name,type,price)
        values ('${dataHTML.name}','${dataHTML.typeDrinks}','${dataHTML.price}')`;
            this.conn.query(sql, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    };

    deleteDrinksSQL(idDrinks) {
        return new Promise((resolve, reject) => {
            let sqlDelete = `DELETE FROM adminManager WHERE id = ${idDrinks};`;
            this.conn.query(sqlDelete, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    };

    editDrinksSQL(dataHTML, idDrinks) {
        return new Promise((resolve, reject) => {
            let sqlUpdate = `UPDATE adminManager
SET name = '${dataHTML.name}', type = '${dataHTML.typeDrinks}', price = '${dataHTML.price}'
WHERE id = '${idDrinks}';`;
            this.conn.query(sqlUpdate, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }

    createOrder(totalMoneyOrder) {
        // insert into order (oDate,oTotalPrice,eID) values (now(),${totalMoneyOrder},1)
        return new Promise((resolve, reject) => {
            let sqlOrder = `insert into orders (oDate,oTotalPrice,eID) values (now(),${totalMoneyOrder},1);`;
            this.conn.query(sqlOrder, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    };

    findMaxInOrder() {
        return new Promise((resolve, reject) => {
            let sqlOrderMax = `SELECT MAX(oid)  FROM Orders;`
            this.conn.query(sqlOrderMax, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }

    findLastOrder() {
        return new Promise((resolve, reject) => {
            let sqlOrderMax = `select orders.oid,  employee.username,orders.oTotalPrice, orders.odate
                                from employee
                                join orders
                                where employee.eid = orders.eid
                                having (orders.oid) =(select max(orders.oid) from orders);`
            this.conn.query(sqlOrderMax, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }

    createOrderDetails(arr) {
        this.findMaxInOrder().then((data) => {
            // console.log(data[0]['MAX(oid)']);
            return new Promise((resolve, reject) => {
                let sqlOrderDetails = ''
                arr.forEach((item) => {
                    sqlOrderDetails = `insert into orderDetail (oID,id,odQTY) values (${data[0]['MAX(oid)']},${item.itemID},${item.quantity});`;
                    this.conn.query(sqlOrderDetails, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    })
                })
            })
        })
    }


    findProductById(productID) {
        return new Promise((resolve, reject) => {
            let sqlDelete = `SELECT * FROM ${this.table} WHERE id = ${productID};`;
            this.conn.query(sqlDelete, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    };

    showOrders(){
        return new Promise((resolve, reject) => {
            let sql = ' select orders.oid,  employee.username,orders.oTotalPrice, orders.odate from employee join orders where employee.eid = orders.eid';
            // let sql = `// select orderdetail.oid,adminmanager.name,orderdetail.odQTY, adminmanager.price from orderdetail join adminmanager where orderdetail.oid = 7 group by adminmanager.name`
            this.conn.query(sql,(err, data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            })
        })
    };

    showInfoOrder(idOrders){
        return new Promise((resolve, reject) => {
            // let sql = ' select orders.oid,  employee.username,orders.oTotalPrice, orders.odate from employee join orders where employee.eid = orders.eid';
            let sql = `select orderdetail.oid,adminmanager.name,orderdetail.odQTY, adminmanager.price
                         from orderdetail join adminmanager  on adminmanager.id = orderdetail.id
                        where orderdetail.oid = ${idOrders.id} group by adminmanager.name`
            this.conn.query(sql,(err, data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            })
        })
    };

    getUser(){
        return new Promise((resolve, reject) => {
            let sqlUser = 'SELECT username, password FROM manager.employee;'
            this.conn.query(sqlUser,(err, data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            })
        })
    };

    createNewEmployee(newUser){
        return new Promise((resolve, reject) => {
            let sqlNewUser = `insert into employee (username, password) values('${newUser.username}', '${newUser.password}')`
            this.conn.query(sqlNewUser, (err, result) => {
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
    }
}

module.exports = AdminModels