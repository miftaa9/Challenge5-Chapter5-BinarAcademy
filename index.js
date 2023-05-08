// import atau panggil package yang kita mau pake di aplikasi kita
const express = require('express');

// untuk baca public directory
const path =require("path");

// framework utk http server
const app = express();
const PORT = 3000;

// middleware, untuk baca json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require('./routes');

// setting view engine
app.set("views", __dirname +"/views");
app.set("view engine", "ejs");

// public
app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "controller")))

app.get('/', (req, res) => {
    res.render("index", {
        name : "Mifta",
        status : 'single',
        title : 'FSW 3'
    })
})

app.use(routes);

// memulai server nya
app.listen(PORT, () => {
    console.log(`App running on Localhost: ${PORT}`)
})