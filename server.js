const http = require('http');
const fs = require('fs')
const PORT = 3000;
const url = require('url');

const adminControllers = require('./controllers/AdminControllers')
let AdminControllers = new adminControllers()

let handlers = {};


const mimeTypes = {
    "html": "text/html",
    "js": "text/javascript",
    "css": "text/css",
    "jpeg": "image/jpeg",
    "svg": "image/svg+xml",
    "png": "image/png",
    "jpg": "image/jpg"
};

const server = http.createServer((req, res) => {
    const filesDefences = req.url.match(/\.js$|.css$|.jpeg$|.svg$|.png$|.jpg$/);
    if (filesDefences) {
        const extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
        res.writeHead(200, { 'Content-Type': extension });
        fs.createReadStream(__dirname + req.url).pipe(res)
        console.log((__dirname + req.url))
    }else{
        const urlPath = url.parse(req.url,true).pathname;
        let trimPath = urlPath.replace(/^\/+|\/+$/g, '');
        console.log(trimPath);
        let chosenHandler = (typeof (router[trimPath]) !== 'undefined') ? router[trimPath] : handlers.notFound;
        chosenHandler(req, res);
    }
})

server.listen(PORT,()=>{
    console.log(`server running at ${PORT}`);
})

handlers.notFound = (req,res)=>{
    AdminControllers.showNotFound(req,res)
};

handlers.home=(req,res)=>{
    AdminControllers.showHome(req,res)
};

handlers.create=(req,res)=>{
    AdminControllers.createNewDrinks(req,res)
};

handlers.update = (req,res)=>{
    AdminControllers.showUpdateMenu(req,res)
};

handlers.delete = (req,res)=>{
    AdminControllers.deleteDrinks(req,res)
};

handlers.edit = (req,res)=>{
    AdminControllers.editDrinks(req,res)
};

handlers.order = (req,res)=>{
    AdminControllers.orderDrinks(req,res)
}

const router ={
    'home':handlers.home,
    'create':handlers.create,
    '':handlers.home,
    'update':handlers.update,
    'delete1':handlers.delete,
    'edit':handlers.edit,
    'order':handlers.order
}