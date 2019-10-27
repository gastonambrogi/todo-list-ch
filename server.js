var express = require('express')
var path = require('path')

var pathBuild = './dist/'
var public = path.join(__dirname, pathBuild)

var app = express()

app.use(express.static(pathBuild))
app.use((req, res) => res.sendFile(path.join(public, 'index.html')))

app.listen(3000)