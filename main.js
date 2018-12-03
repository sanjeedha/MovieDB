$(document).ready(function(e){
    $('.search-panel .dropdown-menu').find('a').click(function(e) {
        e.preventDefault();
        var param = $(this).attr("href").replace("#","");
        var concept = $(this).text();
        $('.search-panel span#search_concept').text(concept);
        $('.input-group #search_param').val(param);
    });
});


$(document).ready(function(){

    var allResults = new Map();

    $("#search-button").click(function(){

        var searchterm = $("#search-box").val();

        var movieapi = {
            "async": true,
            "crossDomain": true,
            "url": `https://api.themoviedb.org/3/search/movie?api_key=ddb907d69f1671fabdfd75c40b664a37&language=en-US&query=${searchterm}&page=1&include_adult=false`,
            "method": "GET",
            "headers": {},
            "data": "{}"
        };

        var peopleapi = {
            "async": true,
            "crossDomain": true,
            "url": `https://api.themoviedb.org/3/search/person?api_key=ddb907d69f1671fabdfd75c40b664a37&language=en-US&query=${searchterm}&page=1&include_adult=false`,
            "method": "GET",
            "headers": {},
            "data": "{}"
        };

        var tvshowapi = {
            "async": true,
            "crossDomain": true,
            "url": `https://api.themoviedb.org/3/search/tv?api_key=ddb907d69f1671fabdfd75c40b664a37&language=en-US&query=${searchterm}&page=1&include_adult=false`,
            "method": "GET",
            "headers": {},
            "data": "{}"
        };

        var companyapi = {
            "async": true,
            "crossDomain": true,
            "url": `https://api.themoviedb.org/3/search/company?api_key=ddb907d69f1671fabdfd75c40b664a37&language=en-US&query=${searchterm}&page=1&include_adult=false`,
            "method": "GET",
            "headers": {},
            "data": "{}"
        };

        var keywordapi = {
            "async": true,
            "crossDomain": true,
            "url": `https://api.themoviedb.org/3/search/keyword?api_key=ddb907d69f1671fabdfd75c40b664a37&language=en-US&query=${searchterm}&page=1&include_adult=false`,
            "method": "GET",
            "headers": {},
            "data": "{}"
        };

        var arr = [movieapi, peopleapi, tvshowapi, companyapi, keywordapi];

        var callback = function() {
            console.log("done");
        };

        var requests = [];

        for(i = 0; i < arr.length; i++) {
            requests.push($.ajax(arr[i]));
        }

        $.when.apply(undefined, requests).done(function(response1, response2, response3, response4, response5){

            allResults.set("movies", response1);
            allResults.set("people", response2);
            allResults.set("tvshows", response3);
            allResults.set("companies", response4);
            allResults.set("keywords", response5);

            var apiHTML = `            
                <div align="center" style="margin-bottom: 37px">
                    <button class="btn btn-default filter-button" data-filter="all">All</button>
                    <button class="btn btn-default filter-button" data-filter="movies">Movies</button>
                    <button class="btn btn-default filter-button" data-filter="people">People</button>
                    <button class="btn btn-default filter-button" data-filter="tvshows">TV Shows</button>
                    <button class="btn btn-default filter-button" data-filter="companies">Companies</button>
                    <button class="btn btn-default filter-button" data-filter="keywords">Keywords</button>
                </div>
                <br/>
                <br/>  
                <br/>

            `;

            for (var [key, value] of allResults) {

                var res = value[0]["results"];

                for (i=0; i<res.length; i++) {

                    var imgPath = null;

                    if (key == "movies") {
                        imgPath = res[i].poster_path;
                    } else if (key == "tvshows") {
                        imgPath = res[i].poster_path;
                    } else if (key == "people") {
                        imgPath = res[i].profile_path;
                    }

                    var img = null;

                    if(imgPath === null) {
                        img = "https://u.cubeupload.com/Masswap/475noposter.jpg";
                    } else {
                        img = "https://image.tmdb.org/t/p/w500" + imgPath;
                    }

                    apiHTML += `
                            <div class="container gallery_product col-lg-6 col-md-6 col-sm-6 col-xs-6 filter ${key}">
                                <img src=${img} class="img-responsive">
                            </div>
                        `;
                }
            }



            $("#api-results").html(apiHTML);

            $(".filter-button").click(function(){
                var value = $(this).attr('data-filter');

                if(value == "all")
                {
                    $('.filter').show('1000');
                }
                else
                {
                    $(".filter").not('.'+value).hide('3000');
                    $('.filter').filter('.'+value).show('3000');

                }
            });

            if ($(".filter-button").removeClass("active")) {
                $(this).removeClass("active");
            }
            $(this).addClass("active");

        });



    });




});
