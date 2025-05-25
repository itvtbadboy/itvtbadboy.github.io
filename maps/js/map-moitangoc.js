(function ($) {
    "use strict";
    function mainMap() {
        function locationData(locationURL, locationImg, locationTitle, locationAddress, locationCategory, locationStarRating, locationRevievsCounter, locationStatus) {
            return ('<div class="map-popup-wrap"><div class="map-popup"><div class="infoBox-close"><i class="fal fa-times"></i></div><a class="listing-img-content fl-wrap"><div class="infobox-status '+ locationStatus +'">' + locationStatus + '</div><img src="' + locationImg + '" alt="diet moi tan goc"><div class="card-popup-raining map-card-rainting" data-staRrating="' + locationStarRating + '"><span class="map-popup-reviews-count">( ' + locationRevievsCounter + ' reviews )</span></div></a> <div class="listing-content"><div class="listing-content-item fl-wrap"><div class="map-popup-location-category ' + locationCategory + '"></div><div class="listing-title fl-wrap"><h4><a>' + locationTitle + '</a></h4><div class="map-popup-location-info"><i class="fas fa-map-marker-alt"></i>' + locationAddress + '</div></div><div class="map-popup-footer"><a href=' + locationURL + ' class="main-link" title="Diệt mối tận gốc" target="_blank">Thông tin <i class="fal fa-long-arrow-right"></i></a><a href="https://dietmoibr.thuongmai.blog/" class="infowindow_wishlist-btn" title="Diệt mối tận gốc" target="_blank"><i class="fal fa-tablet"></i></a></div></div></div></div> ')
        }
	    //  Map Infoboxes ------------------
        var locations = [
// BARIA
[locationData('https://dietmoibr.thuongmai.blog/dietmoi/baria/diet-moi-ba-ria-biet-thu-long-tam.html', 'https://wiki.thuongmai.blog/images/6/69/Logo-biet-thu-anh-tinh-long-tam.jpg', 'Biệt thự Bà Rịa', "Long Tâm Bà Rịa, VN", 'hotels-cat', "5", "5", "Bà Rịa"  ), 10.5035763, 107.1986748, 0 , 'https://wiki.thuongmai.blog/images/6/69/Logo-biet-thu-anh-tinh-long-tam.jpg'],
[locationData('https://dietmoibr.thuongmai.blog/dietmoi/baria/diet-moi-ba-ria-nha-lau-phuoc-nguyen.html', 'https://wiki.thuongmai.blog/images/d/d3/Logo-nha-chi-nghia-phuoc-nguyen.jpg', 'Nhà lầu Bà Rịa', "Phước Nguyên Bà Rịa, VN", 'hotels-cat', "5", "5", "Bà Rịa"  ), 10.4982362, 107.1772362, 1 , 'https://wiki.thuongmai.blog/images/d/d3/Logo-nha-chi-nghia-phuoc-nguyen.jpg'],
[locationData('https://dietmoibr.thuongmai.blog/dietmoi/baria/diet-moi-ba-ria-san-bong-phuoc-hung.html', 'https://wiki.thuongmai.blog/images/a/ad/Logo-san-van-dong-scg-phuoc-hung.jpg', 'Sân bóng Bà Rịa', "Phước Hưng Bà Rịa, VN", 'cafe-cat', "5", "5", "Bà Rịa"  ), 10.5076282, 107.1741352, 2 , 'https://wiki.thuongmai.blog/images/a/ad/Logo-san-van-dong-scg-phuoc-hung.jpg'],
[locationData('https://dietmoibr.thuongmai.blog/dietmoi/baria/diet-moi-ba-ria-nha-kho-hoa-long.html', 'https://wiki.thuongmai.blog/images/4/47/Logo-nha-go-anh-thien-hoa-long.jpg', 'Nhà kho Bà Rịa', "Hòa Long Bà Rịa, VN", 'hotels-cat', "5", "5", "Bà Rịa"  ), 10.5301007, 107.1936435, 3 , 'https://wiki.thuongmai.blog/images/4/47/Logo-nha-go-anh-thien-hoa-long.jpg'],
// LONGDIEN
[locationData('https://dietmoibr.thuongmai.blog/dietmoi/longdien/diet-moi-long-dien-nha-bep-phuoc-hai.html', 'https://wiki.thuongmai.blog/images/4/4b/Logo-nha-co-6-phuoc-hai.jpg', 'Nhà bếp Long Điền', "Phước Hải Long Điền, VN", 'hotels-cat', "5", "5", "Long Điền"  ), 10.4123287, 107.2596896, 0 , 'https://wiki.thuongmai.blog/images/4/4b/Logo-nha-co-6-phuoc-hai.jpg'],
[locationData('https://dietmoibr.thuongmai.blog/dietmoi/longdien/diet-moi-long-dien-nha-hang-long-hai.html', 'https://wiki.thuongmai.blog/images/d/d9/Logo-hai-dong-long-hai-restaurant.jpg', 'Nhà hàng Long Điền', "Long Hải Long Điền, VN", 'cafe-cat', "5", "5", "Long Điền"  ), 10.4017719, 107.2317442, 1 , 'https://wiki.thuongmai.blog/images/d/d9/Logo-hai-dong-long-hai-restaurant.jpg'],
// TANTHANH
[locationData('https://dietmoibr.thuongmai.blog/dietmoi/tanthanh/diet-moi-tan-thanh-nha-bep-phu-my.html', 'https://wiki.thuongmai.blog/images/a/a0/Logo-nha-anh-hoang-phu-my.jpg', 'Nhà bếp Phú Mỹ', "Phú Mỹ Tân Thành, VN", 'hotels-cat', "5", "5", "Tân Thành"  ), 10.5813864, 107.0513789, 0 , 'https://wiki.thuongmai.blog/images/a/a0/Logo-nha-anh-hoang-phu-my.jpg'],
[locationData('https://dietmoibr.thuongmai.blog/dietmoi/tanthanh/diet-moi-tan-thanh-cong-ty-my-xuan.html', 'https://wiki.thuongmai.blog/images/e/e6/Logo-cty-thai-binh-duong-my-xuan.jpg', 'Công ty Mỹ Xuân', "Mỹ Xuân Tân Thành, VN", 'hotels-cat', "5", "5","Tân Thành"  ), 10.6312519, 107.0309758, 1 , 'https://wiki.thuongmai.blog/images/e/e6/Logo-cty-thai-binh-duong-my-xuan.jpg'],
[locationData('https://dietmoibr.thuongmai.blog/dietmoi/tanthanh/diet-moi-tan-thanh-nha-lau-phu-my.html', 'https://wiki.thuongmai.blog/images/0/05/Logo-nha-anh-tuan-phu-my.jpg', 'Nhà lầu Phú Mỹ ', "Phú Mỹ Tân Thành, VN", 'hotels-cat', "5", "5", "Tân Thành"  ), 10.5823864, 107.0523789, 2 , 'https://wiki.thuongmai.blog/images/0/05/Logo-nha-anh-tuan-phu-my.jpg'],
[locationData('https://dietmoibr.thuongmai.blog/dietmoi/tanthanh/diet-moi-tan-thanh-ca-phe-vuon-my-xuan.html', 'https://wiki.thuongmai.blog/images/5/5f/Logo-nha-san-go-anh-hien-my-xuan.jpg', 'Cà phê Mỹ Xuân', "Mỹ Xuân Tân Thành, VN", 'cafe-cat', "5", "5", "Tân Thành"  ), 10.6322519, 107.0319758, 3 , 'https://wiki.thuongmai.blog/images/5/5f/Logo-nha-san-go-anh-hien-my-xuan.jpg'],
[locationData('https://dietmoibr.thuongmai.blog/dietmoi/tanthanh/diet-moi-tan-thanh-biet-thu-my-xuan.html', 'https://wiki.thuongmai.blog/images/8/87/Logo-biet-thu-anh-doan-my-xuan.jpg', 'Biệt thự Mỹ Xuân', "Mỹ Xuân Tân Thành, VN", 'hotels-cat', "5", "5", "Tân Thành"  ), 10.6332519, 107.0329758, 4 , 'https://wiki.thuongmai.blog/images/8/87/Logo-biet-thu-anh-doan-my-xuan.jpg'],
// VUNGTAU
[locationData('https://dietmoibr.thuongmai.blog/dietmoi/vungtau/diet-moi-vung-tau-nha-hang-phuong-7.html', 'https://wiki.thuongmai.blog/images/b/b1/Logo-nha-hang-maxim-phuong-7.jpg', 'Nhà hàng Vũng Tàu', "Phường 7 Vũng Tàu, VN", 'cafe-cat', "5", "5", "Vũng Tàu"  ), 10.3642406, 107.0780898, 0 , 'https://wiki.thuongmai.blog/images/b/b1/Logo-nha-hang-maxim-phuong-7.jpg'],
[locationData('https://dietmoibr.thuongmai.blog/dietmoi/vungtau/diet-moi-vung-tau-nha-lau-phuong-8.html', 'https://wiki.thuongmai.blog/images/b/bc/Logo-nha-chi-thuy-phuong-8.jpg', 'Nhà lầu Vũng Tàu', "Phường 8 Vũng Tàu, VN", 'hotels-cat', "5", "5", "Vũng Tàu"  ), 10.3572905, 107.0946551, 1 , 'https://wiki.thuongmai.blog/images/b/bc/Logo-nha-chi-thuy-phuong-8.jpg'],
[locationData('https://dietmoibr.thuongmai.blog/dietmoi/vungtau/diet-moi-vung-tau-nha-lau-phuong-10.html', 'https://wiki.thuongmai.blog/images/a/a7/Logo-nha-anh-binh-phuong-10-vung-tau.jpg', 'Nhà lầu Vũng Tàu', "Phường 10 Vũng Tàu, VN", 'hotels-cat', "5", "5", "Vũng Tàu"  ), 10.3920637, 107.1120322, 2 , 'https://wiki.thuongmai.blog/images/a/a7/Logo-nha-anh-binh-phuong-10-vung-tau.jpg'],
[locationData('https://dietmoibr.thuongmai.blog/dietmoi/vungtau/diet-moi-vung-tau-khach-san-phuong-2.html', 'https://wiki.thuongmai.blog/images/d/dd/Logo-khach-san-rubi-phuong-2.jpg', 'Khách sạn Vũng Tàu', "Phường 2 Vũng Tàu, VN", 'gym-cat', "5", "5", "Vũng Tàu"  ), 10.3331387, 107.0859051, 3 , 'https://wiki.thuongmai.blog/images/d/dd/Logo-khach-san-rubi-phuong-2.jpg'],
[locationData('https://dietmoibr.thuongmai.blog/dietmoi/vungtau/diet-moi-vung-tau-biet-thu-phuong-5.html', 'https://wiki.thuongmai.blog/images/3/3d/Logo-biet-thu-toan-hao-phuong-5.jpg', 'Biệt thự Vũng Tàu', "Phường 5 Vũng Tàu, VN", 'gym-cat', "5", "5", "Vũng Tàu"  ), 10.3553121, 107.0634411, 4 , 'https://wiki.thuongmai.blog/images/3/3d/Logo-biet-thu-toan-hao-phuong-5.jpg'],
// XUYENMOC
[locationData('https://dietmoibr.thuongmai.blog/dietmoi/xuyenmoc/diet-moi-xuyen-moc-song-bai-phuoc-thuan.html', 'https://wiki.thuongmai.blog/images/0/0e/Logo-casino-ho-tram-phuoc-thuan.jpg', 'Sòng bài Xuyên Mộc', "Phước Thuận Xuyên Mộc, VN", 'gym-cat', "5", "5", "Xuyên Mộc"  ), 10.4855987, 107.4521313, 0 , 'https://wiki.thuongmai.blog/images/0/0e/Logo-casino-ho-tram-phuoc-thuan.jpg'],
        ];
	    //   Map Infoboxes end ------------------
        var map = new google.maps.Map(document.getElementById('map-main'), {
            zoom: 6,
            scrollwheel: false,
            center: new google.maps.LatLng(15.7939252, 105.9102589),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            panControl: false,
            fullscreenControl: false,
            navigationControl: false,
            streetViewControl: false,
            animation: google.maps.Animation.BOUNCE,
            gestureHandling: 'cooperative',
            styles: [{
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#444444"
                }]
            }]
        });
        var boxText = document.createElement("div");
        boxText.className = 'map-box'
        var currentInfobox;
        var boxOptions = {
            content: boxText,
            disableAutoPan: true,
            alignBottom: true,
            maxWidth: 0,
            pixelOffset: new google.maps.Size(-150, -55),
            zIndex: null,
            boxStyle: {
                width: "300px"
            },
            closeBoxMargin: "0",
            closeBoxURL: "",
            infoBoxClearance: new google.maps.Size(1, 1),
            isHidden: false,
            pane: "floatPane",
            enableEventPropagation: false,
        };

      var markerCluster, overlay, i;
      var allMarkers = [];

      var clusterStyles = [
        {
          textColor: 'white',
          url: '',
          height: 50,
          width: 50
        }
      ];

      var ib = new InfoBox();
             google.maps.event.addListener(ib, "domready", function () {
                cardRaining();
 
            });
	  var markerImg;
	  var markerCount;
      for (i = 0; i < locations.length; i++) {
             var labels = 'phuongnam';
		markerImg = locations[i][4];
		markerCount = locations[i][3] + 1;
        var overlaypositions = new google.maps.LatLng(locations[i][1], locations[i][2]),

        overlay = new CustomMarker(
         overlaypositions, map,{ marker_id: i},  markerImg , markerCount
        );

        allMarkers.push(overlay);

        google.maps.event.addDomListener(overlay, 'click', (function(overlay, i) {

        return function() {
             ib.setOptions(boxOptions);
             boxText.innerHTML = locations[i][0];
             ib.close();
             ib.open(map, overlay);
             currentInfobox = locations[i][3];
 
                    var latLng = new google.maps.LatLng(locations[i][1], locations[i][2]);
                    map.panTo(latLng);
                    map.panBy(0, -110);

            google.maps.event.addListener(ib,'domready',function(){
              $('.infoBox-close').click(function(e) {
                  e.preventDefault();
                  ib.close();
                  $('.map-marker-container').removeClass('clicked infoBox-opened');
              });

            });

          }
        })(overlay, i));

      }
        var options2 = {
            imagePath: '',
            styles: clusterStyles,
            minClusterSize: 2
        };
        markerCluster = new MarkerClusterer(map, allMarkers, options2);
        google.maps.event.addDomListener(window, "resize", function () {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        });
 
        $('.map-item').on("click", function (e) {
            e.preventDefault();
            map.setZoom(15);
            var index = currentInfobox;
            var marker_index = parseInt($(this).attr('href').split('#')[1], 10);
            google.maps.event.trigger(allMarkers[marker_index-1], "click");
            if ($(window).width() > 1064) {
                if ($(".map-container").hasClass("fw-map")) {
                    $('html, body').animate({
                        scrollTop: $(".map-container").offset().top + "-110px"
                    }, 1000)
                    return false;
                }
            }
        });
        $('.nextmap-nav').on("click", function (e) {
            e.preventDefault();
             map.setZoom(15);
            var index = currentInfobox;
            if (index + 1 < allMarkers.length) {
                google.maps.event.trigger(allMarkers[index+ 1], 'click');
            } else {
                google.maps.event.trigger(allMarkers[0], 'click');
            }
        });
        $('.prevmap-nav').on("click", function (e) {
            e.preventDefault();
            map.setZoom(15);
            if (typeof (currentInfobox) == "undefined") {
                google.maps.event.trigger(allMarkers[allMarkers.length - 1], 'click');
            } else {
                var index = currentInfobox;
                if (index - 1 < 0) {
                    google.maps.event.trigger(allMarkers[allMarkers.length - 1], 'click');
                } else {
                    google.maps.event.trigger(allMarkers[index - 1], 'click');
                }
            }
        });
      // Scroll enabling button
      var scrollEnabling = $('.scrollContorl');

      $(scrollEnabling).click(function(e){
          e.preventDefault();
          $(this).toggleClass("enabledsroll");

          if ( $(this).is(".enabledsroll") ) {
             map.setOptions({'scrollwheel': true});
          } else {
             map.setOptions({'scrollwheel': false});
          }
      });		
        var zoomControlDiv = document.createElement('div');
        var zoomControl = new ZoomControl(zoomControlDiv, map);
        function ZoomControl(controlDiv, map) {
            zoomControlDiv.index = 1;
            map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(zoomControlDiv);
            controlDiv.style.padding = '5px';
            var controlWrapper = document.createElement('div');
            controlDiv.appendChild(controlWrapper);
            var zoomInButton = document.createElement('div');
            zoomInButton.className = "mapzoom-in";
            controlWrapper.appendChild(zoomInButton);
            var zoomOutButton = document.createElement('div');
            zoomOutButton.className = "mapzoom-out";
            controlWrapper.appendChild(zoomOutButton);
            google.maps.event.addDomListener(zoomInButton, 'click', function () {
                map.setZoom(map.getZoom() + 1);
            });
            google.maps.event.addDomListener(zoomOutButton, 'click', function () {
                map.setZoom(map.getZoom() - 1);
            });
        }
		
		
      // Geo Location Button
      $(".geoLocation, .input-with-icon.location a").on("click", function (e) {
          e.preventDefault();
          geolocate();
      });

      function geolocate() {

          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function (position) {
                  var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                  map.setCenter(pos);
                  map.setZoom(12);
				  
		  var avrtimg = $(".avatar-img").attr("data-srcav");
         var markerIcon3 = {
            url: avrtimg,
        }		
        var marker3 = new google.maps.Marker({
            position: pos,
             map: map,
 
            icon: markerIcon3,
            title: 'vị trí hiện tại'
        });			  
	 var myoverlay = new google.maps.OverlayView();
       myoverlay.draw = function () {
           // add an id to the layer that includes all the markers so you can use it in CSS
           this.getPanes().markerLayer.id='markerLayer';
       };
       myoverlay.setMap(map);			  
				  
              });
          }
      }		
    }

    // Custom Map Marker
    // ----------------------------------------------- //

    function CustomMarker(latlng, map, args,   markerImg , markerCount) {
      this.latlng = latlng;
      this.args = args;
 
	  this.markerImg = markerImg;
	  this.markerCount = markerCount;
      this.setMap(map);
    }

    CustomMarker.prototype = new google.maps.OverlayView();

    CustomMarker.prototype.draw = function() {

      var self = this;

      var div = this.div;

      if (!div) {

        div = this.div = document.createElement('div');
        div.className = 'map-marker-container';

        div.innerHTML = '<div class="marker-container">'+
							'<span class="marker-count">'+self.markerCount+'</span>'+
                            '<div class="marker-card">'+
                               '<div class="marker-holder"><img src="'+self.markerImg+'" alt="diet moi ba ria"></div>'+
                            '</div>'+
                         '</div>'
 

        // Clicked marker highlight
        google.maps.event.addDomListener(div, "click", function(event) {
            $('.map-marker-container').removeClass('clicked infoBox-opened');
            google.maps.event.trigger(self, "click");
            $(this).addClass('clicked infoBox-opened');
        });


        if (typeof(self.args.marker_id) !== 'undefined') {
          div.dataset.marker_id = self.args.marker_id;
        }

        var panes = this.getPanes();
        panes.overlayImage.appendChild(div);
      }

      var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

      if (point) {
        div.style.left = (point.x) + 'px';
        div.style.top = (point.y) + 'px';
      }
    };

    CustomMarker.prototype.remove = function() {
      if (this.div) {
        this.div.parentNode.removeChild(this.div);
        this.div = null; $(this).removeClass('clicked');
      }
    };

    CustomMarker.prototype.getPosition = function() { return this.latlng; };

    // -------------- Custom Map Marker / End -------------- //	
	
	
var head = document.getElementsByTagName( 'head' )[0];

// Save the original method
var insertBefore = head.insertBefore;

// Replace it!
head.insertBefore = function( newElement, referenceElement ) {

    if ( newElement.href && newElement.href.indexOf( 'https://fonts.googleapis.com/css?family=Roboto' ) === 0 ) {
        return;
    }

    insertBefore.call( head, newElement, referenceElement );
};	
	
	    var map = document.getElementById('map-main');
    if (typeof (map) != 'undefined' && map != null) {
        google.maps.event.addDomListener(window, 'load', mainMap);
    }

})(this.jQuery);
