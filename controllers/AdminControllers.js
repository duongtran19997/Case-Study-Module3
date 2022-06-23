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
                        html += `<td><a href="/delete1?id=${value.id}">delete</a></td>`
                        html += `<td><a href="/edit?id=${value.id}">fix</a></td>`
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
            console.log('2')
            let result = AdminModels.deleteDrinksSQL(idDrinks.id).then(dataDB => {
                res.writeHead(301, {Location: 'http://localhost:3000/'})
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
            let data=''
            req.on('data',chunk=>{
                data+= chunk;
            })
            req.on('end',()=>{
                let dataHTML = qs.parse(data);
                console.log(dataHTML,idDrinks.id);
                AdminModels.editDrinksSQL(dataHTML,idDrinks.id).then(dataDB=>{
                    res.writeHead(301, {Location:'http://localhost:3000/'})
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
                console.log(dataHTML);
                let result = AdminModels.createDrinks(dataHTML).then(dataBS => {
                    res.writeHead(301, {Location: 'http://localhost:3000/'})
                    return res.end();
                })
            })
            req.on('error', () => {
                console.log('error')
            })
        }
    };

    orderDrinks(req,res){
        if(req.method === 'GET'){
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
                            html += `<td><input type="text" name="quantity"></td>`
                            html += '</tr>'
                        })
                        data = data.replace('{list-drinks}', html);
                        res.writeHead(200, 'success', {'content-type': 'text/html'})
                        res.write(data);
                        return res.end();
                    }
                })
            })
        }else{

        }
    }
}

module.exports = AdminControllers