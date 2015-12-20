/**
 * Created by hiroshi on 15/12/15.
 */

window.onload = function(){

    var p = 1;

    $.ajax({
        url: '/hello/data',
        data: {
            "query_num": JSON.stringify(p)
        },
        type: 'POST',
        success: function (response) {
            //console.log(response);
            json = JSON.parse(response);

            console.log(json);
            console.log(json.length);

            var table = document.getElementById("table");

            for(var i=0;i<json.length;i++){


                var row = table.insertRow(-1);

                var cell1 = row.insertCell(-1);
                var cell2 = row.insertCell(-1);
                var cell3 = row.insertCell(-1);
                var cell4 = row.insertCell(-1);
                var cell5 = row.insertCell(-1);
                var cell6 = row.insertCell(-1);
                var cell7 = row.insertCell(-1);

                var row_len = table.rows.length;

                cell1.innerHTML = json[i][0].index;
                cell2.innerHTML = json[i][0].photo_title;
                cell3.innerHTML = json[i][0].upload_date;
                cell4.innerHTML = json[i][0].longitude;
                cell5.innerHTML = json[i][0].latitude;
                //var temp = json[i][0].photo_file_url;
                cell6.innerHTML = '<a href="'+json[i][0].photo_file_url+'">'+json[i][0].photo_file_url+'</a>';
                cell7.innerHTML = '<input type="button" value="Download" id="buttons" onclick="download_image(json[i][0].index)">';


            }
        },
        error: function (error) {
            console.log(error);
        }
    });

    $('#page-selection').bootpag({
        total: 50,
        page: 1,
        maxVisible: 5,
        leaps: true,
        firstLastUse: true,
        first: '←',
        last: '→',
        wrapClass: 'pagination',
        activeClass: 'active',
        disabledClass: 'disabled',
        nextClass: 'next',
        prevClass: 'prev',
        lastClass: 'last',
        firstClass: 'first'
    }).on("page", function(event, /* page number here */ num){

        retrieve(num);

        //$("#content").html("Insert content");  some ajax content loading...
    });

};

var retrieve = function(p){

    $.ajax({
        url: '/hello/data',
        data: {
            "query_num": JSON.stringify(p)
        },
        type: 'POST',
        success: function (response) {
            //console.log(response);
            json = JSON.parse(response);

            console.log(json);
            console.log(json.length);

            var table = document.getElementById("table");

            while(table.rows.length > 1){
                var rows = table.deleteRow(-1);
            }

            for(var i=0;i<json.length;i++){

                var row = table.insertRow(-1);

                var cell1 = row.insertCell(-1);
                var cell2 = row.insertCell(-1);
                var cell3 = row.insertCell(-1);
                var cell4 = row.insertCell(-1);
                var cell5 = row.insertCell(-1);
                var cell6 = row.insertCell(-1);
                var cell7 = row.insertCell(-1);

                cell1.innerHTML = json[i][0].index;
                cell2.innerHTML = json[i][0].photo_title;
                cell3.innerHTML = json[i][0].upload_date;
                cell4.innerHTML = json[i][0].longitude;
                cell5.innerHTML = json[i][0].latitude;
                cell6.innerHTML = '<a href="'+json[i][0].photo_file_url+'">'+json[i][0].photo_file_url+'</a>';
                cell7.innerHTML = '<input type="button" value="Download" id="buttons" onclick="download_image(json[i][0].index)">'

            }
        },
        error: function (error) {
            console.log(error);
        }
    });

};

var download_image = function(p){

    console.log(p);

    $.ajax({
        url: '/hello/image',
        data: {

            "image": JSON.stringify(p)

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