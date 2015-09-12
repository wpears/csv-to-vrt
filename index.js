var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
var util = require('util');

var readUntil = require('read-until');

var latNames = {
  latitude: 1,
  lat: 1,
  lat_dd: 1,
  lat_y: 1,
  y: 1
}

var lonNames = {
  longitude: 1,
  long: 1,
  lon: 1,
  lon_dd: 1,
  long_dd: 1,
  lon_x: 1,
  long_x: 1,
  x: 1
}

var template =
'<OGRVRTDataSource>' +
  '<OGRVRTLayer name="%s">' +
    '<SrcDataSource relativeToVRT="1">%s</SrcDataSource>' +
    '<GeometryType>wkbPoint</GeometryType>' +
    '<LayerSRS>%s</LayerSRS>' +
    '<GeometryField encoding="PointFromColumns" x="%s" y="%s"/>' +
  '</OGRVRTLayer>' +
'</OGRVRTDataSource>'

function csvToVrt(fileName, srs, cb){

  if(!cb) throw new Error('Must provide callback as third argument to csvToVrt.');

  if(!fileName || !srs){
    return cb(new Error('Must provide non-empty csv and spatial reference as first and second arguments to cstToVrt.'));
  }

  var resolved = path.resolve(fileName);
  var extName = path.extname(resolved);
  var basename = path.basename(resolved, extName);
  var dirname = path.dirname(resolved);
  var tmpdir = path.join(dirname, 'vrttmpdir');
  var currtmp = path.join(tmpdir, crypto.pseudoRandomBytes(10).toString('hex'));
  var relativePos = path.join('..', '..', basename);

  var csv = path.join(dirname, basename + '.csv');
  var tmpcsv = path.join(currtmp, basename + '.csv');
  var vrt = path.join(currtmp, basename + '.vrt');

  try{
    fs.mkdirSync(tmpdir);
  }catch(e){
    //exists
  }

  try{
    fs.mkdirSync(currtmp);
  }catch(e){
    return cb(e);
  }

  if(extName !== '.csv'){
    try{
      fs.renameSync(resolved, tmpcsv);
      relativePos = basename;
      csv = tmpcsv;
    }catch(e){
      return cb(e);
    }
  }


  readUntil(csv, '\n', function(err, buf){
    if(err) return cb(err);
    var headers = buf.toString().split(/\s*,\s*/);
    var x;
    var y;

    for(var i=0; i<headers.length; i++){
      var header = headers[i].toLowerCase();
      if(latNames[header]) y = header;
      if(lonNames[header]) x = header;
      if(x && y) break;
    }

    if(!(x && y)){
      return cb(new Error('Couldn\'t automatically wrap ' + csv + ' in a vrt file. Do this manually or convert to GeoJSON.'));
    }

    fs.writeFile(
      vrt,
      util.format(template, relativePos, path.basename(csv), srs, x, y),
      function(err){
        if(err) return cb(new Error('Couldn\'t automatically wrap ' + csv + ' in a vrt file. Do this manually or convert to GeoJSON.'));
        cb(null, vrt);
      }
    )
  })
}

module.exports = csvToVrt;
