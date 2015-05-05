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
  lon_y: 1,
  long_y: 1,
  y: 1
}
/*
<OGRVRTDataSource>
    <OGRVRTLayer name="virginia">
        <SrcDataSource relativeToVRT="1">virginia.csv</SrcDataSource>
        <GeometryType>wkbPoint</GeometryType>
        <LayerSRS>NAD83</LayerSRS>
        <GeometryField encoding="PointFromColumns" x="LONG" y="LAT"/>
    </OGRVRTLayer>
</OGRVRTDataSource>
*/
function csvToVrt(csv, cb){

}
