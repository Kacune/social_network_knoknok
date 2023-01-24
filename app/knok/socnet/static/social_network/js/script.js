var socket = io.connect(config.socket_server);
//console.log(config.socket_server);
//let ls = window.localStorage;
//var idetc = await fetch(config.host +'/data/for/navbar/'+ ls.getItem('id'), {
//    method: 'get',
//    headers: {
//        'Content-Type': 'application/json',
//    }
//});
//let params = await idetc.json();
//
//ls.setItem('my_suggestons_count', params.my_suggestons_count);
//ls.setItem('suggestons_count', params.suggestons_count);
//ls.setItem('favorite_count', params.favorite_count);
//ls.setItem('price_count', params.price_count);
//ls.setItem('themes', params.themes);
//ls.setItem('wallet_sum', params.wallet_sum);


var button_show_all = 0;
$('#button_show_all').click(function(){
  if (button_show_all == 0){
    $('.block_characteristics').addClass('click');
    $('.all_characteristics').removeClass('noclick').addClass('click');
    button_show_all = 1;
  }
  else{
    $('.block_characteristics').removeClass('click');
    $('.all_characteristics').removeClass('click').addClass('noclick');
    button_show_all = 0;
  }
});

$('.send_mail_suggest_main').click(function(){
  var content = $(this).parents('.main_suggest');
  $(content).css({
    'height' : ' 4.27vw',
  })
  $('.write_mail_suggestion_main').css({
    'display' : 'flex',
  })
  $('.one_suggest_main').css({
    'margin-bottom' : '',
  })
  var one_suggest = $(this).parents('.one_suggest');
  $(one_suggest).css({
    'padding-bottom' : '20px',
  })
});

//$('#write_mail_suggestion').click(function(){
//  var content = $('#one_suggest');
//  $(content).css({
//    'height' : '390px',
//  })
//});

$('#send_mail_suggest').click(function() {
  $('#textarea_suggest').value = '';
  $('#one_suggest').css({
    'display' : '',
    'height' : ' 4.27vw',
  });
});

$('#filter').click(function () {
  $('#filter_block').css({
    'display' : 'block',
  })
})

$('.filter_block svg').click(function () {
  $('#filter_block').css({
    'display' : 'none',
  });
});

function show(id, state){
  document.getElementById(id).style.display = state;
}

window.onload = function () {
  document.getElementById("menu").onclick = function(){
    var x = document.getElementById('myTopnav');
    if (x.className === "nav_button__container") {
      x.className += " responsive";
    } else {
      x.className = "nav_button__container";
    }
  };
};

var click_hide = 0;

$(".hide_bchi.noclick").click(function(){
  if (click_hide == 0){
    $('.block_characteristic_info').addClass('click');
    $('.hide_bchi').removeClass('noclick').addClass('click');
    $('.block_characteristic_info_elem').addClass('click');
    $('.also_characteristic').addClass('click');
    $('.top_content').addClass('click');
    click_hide = 1;
  }
  else{
    $('.block_characteristic_info').removeClass('click');
    $('.hide_bchi').removeClass('click').addClass('noclick');
    $('.block_characteristic_info_elem').removeClass('click');
    $('.also_characteristic').removeClass('click');
    click_hide = 0;
  }
});

$(".hide_bchi.click").click(function(){
  $(".block_characteristic_info").removeClass('click');
  $('.hide_bchi').removeClass('click').addClass('noclick');
  $('.block_characteristic_info_elem').removeClass('click');
  $('.also_characteristic').removeClass('click');
  $('.top_content').removeClass('click');
});


var click_expand = true;


$('.transfer_block_expand').click(function(){
  if(click_expand == true){
    $('.bot_content').css({
      'position':'fixed',
      'bottom':'0',
      'left':'0',
      'z-index':'9000',
      'margin-top':'0',
      'height':'100vh',
      'width' : '99.5vw',
      'padding-right': '0',
      'transition' : 'all .6s ease',
    });
    $('.photo_block_main').css({
      'height':'100%',
      'padding-left': '1.5625vw'
    });
    $('.photo_block').css('height', '100%');
    $('.photo_block__elem').css({
      'width':'360px',
      'height':'360px'
    });
    $('.photo_block__elem img').css({
      'width':'360px',
      'height':'360px'
    });
    $('.func_line').css({
      'padding-left': '1.5625vw',
      'font-size': '15px'
    });
    click_expand = false;
  }
  else{
    $('.bot_content').css({
      'position':'',
      'bottom':'',
      'left':'',
      'z-index':'',
      'margin-top':'2.6vw',
      'height':'',
      'width' : '',
      'transition' : 'all 0s ease',
    });
    $('.photo_block_main').css({
      'height':'',
      'padding-left': '5px'
    });
    $('.photo_block').css('height', '17.1875vw');
    $('.photo_block__elem').css({
      'width':'160px',
      'height':'160px'
    });
    $('.photo_block__elem img').css({
      'width':'160px',
      'height':'160px'
    });
    $('.func_line').css({
      'padding-left': '10px',
      'font-size': '12px'
    });
    click_expand = true;
  }

});






var click = true;

