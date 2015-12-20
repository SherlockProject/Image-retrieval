
function ex1(){
  console.log("hi");
  $.ajax({
    url: '/hello/hoge',
    data: {

    },
    type: 'POST',
    success: function (response) {
      console.log(response);
    },
    error: function (error) {
      console.log(error);
    }
  });
}

function init1(){

  $.ajax({
    url: '/hello/init',
    data: {
    },
    type: 'POST',
    success: function (response) {
      console.log(response);
    },
    error: function (error) {
      console.log(error);
    }
  });
}