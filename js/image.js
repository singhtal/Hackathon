var imgupload = (function(){
    
    return {
        
        fileHandler: function(){
            var self = this;

            $('#fileupload').on('change',function(eve){
               // var file = eve.srcElement.files[0];
               $('.img-user').removeClass('hide');
               $('.click-img-container').addClass('hide');
               $(this).find('span').toggleClass('hide');

                if (eve.target.files && eve.target.files[0]) {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        $('.img-user img').attr('src',e.target.result).parent().addClass('scanning');
                        document.getElementById("b64").innerHTML = e.target.result;

                        self.getDetails();
                    };
    
                    reader.readAsDataURL(eve.target.files[0]);
                }
            });

            $('.clicknow').on('click',function(e){
                // click final image from live preview webcam
                e.stopPropagation();
                $('#photocanvas').video2image('capture');
                document.getElementById("b64").innerHTML = $('#photocanvas').video2image('capture');
                $('#photocanvas').video2image('stop');
                self.getDetails();
                //$('.click-img-container').removeClass('hide');
                $('.takephoto').find('span').toggleClass('hide');
            });

            $('.takephoto').on('click', function(e){
                if(e.target.id == "clicknow"){
                    return false;
                }
                $('.img-user').addClass('hide');
                $('.click-img-container').removeClass('hide');
                $(this).find('span').toggleClass('hide');
                self.takephoto();
            });

        },

        takephoto: function(){
            // user wants to take photo, not upload
            $("#photocanvas").video2image({
                width : 216,
                height : 162,
                autoplay : true,
                onsuccess : function () {},
                onerror: function () {}
           });
        },
        getDetails: function(){
            var self = this;
            var can = document.getElementById("b64");
            var img = document.getElementById("theimage");
            var ctx = can.getContext("2d");
            ctx.drawImage(img, 10, 10);
            var encodedBase = can.toDataURL();

            var strImage = ($('#b64').text()).replace(/^data:image\/[a-z]+;base64,/, "");

            var image = { image: 
                strImage
            };
            var xmlhttp = new XMLHttpRequest();
            var result,parsedResult;
            
            xmlhttp.onreadystatechange = function () {
              if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                result = xmlhttp.responseText;
                parsedResult = JSON.parse(result)["objects"][1]["attributes"];
                $('.img-user').removeClass('scanning');


                console.log(parsedResult);

                var person,age,gender,emotion,hairColor,hairLength,race;

                age = parsedResult.age;
                gender = parsedResult.gender;
                emotion = parsedResult.emotion;

                hairColor = Object.keys(parsedResult.hair.color).reduce(function(a,b){
                    return parsedResult.hair.color[a] > parsedResult.hair.color[b] ? a : b ;
                });

                hairLength = Object.keys(parsedResult.hair.cut).reduce(function(a,b){
                    return parsedResult.hair.cut[a] > parsedResult.hair.cut[b] ? a : b ;
                });

                race = Object.keys(parsedResult.race).reduce(function(a,b){
                    return parsedResult.race[a] > parsedResult.race[b] ? a : b ;
                });


                person = {
                    age: age,
                    gender: gender,
                    emotion: emotion,
                    hairColor: hairColor,
                    hairLength: hairLength,
                    race: race
                }
                // get data
                //self.getData(person);
              }
            }
            
            xmlhttp.open("POST", "https://dev.sighthoundapi.com/v1/detections?type=face,person");
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.setRequestHeader("X-Access-Token", "xlFXHAhIh48ETvcrYG6RhnYGAIUFqHP5NyMv");
            xmlhttp.send(JSON.stringify(image));
        },
        getData: function(person){
            $.ajax({url: "http://127.0.0.1:5000/", 
            type: 'get',
            dataType: 'json',
            contentType: 'application/json',
            success: function(result){
                console.log(result);
            },
            data: JSON.stringify(person)
            });
        }
    }
}());

imgupload.fileHandler();