//Path __dirname fix: https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Express
import express from 'express';
import hbs from 'express-handlebars';

//File management
import * as file from './middleware/mult.js';

//.dotenv
import 'dotenv/config';

//Favicon
import favicon from 'serve-favicon';

//localhost:8080 or localhost:3000
const PORT = process.env.PORT || 3000;

//Express instance
const app = express();

//Setting static dicrectory
app.use(express.static(__dirname + "/public"));

//View Engine via Express-Handlebars
app.engine("hbs", hbs.engine({extname: 'hbs'}));
app.set("view engine", "hbs");
app.set("views", "./views");
app.set("view cache", false);

//Enable JSON reading capability
app.use(express.json());

//Add favicon
app.use(favicon(__dirname + '/public/img/favicons/favicon.ico'));

//Routers
import postNav from './router/posts.js';
import logNav from './router/log.js';
import signupNav from './router/signup.js';
import homeNav from './router/home.js';
import profileNav from './router/profile.js';

//Use Routers
app.use(homeNav);
app.use(postNav);
app.use(logNav);
app.use(signupNav);
app.use(profileNav);

//DB
import { connectToServer } from './db/conn.js';

//Index
app.get('/', (req, res)=>{
    console.log(req.socket.remoteAddress + ": " + req.url);
    res.redirect('/login');
});

//404
app.use((req, res, err) => {
    console.log(req.socket.remoteAddress + ": " + req.url + " [404]");
    res.render("err", {
        title: "Error - Budol Finds",
        errID: "404",
        errMsg: "Nothing to see here..."
    });
});

connectToServer((err)=>{
    if(err){
        console.log(err);
        process.exit;
    }

    //DB ACCESSIBLE
    app.listen(PORT, ()=>{
        console.log("Budol Finds\nListening @ " + PORT);
    });
});