function changeSize(){
  if (click == true){
    var big_photo = document.getElementsByClassName("big_photo");
    var img = document.getElementsByClassName("big_photo")[0].getElementsByTagName("img");
    for(i = 0; i < img.length; i++){
      img[i].style.width = "100vw";
      img[i].style.height = "48.4375vw";
    }
    var like_loot = document.getElementsByClassName("like_look");
    var prev = document.getElementsByClassName("prev");
    var next = document.getElementsByClassName("next");
    big_photo[0].style.width = "100vw";
    big_photo[0].style.height = "48.4375vw";
    big_photo[0].style.position = "absolute";
    big_photo[0].style.top = "0";
    big_photo[0].style.left = "0";
    for(i = 0; i <like_loot.length; i++){
      like_loot[i].style.width = "100vw";
    }
    prev[0].style.height = "48.4375vw";
    next[0].style.height = "48.4375vw";
    var photo_all_screen_comment = document.getElementsByClassName("photo_all_screen_comment")[0];
    photo_all_screen_comment.style.display = "none";
    click = false;
  }
  else{
    var big_photo = document.getElementsByClassName("big_photo");
    var img = document.getElementsByClassName("big_photo")[0].getElementsByTagName("img");
    for(i = 0; i < img.length; i++){
      img[i].style.width = "1400px";
      img[i].style.height = "41.01vw";
    }
    var like_loot = document.getElementsByClassName("like_look");
    var prev = document.getElementsByClassName("prev");
    var next = document.getElementsByClassName("next");
    big_photo[0].style.width = "1400px";
    big_photo[0].style.height = "787.5px";
    big_photo[0].style.position = "relative";
    big_photo[0].style.top = "0";
    big_photo[0].style.left = "0";
    for(i = 0; i <like_loot.length; i++){
      like_loot[i].style.width = "1400px";
    }
    prev[0].style.height = "787.5px";
    next[0].style.height = "787.5px";
    var photo_all_screen_comment = document.getElementsByClassName("photo_all_screen_comment")[0];
    photo_all_screen_comment.style.display = "flex";
    click = true;
  }

}

var trdeg = 0;

// $('.hide_tr').click(function(){
//   if (trdeg ==0){
//     $(this).css("transform", "rotate(270deg)");
//     trdeg = -1
//   }
//   else{
//     $(this).css("transform", "rotate(90deg)");
//     trdeg = 0
//   }
// })

$(function(){
  n = -360;
  $('.hide_tr').on('click', function(){
      $(this).css({
          'transform':'rotate('+n+'deg)',
          '-ms-transform':'rotate('+n+'deg)',
          '-moz-transform':'rotate('+n+'deg)',
          '-o-transform':'rotate('+n+'deg)'
      });
      n-=360;
  });
});
















var div = document.querySelector(".circle_fun_content");
   var send = document.getElementById('send_mail_circle');
   var voice = document.getElementById('micro_circle');
   var angle = 0;
   var info = 1;
   var up = false;



   //1-micro
   //2-send
   //3-photo
   $(document).ready(function(){
      $("#cursor").mousedown(function(){
         $(document).mousemove(function(){
            var bb = div.getBoundingClientRect();
            var cx = bb.left + bb.width / 2, cy = bb.top + bb.height / 2;
            angle = Math.atan2(event.y - cy, event.x - cx);
            div.style.transform = "rotate(" + angle + "rad)";
            up = true;
         });
      });

      var list_send = ['<svg id="send_mail_circle" xmlns="http://www.w3.org/2000/svg" width="27.53" height="21.088" viewBox="0 0 27.53 21.088">', '</svg>'];
      var list_micro = ['<svg id="micro_circle" xmlns="http://www.w3.org/2000/svg" width="28.034" height="44.303" viewBox="0 0 28.034 44.303">', '</svg>'];
      var list_photo = ['<svg id="photo_circle" xmlns="http://www.w3.org/2000/svg" width="22" height="16.943" viewBox="0 0 22 16.943">', '</svg>'];
      $(document).mouseup(function(){
         if (up == true){
            $(document).unbind("mousemove");
            div.style.transform = "rotate(0rad)";
            console.log(angle);

            if(angle>2 && angle<3 || angle>-3 && angle<-2){
               if (info == 1){
                  $('#circle_fun_content_left').html(list_micro[0]+$('#micro_circle1').html()+list_micro[1]);
                  $('#circle_fun_content_right').html(list_send[0]+$('#send_mail_circle1').html()+list_send[1]);
               }
               if (info == 2){
                  $('#circle_fun_content_left').html(list_send[0]+$('#send_mail_circle1').html()+list_send[1]);
                  $('#circle_fun_content_right').html(list_micro[0]+$('#micro_circle1').html()+list_micro[1]);
               }
               if (info == 2){
                  info = 1;
               }
               else{
                  info++;
               }
            }
            up = false;
         }
         $('#background_circle').css({
            'top': ' 2.47vw',
            'left': '4.95vw',
            'width': '0px',
            'height': '0px',
            'z-index':'-1',
            'transition':'.5s'
         });
         $('#circle_fun_content_right').css({
            'width': '',
            'z-index':'',
            'position':'',
            'top':'',
            'left':'',
            'right':'',
            'transition':''
         });
      });
      $('#circle_fun_content_right').mousedown(function(){
         $('#background_circle').css({
            'top':'0',
            'left': '0',
            'width':'4.95vw',
            'height':'4.95vw',
            'z-index': '10'
         });
         $('#circle_fun_content_right').css({
            'width': '4.95vw',
            'z-index':'15',
            'position':'absolute',
            'top':'0',
            'right':'-2.47vw'
         });
      });

      $('#circle_fun_content_right').mouseup(function(){
         $('#background_circle').css({
            'top': ' 2.47vw',
            'left': '4.95vw',
            'width': '0px',
            'height': '0px',
            'z-index':'-1',
            'transition':'.5s'
         });
         $('#circle_fun_content_right').css({
            'width': '',
            'z-index':'',
            'position':'',
            'top':'',
            'left':'',
            'right':'',
            'transition':''
         });
      });
   });


