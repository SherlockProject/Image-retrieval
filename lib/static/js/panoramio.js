/**
 * Created by hiroshi on 15/12/15.
 */

$("#map").height($("#map").height()-12);

var map,marker,tmp=[],tmp2=[];

    /*
     This link is for getting log & lat from address
     http://phpjavascriptroom.com/example7.php?f=include/ajax/gmapv3/geocoding/geocoding.inc&ttl=%E8%A8%AD%E7%BD%AE%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB#
     */

N = 100;

// London

var lat=51.505247;                /* latitude */
var lng=0.000000;                /* longtitude */

radius_north_south = 3;
radius_east_west = 3;

radius_north_south /= 100.0;
radius_east_west /= 100.0;

myLatlng = new google.maps.LatLng(lat,lng);

    $(window).load(function(){

        initialize();

    });

    /*
    if you want to get pictures according to your current location

     if(!navigator.geolocation){
     // Geolocation impossible
     $("#support").html("Geolocation API impossible").show();
     }else{
     // Geolocation API possible
     navigator.geolocation.getCurrentPosition(
     positionCallback,
     positionErrorCallback,
     {

     enableHighAccuracy:true,
     timeout:6000,
     maximumAge:0
     }
     );
     }
     */

    /* User current location */

    function positionCallback(position) {
        var s="";
        // current position renewal
        lat=position.coords.latitude;
        lng=position.coords.longitude;
        myLatlng=new google.maps.LatLng(lat,lng);
        chgMapCenter();

    }

    /* when failing to get current geo data */
    function positionErrorCallback(positionError){
        var s="";
        switch(positionError.code){
            case 1:
                /* PERMISSION_DENIED */
                s="Geolocation API is not allowed.";
                break;
            case 2:
                /* POSITION_UNAVAILABLE */
                s="Device position is unclear";
                break;
            case 3:
                /* TIMEOUT */
                s="Timeout.";
                break;
                defaut:
                    break;
        }
        alert(s);
    }
    /* map initialization */
    function initialize(){

        var myOptions={

            zoom:12,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP

        };
        map = new google.maps.Map(document.getElementById("map"), myOptions);

        marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            draggable:true
        });
        chgMapCenter();
        google.maps.event.addListener(marker, 'click', function() {

            clear();

            var infowindow=new google.maps.InfoWindow({
                content: "Your current position"
            });
            infowindow.open(map, marker);
            tmp["a"]=infowindow;
        });
        //  when marker is drugged, display Panoramio picture around the spot
        google.maps.event.addListener(marker, 'dragend', function() {
            lat=marker.getPosition().lat();
            lng=marker.getPosition().lng();
            myLatlng=new google.maps.LatLng(lat,lng);
            chgMapCenter();

        });
    }

    /* display the Panoramio photo */
    function showPanoramio(){



        clear_marker(); /* clear all of marker */
        // Panoramio API
        var url="http://www.panoramio.com/map/get_panoramas.php?callback=?";
        var data={
            set:"public",
            from:0,
            to:N,
            //tag does not work..:(
            //tag: "hotels",


            minx:lng - radius_north_south,
            miny:lat - radius_east_west,
            maxx:lng + radius_north_south,
            maxy:lat + radius_east_west,

            size:"square",
            mapfilter:true,
            ts: new Date().getTime()

        }

        console.log(radius_north_south,radius_east_west);

        var s="";
        p = [];

        $.getJSON(url,data,function(json){
            for(var i in json.photos){
                console.log(json.photos[i]);
                showInfoWindow(i,json.photos[i]);
                p.push(json.photos[i]);
                s+="<a href='http://www.panoramio.com/photo/"+json.photos[i].photo_id+"' target='_blank'><img src='"+json.photos[i].photo_file_url+"' /></a>";
            }
            $("#pano").html(s);

        });

    }
    /* information window */
    function showInfoWindow(i,pdata){

        var marker_latlng=new google.maps.LatLng(pdata.latitude,pdata.longitude);
        //var image = '../image/red-circle.png';
        var image = '../image/fox2.jpg';
        var markers=new google.maps.Marker({
            position: marker_latlng,
            map: map,
            icon: image,
            title:pdata.photo_title
        });
        tmp2[i]=markers;
        /* display Panoramio photo on info window */
        var contentString='<div id="infowin" style="height:'+(pdata.height+60)+'px">'+
            '<div class="inner"><a href="http://www.panoramio.com/" target="_blank"><img src="/content/demo/geolocation/logo-small.gif" width="119" height="25" alt="Panoramio logo" /><\/a><br>'+
            '<a href="'+pdata.photo_url+'" target="_blank"><img width="'+pdata.width+'" height="'+pdata.height+'" src="'+pdata.photo_file_url+'"/><\/a></div>'+
            '<p><a target="_blank" class="photo_title" href="'+pdata.photo_url+'"><strong>'+pdata.photo_title+'<\/strong><\/a><br>'+
            'by <a target="_blank" href="'+pdata.owner_url+'">'+pdata.owner_name+'<\/a><\/p><\/div>';

        // display info window when marker clicked

        google.maps.event.addListener(markers, 'click', function() {
            clear();
            var infowindows=new google.maps.InfoWindow({
                content: contentString
            });
            infowindows.open(map, markers);
            tmp[i]=infowindows;
        });



    }

    /* marker all clear */
    function clear_marker(){
        for(var i in tmp2){
            if(tmp2[i]){
                tmp2[i].setMap(null);
            }
        }
    }
    /* close all info window */
    function clear(){
        for(var i in tmp){
            if(tmp[i]){
                tmp[i].close();
            }
        }
    }

    /* change the center spot of map */
    function chgMapCenter(){
        map.setCenter(myLatlng);
        marker.setPosition(myLatlng);
        showPanoramio();
    }


var download = function(){

    console.log(p);

    $.ajax({
        url: '/hello/hoge',
        data: {

            "query": JSON.stringify(p)

        },
        type: 'POST',
        success: function (response) {
            console.log(response);
        },
        error: function (error) {
            console.log(error);
        }
    });
};

var change = function(){

    N =  parseInt(document.getElementById("picture_num").value);

    radius_east_west = parseInt(document.getElementById("radius-east-west").value);
    radius_north_south = parseInt(document.getElementById("radius-north-south").value);

    radius_north_south /= 100.0;
    radius_east_west /= 100.0;

    console.log(radius_east_west,radius_north_south);

    showPanoramio();

};