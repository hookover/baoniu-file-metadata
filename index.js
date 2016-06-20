var express = require('express');
var app = express();
var path = require('path');
var util = require('util');
var multer = require('multer');
var upload = multer({dest: path.join(__dirname+'/uploads/')});
var fs = require('fs');

app.set('port', (process.env.PORT || 5000));
app.set( 'view engine', 'html' );
app.set('views', require('path').join(__dirname, 'views'));
app.engine( '.html', require( 'ejs' ).__express );
app.use(express.static(require('path').join(__dirname, 'public')));
app.use(express.static(require('path').join(__dirname, 'uploads')));


app.get('/', function(request , response) {
    response.render('pages/index', {host_domain: request.protocol + '://' + request.get('host')});
});
app.get('/post', function (req, res) {
   res.send('please use post method');
});
app.get('/uploads/:image(*)', function (req, res) {
    var filepath = path.join(__dirname + '/uploads/' + req.params.image);
    fs.exists(path.join(__dirname + '/uploads/' + req.params.image), function (exists) {
        if(exists) {
            res.sendfile(filepath);
        } else {
          res.send(404);
        }
    });
});
app.post('/post', upload.array('uploads[]', 12), function (req, res, next) {
    if(!req.files) {
        res.send({error: 1});
        return;
    }
    var output = [];
    for (var i = 0; i < req.files.length; i++) {
        fs.rename(req.files[i].path, req.files[i].destination + req.files[i].originalname, function (err) {
            if(err){
                console.log(err);
            } else {
                console.log('ok');
            }
        });
        output.push({
            name: req.files[i].originalname,
            encoding: req.files[i].encoding,
            mimetype: req.files[i].mimetype,
            size: req.files[i].size,
            sizeKB: Math.round(req.files[i].size * 100 / 1024) / 100 + 'KB',
            url: req.protocol + '://' + req.get('host') + '/uploads/'+req.files[i].originalname
        });
    }
    res.send(output);
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


