const fs = require('fs');
const qs = require('qs');
const adminModels = require('../models/AdminModels');
const AdminModels = new adminModels()

class AdminControllers {
    showNotFound(req, res) {
        fs.readFile('./views/not-found.html', 'utf-8', (err, data) => {
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
                        html += `<td>${index +1}</td>`
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
            req.on('error',()=>{
                console.log('error')
            })
        }
    }
}

module.exports = AdminControllers