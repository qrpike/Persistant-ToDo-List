
/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	, http = require('http')
	, path = require('path')
	, levelup = require('levelup');
	
	
var db = levelup('./listDB.db');

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

// ^ Express Shit //









var saveToDB = function( listValue, req, res ){
	db.put('list', JSON.stringify(listValue), function(err){
	res.json({ success:true, sessionID:req.sessionID, list:listValue });
	});
}

var getList = function( callback ){
	db.get('list', function(err, list){
	if( list == undefined ){
		var list = [];
	}else{
		list = JSON.parse(list);
	}
	callback( list );
	});
}

// Save a new item to the DB:
app.post('/save', function( req, res ){
	getList( function( list){
	list.push( req.body.item );
	saveToDB( list, req, res );
	});
});

// Get my current ToDo List:
app.get('/mylist', function( req, res ){
	getList( function( list){
	res.json({ "list": list });
	res.end();
	});
});

// Delete an item from the DB:
app.post('/delete', function( req, res ){
	getList( function( list ){
	var itemNumber = list.indexOf( req.body.item );
	list.splice( itemNumber, 1 );
	saveToDB( list, req, res );
	});
})







// Listen for HTTP Requests:
http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
