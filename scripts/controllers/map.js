//https://openweathermap.org/docs/hugemaps

mapApp.controller('mapController', function ($scope, $timeout){

	var mymap = L.map('mapid').setView([-12.85, -50.09], 4);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.light'
    }).addTo(mymap);

    // FeatureGroup is to store editable layers
    var drawnItems = new L.FeatureGroup();
    mymap.addLayer(drawnItems);
 
    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems,
            poly: {
                allowIntersection: false
            }
        },
        draw: {
            polygon: {
                allowIntersection: false,
                showArea: true
            },
            polyline: false,
            circle: false,
            marker: true,
            rectangle: false
        }
    });
    mymap.addControl(drawControl);

    mymap.on(L.Draw.Event.CREATED, function (event) {
        var layer = event.layer;
        console.log(layer);
        //console.log("layer._latlngs.length " + layer._latlngs.length);
        //console.log("layer._latlngs.length[0] " + layer._latlngs[0].length);
        //console.log("layer._latlngs.length[0][0] " + layer._latlngs[0][0].length);
    	for(i=0;i<=layer._latlngs[0].length-1;i++)
        {
			console.log('[' + layer._latlngs[0][i].lat + ',' + layer._latlngs[0][i].lng +'],');
        }
        drawnItems.addLayer(layer);
    });

