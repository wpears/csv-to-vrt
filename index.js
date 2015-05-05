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

function csvToVrt(csv, srs, cb){

  if(typeof srs === 'function'){
    cb = srs;
    srs = 'NAD83';
  }

  var name = path.basename(csv, path.extname(csv));
  var dirname = path.dirname(path.resolve(csv));
  var vrt =  path.join(dirname, name + '.vrt');
  
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
      util.format(template, name, csv, srs, x, y),
      function(err){
        if(err) return cb(new Error('Couldn\'t automatically wrap ' + csv + ' in a vrt file. Do this manually or convert to GeoJSON.'));
        cb(null, vrt);
      }
    )
  })  
}

module.exports = csvToVrt;