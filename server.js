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
    "css": "text/css"
};

const server = http.createServer((req, res) => {
    const filesDefences = req.url.match(/\.js|.css/);
    if (filesDefences) {
        const extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
        res.writeHead(200, { 'Content-Type': extension });
        fs.createReadStream(__dirname + "/"+ req.url).pipe(res)
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
}

const router ={
    'home':handlers.home,
    'create':handlers.create,
    '':handlers.home
}