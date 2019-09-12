(function () {
    navigator.getUserMedia_ = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    var isSupported = !!navigator.getUserMedia_;
    var canvas;
    var video;

    video2image = function (elem, options) {
        canvas = elem[0] // our canvas

        if (options === 'isSupported') {
            return isSupported;
        } else if (options === 'capture') {
            return canvas.toDataURL();
        } else if (options === 'stop') {
            video.pause();
            video.srcObject.getTracks().forEach(track => track.stop())
            // console.log($('#'+video.srcObject.id).length)
            return false;
        } else if (options === 'start') {
            return video.play();
        } else {
            // These are the defaults.
            var settings = $.extend({
                width: canvas.clientWidth,
                height: canvas.clientHeight,
                autoplay: true,
                onerror: function () {},
                onsuccess: function () {}
            }, options);

            // canvas context
            var canvasContext = canvas.getContext('2d');

            // video element
            video = document.createElement('video');

            // Update our canvas dimensions
            $(canvas).prop("width", settings.width).prop("height", settings.height);

            // requestAnimationFrame
            window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

            // Write video to our canvas
            function tocanvas() {
                canvasContext.drawImage(video, 0, 0, settings.width, settings.height);
                window.requestAnimationFrame(tocanvas);
            }

            // Set up video
            if (isSupported) {
                //navigator.webkitGetUserMedia({
                navigator.getUserMedia_({
                    video: true
                }, function (stream) {
                    video.srcObject = stream;
                    if (settings.autoplay)
                        video.play();
                    window.requestAnimationFrame(tocanvas);
                    settings.onsuccess();
                }, settings.onerror);
            }
            elem.css({
                width: settings.width,
                height: settings.height
            });
        }
    }

}());

