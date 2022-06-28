const fs = require('fs');
const qs = require('qs');
const adminModels = require('../models/AdminModels');
const url = require("url");
const AdminModels = new adminModels()

class AdminControllers {
    showNotFound(req, res) {
        fs.readFile('./views/404.html', 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                res.writeHead(404, 'success', {'content-type': 'text/html'});
                res.write(data);
                res.end();
            }
        })
    };

    showHome(req, res) {
        let result = AdminModels.showMenu().then(dataBS => {
            fs.readFile('./views/index.html', 'utf-8', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    let html = '';
                    dataBS.forEach((value, index) => {
                        html += '<tr>'
                        html += `<td>${index + 1}</td>`
                        html += `<td>${value.name}</td>`
                        html += `<td>${value.type}</td>`
                        html += `<td>${value.price}</td>`
                        html += '</tr>'
                    })
                    data = data.replace('{list-drinks}', html);
                    res.writeHead(200, 'success', {'content-type': 'text/html'})
                    res.write(data);
                    return res.end();
                }
            })
        })
    };

    showUpdateMenu(req, res) {
        let update = AdminModels.showMenu().then(dataBS => {
            fs.readFile('./views/index.html', 'utf-8', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    let html = '';
                    dataBS.forEach((value, index) => {
                        html += '<tr>'
                        html += `<td>${index + 1}</td>`
                        html += `<td>${value.name}</td>`
                        html += `<td>${value.type}</td>`
                        html += `<td>${value.price}</td>`
                        html += `<td><a href="/delete1?id=${value.id}" class="btn btn-danger" >delete</a></td>`
                        html += `<td><a href="/edit?id=${value.id}" class="btn btn-info" >fix</a></td>`
                        html += '</tr>'
                    })
                    data = data.replace('{list-drinks}', html);
                    res.writeHead(200, 'success', {'content-type': 'text/html'})
                    res.write(data);
                    return res.end();
                }
            })
        })
    };

    deleteDrinks(req, res) {
        let idDrinks = url.parse(req.url, true).query;
        // console.log('2')
        let result = AdminModels.deleteDrinksSQL(idDrinks.id).then(dataDB => {
            res.writeHead(301, {Location: 'http://localhost:3000/home'})
            res.end()
        })
    }

    editDrinks(req, res) {
        let idDrinks = url.parse(req.url, true).query;
        if (req.method === 'GET') {
            fs.readFile('./views/edit.html', 'utf-8', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    AdminModels.showDrink(idDrinks.id).then(result => {
                        // console.log(result);
                        data = data.replace('{input_name}', result[0].name);
                        data = data.replace('{input_price}', result[0].price);
                        data = data.replace(`<option value="${result[0].type}">${result[0].type}</option>`, `<option value="${result[0].type}" selected>${result[0].type}</option>`);
                        res.writeHead(200, 'success', {'content-type': 'text/html'})
                        res.write(data)
                        res.end();
                    }).catch(err => {
                        console.log(err);
                    })
                }
            })
        } else {
            let data = ''
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', () => {
                let dataHTML = qs.parse(data);
                AdminModels.editDrinksSQL(dataHTML, idDrinks.id).then(dataDB => {
                    res.writeHead(301, {Location: 'http://localhost:3000/home'})
                    return res.end();
                })
            })
        }
    };

    createNewDrinks(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/create.html', "utf-8", (err, data) => {
                if (err) {
                    console.log(err);
                }
                res.writeHead(200, 'success', {'content-type': 'text/html'});
                res.write(data)
                res.end()
            })
        } else {
            let data = ''
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                let dataHTML = qs.parse(data);
                let result = AdminModels.createDrinks(dataHTML).then(dataBS => {
                    res.writeHead(301, {Location: 'http://localhost:3000/home'})
                    return res.end();
                })
            })
            req.on('error', () => {
                console.log('error')
            })
        }
    };

    orderDrinks(req, res) {
        if (req.method === 'GET') {
            AdminModels.showMenu().then(dataBS => {
                fs.readFile('./views/order.html', 'utf-8', (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let html = '';
                        dataBS.forEach((value, index) => {
                            html += '<tr>'
                            html += `<td>${index + 1}</td>`
                            html += `<td>${value.name}</td>`
                            html += `<td>${value.type}</td>`
                            html += `<td>${value.price}</td>`
                            html += `<td><input type="text" name="${value.id}" id="${value.id}" value="0"></td>`
                            html += '</tr>'
                        })
                        data = data.replace('{list-drinks}', html);
                        res.writeHead(200, 'success', {'content-type': 'text/html'})
                        res.write(data);
                        return res.end();
                    }
                })
            })
        } else {
            let data = '';
            req.on('data', chunk => {
                data += chunk
            });
            req.on('end', async () => {
                fs.readFile('./views/bill.html', 'utf-8', async (err, data1) => {
                    let dataOrder = qs.parse(data);
                    let arr = [];
                    let totalMoneyOrder = 0;
                    for (let [key, value] of Object.entries(dataOrder)) {
                        if (value != 0) {
                            let product = await AdminModels.findProductById(key)

                            let object = {
                                itemID: product[0].id,
                                quantity: Number(value),
                                totalMoney: product[0].price * Number(value)
                            }
                            totalMoneyOrder += product[0].price * Number(value)
                            arr.push(object)
                        }
                    }
                    // console.log(arr);
                    // console.log(totalMoneyOrder);
                    let order = await AdminModels.createOrder(totalMoneyOrder);
                    let orderDetail = await AdminModels.createOrderDetails(arr)
                    let printOrder = await AdminModels.findLastOrder().then(data => {
                        // console.log(data[0]);
                        // data1 = data1.replace('{order-id}', data[0]['oid'])
                        // data1 = data1.replace('{employee-name}', data[0]['username'])
                        // data1 = data1.replace('{total-price}', data[0]['oTotalPrice'])
                        // data1 = data1.replace('{date}', data[0]['odate'])
                        // res.writeHead(200, 'success', {'content-type': 'text/html'})
                        res.writeHead(301, 'success', {Location: 'http://localhost:3000/total-orders'})
                        // res.write(data1);
                        return res.end();
                    })

                })

            })
        }
    };

    async totalOrdersForm(req, res) {
        if (req.method === 'GET') {
            let results = await AdminModels.showOrders().then(dataBS => {
                // console.log(dataBS);
                let html = '';
                fs.readFile('./views/bill.html', 'utf-8', (err, data1) => {
                    if (err) {
                        console.log(err);
                    } else {
                        dataBS.forEach((value, index) => {
                            html += '<tr>'
                            html += `<td>${value['oid']}</td>`
                            html += `<td>${value['username']}</td>`
                            html += `<td>${value['oTotalPrice']}</td>`
                            html += `<td>${value['odate']}</td>`
                            html += `<td><td><a href="/totalorders?id=${value['oid']}" class="btn btn-info" >Check Infor</a></td></td>`
                            html += '</tr>'
                        })
                        data1 = data1.replace('{list-bills}', html);
                        res.writeHead(200, 'success', {'content-type': 'text/html'})
                        res.write(data1);
                        return res.end();
                    }
                })
            })
        }
    }

    async moreInfoOrderForm(req, res) {
        let html = '';
        let idOrders = url.parse(req.url, true).query;
        // console.log('alo'+ idOrders.id);
        let result = await AdminModels.showInfoOrder(idOrders).then(dataBS => {
            fs.readFile('./views/billInfo.html', 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                }else{
                    dataBS.forEach(value => {
                        console.log(value);
                        html += '<tr>'
                        html += `<td>${value['oid']}</td>`
                        html += `<td>${value['name']}</td>`
                        html += `<td>${value['odQTY']}</td>`
                        html += `<td>${value['price']}</td>`
                        html += '</tr>'
                    })
                    data = data.replace('{list-bills}', html);
                    res.writeHead(200, 'success', {'content-type': 'text/html'})
                    res.write(data);
                    return res.end();
                }
            })
        })
    }

    loginForm(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/login.html', 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(data);
                    res.end();
                }
            })
        } else {
            let data = ''
            req.on('data', chunk => {
                data += chunk
            })
            req.on('end', async () => {
                let user = qs.parse(data);
                console.log(user['username']);
                let result = await AdminModels.getUser().then(dataBS => {
                    dataBS.forEach(userBS => {
                        if (userBS.username == user['username'] && userBS.password == user['password']) {
                            res.writeHead(301, {Location: 'http://localhost:3000/home'});
                            res.end()
                        } else {
                            let wrongPass = '<div id="wrong" style="color: red">Your account is wrong</div>'
                            fs.readFile('./views/login.html', 'utf8', function (err, data) {
                                data = data.replace('<div id="wrong"></div>', wrongPass)
                                res.writeHead(200, 'success', {'content-type': 'text/html'});
                                res.write(data)
                                res.end()
                            })

                        }
                    })
                })
            })
        }
    }

    registerForm(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/register.html', 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(data);
                    res.end();
                }
            })
        }else{
            let data = ''
            req.on('data',chunk=>{
                data += chunk
            })
            req.on('end',async()=>{
                let newUser = qs.parse(data);
                console.log(newUser)
                await AdminModels.createNewEmployee(newUser).then(dataBS=>{
                    res.writeHead(301, {Location: 'http://localhost:3000/login'})
                    return res.end();
                })
            })
        }
    }
}

module.exports = AdminControllers