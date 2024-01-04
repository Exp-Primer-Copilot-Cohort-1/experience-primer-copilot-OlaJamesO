// create web server 
var http = require('http');
// create file system object
var fs = require('fs');
// create url object
var url = require('url');
// create query string object
var querystring = require('querystring');
// create template object
var template = require('./lib/template.js');
// create path object
var path = require('path');
// create sanitize-html object
var sanitizeHtml = require('sanitize-html');

// create app object
var app = http.createServer(function(request,response){
    // create variable for request url
    var _url = request.url;
    // create variable for query data
    var queryData = url.parse(_url, true).query;
    // create variable for pathname
    var pathname = url.parse(_url, true).pathname;

    // if pathname is root
    if(pathname === '/') {
        // if queryData id is undefined
        if(queryData.id === undefined) {
            // read data in the directory
            fs.readdir('./data', function(error, filelist){
                // create title
                var title = 'Welcome';
                // create description
                var description = 'Hello, Node.js';
                // create list
                var list = template.list(filelist);
                // create html
                var html = template.HTML(title, list, 
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`
                );
                // print html
                response.writeHead(200);
                response.end(html);
            });
        } else {
            // read data in the directory
            fs.readdir('./data', function(error, filelist){
                // create filteredId
                var filteredId = path.parse(queryData.id).base;
                // read file
                fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
                    // create title
                    var title = queryData.id;
                    // create sanitizedTitle
                    var sanitizedTitle = sanitizeHtml(title);
                    // create sanitizedDescription
                    var sanitizedDescription = sanitizeHtml(description, {
                        allowedTags: ['h1']
                    });
                    // create list
                    var list = template.list(filelist);
                    // create html
                    var html = template.HTML(sanitizedTitle, list,
                        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                        `<a href="/create">create</a>
                        <a href="/update?id=${