//console.log(RS._latlngs[0].lat);
//console.log(RS._latlngs[0].lng);


    // var marker = L.marker([48.488, 1.395]).addTo(mymap);
    // marker.bindPopup("<b>" + "Exemplo de popup" + "</b>");
    //     marker.snapediting = new L.Handler.MarkerSnap(mymap, marker);
    //     marker.snapediting.addGuideLayer(guides);
    //     marker.snapediting.enable();
    //     var road = L.polyline([
    //         [48.48922, 1.40033],
    //         [48.48935, 1.39981],
    //         [48.48948, 1.3976],
    //         [48.48986, 1.39634]
    //     ], {
    //         color: 'green',
    //         opacity: 1.0
    //     }).addTo(mymap);

	var legend = L.control({position: 'bottomright', title: 'teste'});

	legend.onAdd = function (mymap) {

	    var div = L.DomUtil.create('div', 'info legend'),
	        grades = [-5,0,5,10,15,20,25,30,35,40],
	        labels = [,,,,,,,,,,,,,];

	    // loop through our density intervals and generate a label with a colored square for each interval
	    for (var i = 0; i < grades.length; i++) {
	    	div.innerHTML += '<i style="background:' + getColor(grades[i]) + '"></i> ' + 
	    	(i==0 ? '< ' + grades[i] + '<br>' + '<i style="background:' + getColor(grades[i+1] - 1) + '"></i> ' + grades[i] + ' - ' + grades[i+1] :  
	    	(grades[i+1] == undefined ? '>= ' + grades[i] : 
	    	grades[i] + ' - ' + grades[i+1])) 
	    	+ '<br>';
	    }

	    return div;
	};

	legend.addTo(mymap);

	function getColor(d) {
		//http://www.weatherzone.com.au/help/legend.jsp
	    return d >=  40    ? '#FF3C1C' :
	    	   d >=  35    ? '#CD5B12' :
	           d >=  30    ? '#FF7B33' :
	           d >=  25    ? '#FF9933' :
	           d >=  20    ? '#FBC25E' :
	           d >=  15    ? '#FFEB88' :
	           d >=  10    ? '#CADB92' :
	           d >=   5    ? '#B9ECD8' :
	           d >=   0    ? '#BCEEFB' :
	           d >  -5    ? '#E1F6FB' :
	           				'#FFFFFF';
	}
	var auxI = 0.3

	var popup = L.popup();

	// function onMapClick(e) {
	//     popup
	//         .setLatLng(e.latlng)
	//         .setContent("You clicked the map at " + e.latlng.toString())
	//         .openOn(mymap);
	// }

	//mymap.on('click', onMapClick);

	var maxLength = 75300;
	var lengthVariation = 100;
	var i = 2619;
	$scope.generateTemperaturesSouthAmerica = async function(i,aux){
		var variation = 0.075;
		if (aux != 1) {
			$scope.cleanMap();
		}

		var auxColor;
		for (i; i < markerLat.length-maxLength+lengthVariation; i++) {
			//var auxName = (temperature[i]*i).toString();
			auxColor = getColor(temperature[i]);
			
			if(i >= markerLat.length-maxLength+lengthVariation-1){
				var polygons = L.polygon([
				    [markerLat[i]+variation, markerLng[i]+variation],
				    [markerLat[i]+variation, markerLng[i]-variation],
				    [markerLat[i]-variation, markerLng[i]-variation],
				    [markerLat[i]-variation, markerLng[i]+variation]
				]).addTo(mymap);
				polygons.setStyle({color: 'transparent', fillColor: auxColor, fillOpacity: 0.7,});
				if(lengthVariation == 70000)
					break;
				lengthVariation = lengthVariation + 100
				await sleep(20);
				$scope.generateTemperaturesSouthAmerica(i, 1);
				return;
			}

			var polygons = L.polygon([
			    [markerLat[i]+variation, markerLng[i]+variation],
			    [markerLat[i]+variation, markerLng[i]-variation],
			    [markerLat[i]-variation, markerLng[i]-variation],
			    [markerLat[i]-variation, markerLng[i]+variation]
			]).addTo(mymap);
			polygons.setStyle({color: 'transparent', fillColor: auxColor, fillOpacity: 0.7,});

			//temperaturesNames[i] = polygons;
			
		}

	}	

	async function generateTemperaturesSouthAmerica2(i){
		console.log("aaa")
		var variation = 0.075;

		var auxColor;
		console.log(markerLat.length)
		for (i; i < markerLat.length-68000; i++) {
			//var auxName = (temperature[i]*i).toString();
			auxColor = getColor(temperature[i]);

			var polygons = L.polygon([
			    [markerLat[i]+variation, markerLng[i]+variation],
			    [markerLat[i]+variation, markerLng[i]-variation],
			    [markerLat[i]-variation, markerLng[i]-variation],
			    [markerLat[i]-variation, markerLng[i]+variation]
			]).addTo(mymap);
			polygons.setStyle({color: 'transparent', fillColor: auxColor, fillOpacity: 0.7,});

			//temperaturesNames[i] = polygons;
			
		}
	}

	//temperaturesNames = [];
	$scope.generateTemperaturesRS = function(aux){
		
		var variation = 0.075;
		if (aux != 1) {
			$scope.cleanMap();
		}
		$scope.generateRS()

		var auxColor;
		for (var i = 0; i < markerLat.length; i++) { //i 2619, markerLat.length-60000
			if(markerLat[i] <= -27.163029785507703 && markerLat[i] >= -33.75174787568194 && markerLng[i] >= -57.62466430664063 && markerLng[i] <= -49.581298828125)
			{
				//var auxName = (temperature[i]*i).toString();
				auxColor = getColor(temperature[i]);

				var polygons = L.polygon([
				    [markerLat[i]+variation, markerLng[i]+variation],
				    [markerLat[i]+variation, markerLng[i]-variation],
				    [markerLat[i]-variation, markerLng[i]-variation],
				    [markerLat[i]-variation, markerLng[i]+variation]
				]).addTo(mymap);
				polygons.setStyle({color: 'transparent', fillColor: auxColor, fillOpacity: 0.7,});

				//temperaturesNames[i] = polygons;	
			}
		}
	}

	//temperaturesNames = [];
	$scope.generateTemperaturesPF = function(aux){
		
		var variation = 0.075;
		if (aux != 1) {
			$scope.cleanMap();
		}
		$scope.generatePF()

		var auxColor;
		for (var i = 0; i < markerLat.length; i++) {
			if(markerLat[i] <= -28.19641365952182 && markerLat[i] >= -28.311635046750602 && markerLng[i] >= -52.48443603515626 && markerLng[i] <= -52.32032775878907)
			{
				//var auxName = (temperature[i]*i).toString();
				auxColor = getColor(temperature[i]);

				var polygons = L.polygon([
				    [markerLat[i]+variation, markerLng[i]+variation],
				    [markerLat[i]+variation, markerLng[i]-variation],
				    [markerLat[i]-variation, markerLng[i]-variation],
				    [markerLat[i]-variation, markerLng[i]+variation]
				]).addTo(mymap);
				polygons.setStyle({color: 'transparent', fillColor: auxColor, fillOpacity: 0.7,});

				//temperaturesNames[i] = polygons;	
			}
		}
	}

	//temperaturesNames = [];
	$scope.generateTemperaturesBR = function(aux){
		
		var variation = 0.075;
		if (aux != 1) {
			$scope.cleanMap();
		}
		$scope.generateBR()

		var auxColor;
		for (var i = 0; i < markerLat.length; i++) {
			if(markerLat[i] <= 5.353521355337334 && markerLat[i] >= -33.83391995365471 && markerLng[i] >= -48.04785156250001 && markerLng[i] <= -34.76074218750001)
			{
				//var auxName = (temperature[i]*i).toString();
				auxColor = getColor(temperature[i]);

				var polygons = L.polygon([
				    [markerLat[i]+variation, markerLng[i]+variation],
				    [markerLat[i]+variation, markerLng[i]-variation],
				    [markerLat[i]-variation, markerLng[i]-variation],
				    [markerLat[i]-variation, markerLng[i]+variation]
				]).addTo(mymap);
				polygons.setStyle({color: 'transparent', fillColor: auxColor, fillOpacity: 0.7,});

				//temperaturesNames[i] = polygons;	
			}
		}
	}

	$scope.cleanMap = function () {
	    for(i in mymap._layers) {
	        if(mymap._layers[i]._path != undefined) {
	            try {
	                mymap.removeLayer(mymap._layers[i]);
	            }
	            catch(e) {
	                console.log("problem with " + e + mymap._layers[i]);
	            }
	        }
	    }
	}
	
	$scope.generateRS = function(){
		mymap.setView([-30.202113679097216, -53.58593750000001], 7);
		RS.addTo(mymap);
	}

	$scope.generatePF = function(){
		mymap.setView([-28.261146513448647, -52.39551544189454], 12);
		PF.addTo(mymap);
	}

	$scope.generateBR = function(){
		mymap.setView([-12.85, -50.09], 4);
		BR.addTo(mymap);
	}

	$scope.addShape = function(shape){
    	console.log(shape)
    	var shpfile = new L.Shapefile(shape);
    	shpfile.addTo(mymap);
    	console.log("after add map");
    	// var shpfile = new L.Shapefile('scripts/banco/ShapeFiles/Brasil.zip');
    	// shpfile.addTo(mymap);
    }

    $scope.uploadFile = function(){
		var file = $scope.myFile;

		console.log($scope.myFile +' file is ' );
		console.dir(file);
		var shpfile = new L.Shapefile(file); 
    	shpfile.addTo(mymap);
    };
    
    $scope.loadFile = function() {

        input = document.getElementById('fileinput');
        if (!input.files[0]) {
            bodyAppend("p", "Please select a file before clicking 'Load'");
        }
        else {
            file = input.files[0];
            console.log(file)
            fr = new FileReader();
            fr.onload = receberBinario;
            fr.readAsArrayBuffer(file);
            // readAsBinaryString(file);
            
        }
        function receberBinario() {
            result = fr.result
            $scope.addShape(result);			
        }
    }

  //   function generateTemperatureColor(i){
  //   	if(temperature[i] > 35)
		// 	return '#DB0000';
		// else 
		// if(temperature[i] <= 35 && temperature[i]>30)
		// 	return '#DB3E00';
		// else
		// if(temperature[i] <=30 && temperature[i]>25)
		// 	return '#DB6300';
		// else
		// if(temperature[i] <=25 && temperature[i]>20)
		// 	return '#DB9600';
		// else
		// if(temperature[i] <=20 && temperature[i]>15)
		// 	return '#DBBE00';
		// else
		// if(temperature[i] <=15 && temperature[i]>10)
		// 	return '#C9DB00';
		// else
		// if(temperature[i] <=10 && temperature[i]>5)
		// 	return '#92DB00';
		// else
		// if(temperature[i] <=5 && temperature[i]>0)
		// 	return '#00DB00';
		// else
		// if(temperature[i] <=0 && temperature[i]>-5)
		// 	return '#00DB6A';
		// else
		// if(temperature[i] <= -5&& temperature[i]>-10)
		// 	return '#00DB9A';
		// else
		// if(temperature[i] <=-10 && temperature[i]>-15)
		// 	return '#00D0DB';
		// else
		// if(temperature[i] <=-15 && temperature[i]>-20)
		// 	return '#0096BF';
		// else
		// if(temperature[i] <=-20 && temperature[i]>-25)
		// 	return '#0059BF';
		// else
		// if(temperature[i] <=-25 && temperature[i]>-30)
		// 	return '#002DBF';
		// else
		// 	return '#001763';
  //   }

	function sleep(ms) {
	  return new Promise(resolve => setTimeout(resolve, ms));
	}

});