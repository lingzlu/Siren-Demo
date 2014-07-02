var express = require('express'),
	path = require('path'),
    app = express();

app.use(express.static(path.join(__dirname, 'public')));

if (app.get('env') === 'production') {
	module.exports = app;
} else {
	app.set('port', process.env.PORT || 3000);
	var server = app.listen(app.get('port'), function() {
  	console.log('Express server listening on port ' + server.address().port);
	});
}


