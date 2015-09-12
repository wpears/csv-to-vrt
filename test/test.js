
var test = require('tape');
var fs = require('fs');
var path = require('path');
var csvToVrt = require('../index');

test('csvToVrt tests', function(t){
  t.plan(4);

  csvToVrt('test/virginia.csv', 'NAD83', function(err, file){
    t.ok(file, 'Creates vrt from valid csv.'); 
  })

  csvToVrt('test/false.csv', 'NAD83', function(err, file){
    t.ok(err, 'Error when can\'t resolve header names.');
  })

  csvToVrt(null, 'NAD83', function(err, file){
    t.ok(err, 'Error when no csv file name.');
  })

  csvToVrt('test/virginia.csv', '', function(err, file){
    t.ok(err, 'Error when no spatial reference.');
  })

})