var prodRecommender = (function () {
    "use strict";
    var person = {};
    var aiContainer, aiWrapper;
    return {
        productRecommenderInit: function () {
            var self = this;
            $('body').append('<div class="o-btn o-btn--secondary ai-cta">Image analyzer</div>');
            self.modalFunction();

            $('.ai-cta').on('click', function () {
                $('.ai-wrapper').remove(); 
                self.createDOM('modal-content');
            });
        },
        modalFunction: function () {
            // Get the modal
            var modal = document.getElementById("myModal");

            // Get the button that opens the modal
            var btn = document.getElementsByClassName("ai-cta")[0];

            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];

            // When the user clicks on the button, open the modal
            btn.onclick = function () {
                modal.style.display = "block";
            }

            // When the user clicks on <span> (x), close the modal
            span.onclick = function () {
                modal.style.display = "none";
            }

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        },
        createDOM: function (elem) {
            aiContainer =  $('.'+elem);
            //var container = document.getElementsByClassName(elem)[0];
            aiContainer.append(`
            <div class="ai-wrapper">
            <div class="img-container text-center">
            <h2 class="u-mb-small">Your Personal Gromming Expert</h2>
            <p>Please upload your image</p>

            <div class="img-user">
                <img src="https://dove-en-uk-stage.unileversolutions.com/etc/ui/dove/clientlibs/core/core/images/image_preview.png" alt="image thumbnail" id="theimage">
            </div>

            <div class="click-img-container hide">
                <canvas id="photocanvas" width="216" height="162"></canvas>
            </div>

            <div class="product-form-control" style="margin-bottom: 100px; margin-top: 30px">
                <label for="fileupload" class="o-btn o-btn--ternary" data-upgraded=",MaterialButton,MaterialRipple">Upload
                    Image </label>
                <span>&nbsp; Or &nbsp;</span>
                <label class="o-btn o-btn--ternary takephoto">
                    <span class="takepicbtn" style="display:block">Take photo</span>
                    <span class="hide clicknow" id="clicknow" style="display:block">Click</span>
                </label>
                <input type="file" id="fileupload" class="hidden">
                <canvas class="hidden" id="b64" crossorigin="anonymous"></canvas>
            </div>
        </div>
        </div>
            `);

          aiWrapper = aiContainer.find('.ai-wrapper');  
            this.fileHandler();
        },
        fileHandler: function () {
            var self = this;
            $('#b64').attr('crossOrigin', '*');

            $('#fileupload').on('change', function (eve) {
                // var file = eve.srcElement.files[0];
                $('.img-user').removeClass('hide');
                $('.click-img-container').addClass('hide');
                //$(this).parent().find('.span').toggleClass('hide');

                if (eve.target.files && eve.target.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $('.img-user img').attr('src', e.target.result).parent().addClass('scanning');
                        document.getElementById("b64").innerHTML = e.target.result;

                        self.getDetails();
                    };

                    reader.readAsDataURL(eve.target.files[0]);
                }
            });

            $('.clicknow').on('click', function (e) {
                // click final image from live preview webcam
                //e.stopPropagation();

                document.getElementById("b64").innerHTML = video2image($('#photocanvas'), 'capture');
                video2image($('#photocanvas'), 'stop');
                self.getDetails();
                //$('.click-img-container').removeClass('hide');
                $('.takephoto').find('span').toggleClass('hide');
                $('.click-img-container').removeClass('scanning');
            });

            $('.takepicbtn').on('click', function (e) {
                $('.img-user').addClass('hide');
                $('.click-img-container').removeClass('hide');
                $(this).parent().find('span').toggleClass('hide');
                $('.click-img-container').addClass('scanning');
                self.takephoto();
            });

        },

        takephoto: function () {
            // user wants to take photo, not upload

            video2image($("#photocanvas"), {
                width: 216,
                height: 162,
                autoplay: true,
                onsuccess: function () {},
                onerror: function () {}
            });
        },
        getDetails: function () {

            var self = this;
            var can = document.getElementById("b64");
            var img = document.getElementById("theimage");
            //img.crossOrigin = "Anonymous";
            // var ctx = can.getContext("2d");
            // ctx.drawImage(img, 10, 10);
            var encodedBase = can.toDataURL();

            var strImage = ($('#b64').text()).replace(/^data:image\/[a-z]+;base64,/, "");

            var image = {
                image: strImage
            };

            self.fetchHairType(strImage);

            var xmlhttp = new XMLHttpRequest();
            var result, parsedResult;

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    result = xmlhttp.responseText;
                    if (JSON.parse(result).objects.length > 2) {
                        alert('please upload image with one person only');
                        window.location.reload();
                    }
                    parsedResult = JSON.parse(result)["objects"][1]["attributes"];
                    $('.img-user').removeClass('scanning');

                    var age, gender, emotion, hairColor, hairLength, race;

                    age = parsedResult.age;
                    gender = parsedResult.gender;
                    emotion = parsedResult.emotion;

                    hairColor = Object.keys(parsedResult.hair.color).reduce(function (a, b) {
                        return parsedResult.hair.color[a] > parsedResult.hair.color[b] ? a : b;
                    });

                    hairLength = Object.keys(parsedResult.hair.cut).reduce(function (a, b) {
                        return parsedResult.hair.cut[a] > parsedResult.hair.cut[b] ? a : b;
                    });

                    // race = Object.keys(parsedResult.race).reduce(function (a, b) {
                    //     return parsedResult.race[a] > parsedResult.race[b] ? a : b;
                    // });

                    // if (race == 'asian') {
                    //     race = 'mix';
                    // }

                    person.age = age;
                    person.gender = gender;
                    person.emotion = emotion;
                    person.hairColor = hairColor;
                    person.hairLength = hairLength;
                    // person.race = race;

                    // get data
                    //console.log(person);
                    setTimeout(function(){ 
                        self.analyzeResults(person, $('#b64').text());
                        self.getProductData(person);
                    }, 2000);

                }
            }

            xmlhttp.open("POST", "https://dev.sighthoundapi.com/v1/detections?type=face,person");
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.setRequestHeader("X-Access-Token", "xlFXHAhIh48ETvcrYG6RhnYGAIUFqHP5NyMv");
            xmlhttp.send(JSON.stringify(image));
        },

        fetchHairType: function (strImg) {
            var xmlhttp = new XMLHttpRequest();
            var result, parsedResult;

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    result = xmlhttp.responseText;
                    var parsedResult = JSON.parse(result)['media']['faces'][0]['tags'];
                    var skinType = parsedResult[28].value == 'yes'  ? 'pale' : 'fresh' ;
                    if(typeOf(skinType) === undefined){
                        skinType = 'fresh';
                    }
                    person.skinType = skinType;
                    var hairType = parsedResult[35].value == 'yes' ? 'straight' : parsedResult[36].value == 'yes' ? 'curly' : 'normal';
                    //$('.img-user').removeClass('scanning');
                    person.hairType = hairType;

                }
            }

            var betaJSON = {
                api_key: 'd45fd466-51e2-4701-8da8-04351c872236',
                detection_flags: 'cropface,recognition,content,classifiers,basicpoints,propoints',
                file_base64: strImg,
                original_filename: 'test.jpg'
            }

            xmlhttp.open("POST", "https://www.betafaceapi.com/api/v2/media");
            xmlhttp.setRequestHeader("Content-type", "application/json");
            //xmlhttp.setRequestHeader("X-Access-Token", "xlFXHAhIh48ETvcrYG6RhnYGAIUFqHP5NyMv");
            //xmlhttp.send(JSON.stringify(betaJSON));
            person.hairType = 'fresh';
        },
        analyzeResults: function (person, img) {
            var self = this;
            var ageRange = (person.age - 3) + '-' + (person.age + 2);
            // var container = $('container');
            aiWrapper.after(`
                <div class="analyzerResults text-center">
                <h2>Analysis Results</h2>
                    <div class="analyzer-img-container">
                        
                    </div>
                    <div class="image-description">
                        <p>${person.hairColor} color hair</p>
                        <p>${person.hairLength} hair length</p>
                        <p>${person.hairType} hair type</p>
                        <p> ${person.emotion} emotion</p>
                        <p>${person.skinType} skin type</p>
                        <button class="o-btn o-btn--ternary upload-again">Upload again</button>
                    </div>
                </div>
            `);

            aiWrapper.fadeOut();
            $('.analyzerResults').fadeIn();

            var image = new Image();
            image.src = img;
            document.getElementsByClassName('analyzer-img-container')[0].appendChild(image);
            self.uploadAgain();
        },
        uploadAgain: function () {
            $('.upload-again').on('click', function () {
                aiWrapper.fadeIn();
                $('.analyzerResults').fadeOut().remove();
                $('.productListing').remove();
            });
        },
        getProductData: function (person) {
            var self = this;
            $.ajax({
                url: "http://127.0.0.1:5000/",
                type: 'get',
                dataType: 'json',
                contentType: 'application/json',
                success: function (result) {
                    //console.log(result);
                    self.productListing(result['products_hair'], result['products_skin'], result['articles']);
                },
                data: JSON.stringify(person)
            });
        },
        productListing: function (products_hair, products_skin, articles) {
            //append products here
            $('.analyzerResults').after(`
                <div class="productListing text-center">
                    <h2>Explore Our Products</h2>
                    <div class="productContainer">

                    </div>

                    <h2>Learn more about our expert partners</h2>
                    <div class="articleContainer">

                    </div>

                </div>
            `);
            // var myHair = product['hair'];
            products_hair.forEach(function (product, index) {
                // console.log(product);
                $('.productContainer').append(
                    `
                    <div class="prod-item">
                        <a href="${product.productUrl}">
                            <img src="${product.imgurl}" alt="${product.productUrl}"></img>
                            <p>${product.productName}</p>
                        </a>
                    </div>
                    `
                )
            });

            //var mySkin = product['hair'];
            products_skin.forEach(function (product, index) {
                // console.log(product);
                $('.productContainer').append(
                    `
                    <div class="prod-item">
                        <a href="${product.productUrl}">
                            <img src="${product.imgurl}" alt="${product.productUrl}"></img>
                            <p>${product.productName}</p>
                        </a>
                    </div>
                    `
                )
            });

            articles.forEach(function (article, index) {
                //console.log(article);
                $('.articleContainer').append(`
                    <div class="article-item">                      
                        <a href="${article.article.url}">
                            <img src="${article.article.image}"></img>
                            <div class="article-text-container">
                                <h4>${article.article.title}</h3>
                                <p>${article.article.text}</p>
                            </div>
                        </a>
                    </div>
            `)
            });

        }
    }
}());
