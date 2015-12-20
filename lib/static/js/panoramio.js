/**
 * Created by hiroshi on 15/12/15.
 */

$(function(){

    $("#map").height($("#map").height()-12);

    var map,marker,tmp=[],tmp2=[];

    /*
     住所からの緯度・経度、境界は以下のページで取得できます。
     http://phpjavascriptroom.com/example7.php?f=include/ajax/gmapv3/geocoding/geocoding.inc&ttl=%E8%A8%AD%E7%BD%AE%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB#
     */

    N = 100;

    var lat=51.505247;                /* 緯度 */
    var lng=0.000000;                /* 経度 */
    var sw_lat=51.657386;            /* 南西の境界の緯度 */
    var sw_lng=0.00000099999997;    /* 南西の境界の経度 */
    var ne_lat=51.67244;            /* 北東の境界の緯度 */
    var ne_lng=0.00089999999;    /* 北東の境界の経度 */
    var myLatlng=new google.maps.LatLng(lat,lng);

    /* 境界からの差分（Panoramio用に） */
    var sw_lat_diff=sw_lat-lat;
    var sw_lng_diff=sw_lng-lng;
    var ne_lat_diff=ne_lat-lat;
    var ne_lng_diff=ne_lng-lng;

    console.log(sw_lat_diff,sw_lng_diff);
    console.log(ne_lat_diff,ne_lng_diff);

    /* ウィンドウを読み込んだときに、地図を描画 */
    $(window).load(function(){

        initialize();

    });

    /*

     if(!navigator.geolocation){
     // Geolocation impossible
     $("#support").html("Geolocation APIの利用不可").show();
     }else{
     // Geolocation API possible
     navigator.geolocation.getCurrentPosition(
     positionCallback,
     positionErrorCallback,
     {
     // 精度の高い位置情報を取得無
     enableHighAccuracy:true,
     // タイムアウトまでの時間（ミリ秒）
     timeout:6000,
     // 位置情報の有効期限（ミリ秒）
     maximumAge:0
     }
     );
     }
     */

    /* ユーザーの現在位置情報取得 */
    function positionCallback(position) {
        var s="";
        /* 現在位置更新 */
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
                s="Geolocation APIを使用が許可されていないため、位置が取得できませんでした。\nそのため「表参道」の緯度・経度で表示しています。";
                break;
            case 2:
                /* POSITION_UNAVAILABLE */
                s="デバイスの位置を特定できませんでした。\n 「表参道」の緯度・経度で表示しています。";
                break;
            case 3:
                /* TIMEOUT */
                s="タイムアウトしました。電波が悪いのかもしれません。何度かリロードしてみてください。\nそのため「表参道」の緯度・経度で表示しています。";
                break;
                defaut:
                    break;
        }
        alert(s);
    }
    /* 地図初期化 */
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
            tmp["a"]=infowindow; /* 情報ウィンドウオブジェクト格納 */
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
            tag: "hotels",

            //minx:lng+sw_lng_diff,
            //miny:lat+sw_lat_diff,
            //maxx:lng+ne_lng_diff,
            //maxy:lat+ne_lat_diff,

            minx:lng - 0.03,
            miny:lat - 0.03,
            maxx:lng + 0.03,
            maxy:lat + 0.03,

            size:"square",
            mapfilter:true,
            ts: new Date().getTime()

        }

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
        var image = 'fox2.jpg';
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

    /* 地図の中心地点変更 */
    function chgMapCenter(){
        map.setCenter(myLatlng);
        marker.setPosition(myLatlng);
        showPanoramio();
    }



    /*
     var url="http://www.panoramio.com/map/get_panoramas.php?callback=?";
     var data={
     set:"public",
     from:0,
     to:28,
     minx:139.70300099999997,
     miny:35.657386,
     maxx:139.72109899999998,
     maxy:35.67244,
     size:"square",
     mapfilter:true,
     ts:new Date().getTime()
     }

     var s="";
     $.getJSON(url,data,function(json){
     for(var i in json.photos){
     s+="<a href='http://www.panoramio.com/photo/"+json.photos[i].photo_id+"' target='_blank'><img src='"+json.photos[i].photo_file_url+"' /></a>";
     }
     $("#pano").html(s);
     });
     */

});

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

var changePictureNum = function(){



};