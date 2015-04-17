var map = L.map('map').setView([40.2838, -3.8215],13);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([40.2838, -3.8215]).addTo(map)
                            .bindPopup('Aulario III, URJC')
                            .openPopup();

map.on('click', function(e) {
	L.marker(e.latlng).addTo(map).bindPopup("coor: "+e.latlng).openPopup();
});

function popUpName(feature, layer) {
if (feature.properties && feature.properties.Name) {
        layer.bindPopup(feature.properties.Name);
	}
}

$.getJSON("edificios.json", function(data) {
	buildingsLayer = L.geoJson(data, {
	    onEachFeature: popUpName
	}).addTo(map);
});

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map)
        .bindPopup("Estas en un area de " + radius + " metros desde punto.").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

function addr_search(){
	var inp = document.getElementById("addr");

	$.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + inp.value, function(data) {
	var items = [];

	$.each(data, function(key, val) {
		  items.push(
		    "<li><a href='#' onclick='chooseAddr(" +
		    val.lat + ", " + val.lon + ");return false;'>" + val.display_name +
		    '</a></li>'
		  );
		});
		$('#results').empty();
		if (items.length != 0) {
			$('<p>', { html: "Search results:" }).appendTo('#results');
			$('<ul/>', {
			'class': 'my-new-list',
			html: items.join('')
			}).appendTo('#results');
		} else {
			$('<p>', { html: "No results found" }).appendTo('#results');
		}
	});

	var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
    var tag = $("#addr").val();

    $.getJSON( flickerAPI, {
      tags: tag,
      tagmode: "any",
      format: "json"
    })
      .done(function( data ) {
        $("#images").empty();
        $.each( data.items, function( i, item ) {
          $( "<img>" ).attr( "src", item.media.m ).appendTo( "#images" );
          if(i == 4)
            return false;
        });
      });
}

function chooseAddr(lat, lng, type) {
	var location = new L.LatLng(lat, lng);
	map.panTo(location);
	if (type == 'city' || type == 'administrative') {
	    map.setZoom(11);
	} else {
	    map.setZoom(13);
	}
}

function reset_results(){
	document.getElementById("results").innerHTML = "";
	document.getElementById("addr").value = "";
	document.getElementById("images").innerHTML = "";
}



$("#searchb").click(function(){
    addr_search();}
);

$("#clearb").click(function(){
    reset_results();}
);
