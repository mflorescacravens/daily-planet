const express = require('express');
const app = express();
const layouts = require('express-ejs-layouts');
const fs = require('fs');
const PORT = 3000;
const methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.use(layouts);
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));

app.get('/', function(req, res) {
    res.render('index')
});

app.get('/articles', function(req, res) {
    var articles = fs.readFileSync('./articles.json');
    var articleData = JSON.parse(articles);
    res.render('articles/index', {articleData})
});

app.get('/articles/new', function(req, res) {
    res.render('articles/new')
});

app.get('/articles/:id/edit', function(req, res) {
    let article = fs.readFileSync('./articles.json');
    let articleData = JSON.parse(article);
    let id = parseInt(req.params.id);
    res.render('articles/edit', {article: articleData[id], id});
});

app.get('/articles/:id', function(req, res) {
    var articles = fs.readFileSync('./articles.json');
    var articleData = JSON.parse(articles);
    var id = parseInt(req.params.id);
    res.render('articles/show', {article: articleData[id]});
});



// need form routes for the articles? New ejs is form
// post route

app.post('/articles', function(req, res) {
    let articles = fs.readFileSync('./articles.json');
    let articleData = JSON.parse(articles);
    let newArticle = {
        title: req.body.articleTitle,
        body: req.body.articleBody
    }
    articleData.push(newArticle);
    fs.writeFileSync('./articles.json', JSON.stringify(articleData));
    
    res.redirect('/articles');
});

app.delete('/articles/:id', function(req, res) {
    let articles = fs.readFileSync('./articles.json');
    let articleData = JSON.parse(articles);
    var id = parseInt(req.params.id);
    articleData.splice(id,1);
    var articleString = JSON.stringify(articleData);
    fs.writeFileSync('./articles.json', articleString);
    res.redirect('/articles');
})

app.put('/articles/:id', function(req, res) {
    let articles = fs.readFileSync('./articles.json');
    let articleData = JSON.parse(articles);
    var id = parseInt(req.params.id);
    articleData[id].title = req.body.articleTitle;
    articleData[id].body = req.body.articleBody;
    fs.writeFileSync('./articles.json', JSON.stringify(articleData));
    res.redirect('/articles/' + id);
})





app.listen( PORT || 3000 );