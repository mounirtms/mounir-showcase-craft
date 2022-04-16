

$('#about').on("click", function(e){
    $("#about_container").css("display","inherit");
    $("#about_container").addClass("animated slideInLeft");
    setTimeout(function(){
        $("#about_container").removeClass("animated slideInLeft");
    },800);
})

$('#closeabout').on("click", function(e){
    $("#about_container").addClass("animated slideOutLeft");
    setTimeout(function(){
        $("#about_container").removeClass("animated slideOutLeft");
        $("#about_container").css("display","none");
    },800);
})

$('#work').on('click',function(e){
    $("#work_container").css("display","inherit");
    $("#work_container").addClass("animated slideInRight");


      setTimeout(function(){
        $("#work_container").removeClass("animated slideInRight");

        $(".animated-progress span").each(function () {
            $(this).animate(
              {
                width: $(this).attr("data-progress") + "%",
              },
              1000
            );
            $(this).text($(this).attr("data-progress") + "%");
          });
    },800);
})

 
$('#closework').on("click", function(e){
    $("#work_container").addClass("animated slideOutRight");
    setTimeout(function(){
        $("#work_container").removeClass("animated slideOutRight");
        $("#work_container").css("display","none");
    },800);
})


    $('#contact').on("click", function(e){
    $("#contact_container").css("display","inherit");
    $("#contact_container").addClass("animated slideInDown");
    setTimeout(function(){
        document.getElementById("contact_container").children[2].innerHTML=
        `<div id="social-svg"> <div class="colors-on-hover animated slideInRight"> <a target="_blank" href="https://www.linkedin.com/in/mounir1badi/"> <png src="svg/linkedin.svg"></png> </a> <a target="_blank" href="https://twitter.com/Mounir1badi"> <png src="svg/twitter.svg"></png> </a> <a target="_blank" href="https://www.facebook.com/Abderrahmani.Mounir"> <png src="svg/facebook.svg"></png> </a> <a target="_blank" href="https://plus.google.com/u/0/+MounirAbderrahmani"> <png src="svg/googleplus.svg"></png> </a> <a target="_blank" href="https://vk.com/id212224498"> <png src="svg/vk.svg"></png> </a> <a target="_blank" href="https://www.youtube.com/user/SmartBadi1/"> <png src="svg/youtube.svg"></png> </a> <a target="_blank" href="https://www.instagram.com/mounir_abderrahmani/"> <png src="svg/instagram.svg"></png> </a> <a target="_blank" href="https://www.rss.com/mounir1badi"> <png src="svg/rss.svg"></png> </a> <div class="colors-on-hover animated slideInRight"> <a target="_blank" href="https://join.slack.com/t/mounironslack/shared_invite/MjE5MjMxOTQxNTI1LTE1MDEyNTExMzQtY2E3MzZjNjE5ZA"> <png src="svg/slack.svg"></png> </a> <a target="_blank" href="http://plnkr.co/users/mounir1"> <png src="svg/plunker.svg"></png> </a> <a target="_blank" href="https://www.sencha.com/forum/member.php?847081-mounir1"> <png src="svg/sencha.svg"></png> </a> <a target="_blank" href="https://codepen.io/mounir1/"> <png src="svg/codepen.svg"></png> </a> <a target="_blank" href="https://jsfiddle.net/user/mounir1/fiddles/"> <png src="svg/jsfiddle.svg"></png> </a> <a target="_blank" href="https://github.com/mounir1"> <png src="svg/github.svg"></png> </a> </div><div class="colors-on-hover animated slideInRight"> <a target="_blank" href="https://t.me/Mounir_Abderrahmani"> <png src="svg/telegram.svg"></png> </a> <a target="_blank" href="https://chat.whatsapp.com/1wlNnJU7i5Y9z14EytdBx0"> <png src="svg/whatsapp.svg"></png> </a> <a target="_blank" href="https://hangouts.google.com/call/qwng2udlufhu3esyxdob3gn3u4y"> <png src="svg/hangout.svg"></png> </a> <a target="_blank" href=""> <png src="svg/skype.svg"></png> </a> <a href="#wechatqr"> <png src="svg/wechat.svg"></png> </a> <a href="#alloqr"> <png src="svg/allo.svg"></png> </a> <a href="#lineqr"> <png src="svg/line.svg"></png> </a> <a href="#messengerqr"> <png src="svg/messenger.svg"></png> </a> <a href="#snapqr"> <png src="svg/snapchat.svg"></png> </a><a target="_blank" href="mailto:mounir1badi@gmail.com"> <png src="svg/envelope.svg"></png> </a> </div><div class="colors-on-hover"> <div id="wechatqr" class="overlay"> <div class="popup"><a class="close" href="#">&times;</a> <div class="content"><img src="qr/wechatme.jpg" style="width:100%;height:100%"></div></div></div><div id="lineqr" class="overlay"> <div class="popup"><a class="close" href="#">&times;</a> <div class="content"><img src="qr/lineme.jpeg" style="width:100%;height:100%"></div></div></div><div id="messengerqr" class="overlay"> <div class="popup"><a class="close" href="#">&times;</a> <div class="content"><img src="qr/messenger.jpg" style="width:100%;height:100%"></div></div></div><div id="snapqr" class="overlay"> <div class="popup"><a class="close" href="#">&times;</a> <div class="content"><img src="qr/snap.png" style="width:100%;height:100%"></div></div></div><div id="skypeqr" class="overlay"> <div class="popup"><a class="close" href="#">&times;</a> <div class="content"></div></div></div><div id="profile" class="overlay"> <div class="popup"><a class="close" href="#">&times;</a> <div class="content"><img src="qr/profile.png" style="width:100%;height:100%"></div></div></div><div id="alloqr" class="overlay"> <div class="popup"><a class="close" href="#">&times;</a> <div class="content"><img src="qr/allo.png" style="width:100%;height:100%"></div></div></div></div><a style="position:absolute;right:50px" target="_blank" href="https://jskit-app.web.app"> <png src="svg/note.svg"></png> </a> </div></div>`

        $("#contact_container").removeClass("animated slideInDown");         
        $('png').each(function(){
            var t = $(this),
                i = t.attr('src');
            $.get(i, function(i){
                var a = $(i)
                    .find('svg');
                t.replaceWith(a);
            });
            console.clear();
        });
    },800);
})

