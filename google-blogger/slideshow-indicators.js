function currentDiv(n) {showDivs(slideIndex = n);}
function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo_aovang");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" w3-opacity-off", "");
  }
  x[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " w3-opacity-off";
}


var myAutoSlide = 0; carousel();
function carousel() {
  var i_aodo;
  var x_aodo = document.getElementsByClassName("mySlides2");
  for (i_aodo = 0; i_aodo < x_aodo.length; i_aodo++) {
    x_aodo[i_aodo].style.display = "none";  
  }
  myAutoSlide++;
  if (myAutoSlide > x_aodo.length) {myAutoSlide = 1}    
  x_aodo[myAutoSlide-1].style.display = "block";  
  setTimeout(carousel, 2000); // Change image every 2 seconds
}


var slideAodaiHong = 1; showAodaiHong(slideAodaiHong);
function plusDivs(n) {showAodaiHong(slideAodaiHong += n);}
function showAodaiHong(n) {
  var hong;
  var aohong = document.getElementsByClassName("mySlides3");
  if (n > aohong.length) {slideAodaiHong = 1}
  if (n < 1) {slideAodaiHong = aohong.length}
  for (hong = 0; hong < aohong.length; hong++) {
     aohong[hong].style.display = "none";  
  }
  aohong[slideAodaiHong-1].style.display = "block";  
}


var slideAodaiTim = 1; showAodaiTim(slideAodaiTim);
function plusAotim(n) {showAodaiTim(slideAodaiTim += n);}
function currentAotim(n) {showAodaiTim(slideAodaiTim = n);}

function showAodaiTim(n) {
  var i_aotim;
  var x_aotim = document.getElementsByClassName("mySlides4");
  var dots_aotim = document.getElementsByClassName("demo_aotim");
  if (n > x_aotim.length) {slideAodaiTim = 1}    
  if (n < 1) {slideAodaiTim = x_aotim.length}
  for (i_aotim = 0; i_aotim < x_aotim.length; i_aotim++) {
    x_aotim[i_aotim].style.display = "none";  
  }
  for (i_aotim = 0; i_aotim < dots_aotim.length; i_aotim++) {
    dots_aotim[i_aotim].className = dots_aotim[i_aotim].className.replace(" w3-red", "");
  }
  x_aotim[slideAodaiTim-1].style.display = "block";  
  dots_aotim[slideAodaiTim-1].className += " w3-red";
}


var slideAodaiTrang = 1; showAodaiTrang(slideAodaiTrang);
function plusAotrang(n) {showAodaiTrang(slideAodaiTrang += n);}
function currentAotrang(n) {showAodaiTrang(slideAodaiTrang = n);}
function showAodaiTrang(n) {
  var i_aotrang;
  var x_aotrang = document.getElementsByClassName("mySlides5");
  var dots_aotrang = document.getElementsByClassName("demo_aotrang");
  if (n > x_aotrang.length) {slideAodaiTrang = 1}
  if (n < 1) {slideAodaiTrang = x_aotrang.length}
  for (i_aotrang = 0; i_aotrang < x_aotrang.length; i_aotrang++) {
    x_aotrang[i_aotrang].style.display = "none";  
  }
  for (i_aotrang = 0; i_aotrang < dots_aotrang.length; i_aotrang++) {
    dots_aotrang[i_aotrang].className = dots_aotrang[i_aotrang].className.replace(" w3-white", "");
  }
  x_aotrang[slideAodaiTrang-1].style.display = "block";  
  dots_aotrang[slideAodaiTrang-1].className += " w3-white";
}


var index_AodaiDen = 0; carousel_AodaiDen();
function carousel_AodaiDen() {
  var i_aoden;
  var x_aoden = document.getElementsByClassName("mySlides6");
  for (i_aoden = 0; i_aoden < x_aoden.length; i_aoden++) {
    x_aoden[i_aoden].style.display = "none";  
  }
  index_AodaiDen++;
  if (index_AodaiDen > x_aoden.length) {index_AodaiDen = 1}    
  x_aoden[index_AodaiDen-1].style.display = "block";  
  setTimeout(carousel_AodaiDen, 2500);    
}


var index_AodaiXanh = 0; carousel_AodaiXanh();
function carousel_AodaiXanh() {
  var i_aoxanh;
  var x_aoxanh = document.getElementsByClassName("mySlides7");
  for (i_aoxanh = 0; i_aoxanh < x_aoxanh.length; i_aoxanh++) {
    x_aoxanh[i_aoxanh].style.display = "none";  
  }
  index_AodaiXanh++;
  if (index_AodaiXanh > x_aoxanh.length) {index_AodaiXanh = 1}    
  x_aoxanh[index_AodaiXanh-1].style.display = "block";  
  setTimeout(carousel_AodaiXanh, 9000);    
}