$('#closecontact').on("click", function(e){
    $("#contact_container").addClass("animated slideOutUp");
    setTimeout(function(){
        $("#contact_container").removeClass("animated slideOutUp");
        $("#contact_container").css("display","none");
    },800);
})

$('#resume').on("click", function(e){
    $("#resume_container").css("display","inherit");
    $("#resume_container").addClass("animated slideInUp");
    setTimeout(function(){
        $("#resume_container").removeClass("animated slideInUp");
    },800);
})

$('#closeresume').on("click", function(e){
    $("#resume_container").addClass("animated slideOutDown");
    setTimeout(function(){
        $("#resume_container").removeClass("animated slideOutDown");
        $("#resume_container").css("display","none");
    },800);
})

setTimeout(function(){
    $("#loading").addClass("animated fadeOut");
    setTimeout(function(){
      $("#loading").removeClass("animated fadeOut");
      $("#loading").css("display","none");
      $("#box").css("display","none");
      $("#about").removeClass("animated fadeIn");
      $("#contact").removeClass("animated fadeIn");
      $("#work").removeClass("animated fadeIn");
    },1000);
},1500);


let btn = document.querySelector('.mouse-tracking');
btn.addEventListener('mousemove', e => {
  let rect = e.target.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  btn.style.setProperty('--x', x + 'px');
  btn.style.setProperty('--y', y + 'px');
});