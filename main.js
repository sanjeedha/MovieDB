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


    function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

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



        var arr = [movieapi, peopleapi, tvshowapi];

        var requests = [];

        for(i = 0; i < arr.length; i++) {
            requests.push($.ajax(arr[i]));
        }

        $.when.apply(undefined, requests).done(function(response1, response2, response3){

            allResults.set("movies", response1);
            allResults.set("people", response2);
            allResults.set("tvshows", response3);


            var apiHTML = `            
                <div align="center" style="margin-bottom: 37px">
                    <button class="btn btn-default filter-button" data-filter="all">All</button>
                    <button class="btn btn-default filter-button" data-filter="movies">Movies</button>
                    <button class="btn btn-default filter-button" data-filter="people">People</button>
                    <button class="btn btn-default filter-button" data-filter="tvshows">TV Shows</button>
                </div>
                <br/>
                <br/>  
                <br/> `;

            var finalResults = [];

            var genreMap = {
                28: "Action",
                12: "Adventure",
                16: "Animation",
                35: "Comedy",
                80: "Crime",
                99: "Documentary",
                18: "Drama",
                10751: "Family",
                14: "Fantasy",
                36: "History",
                27: "Horror",
                10402: "Music",
                9648: "Mystery",
                10749: "Romance",
                878: "Science Fiction",
                10770: "TV Movie",
                53: "Thriller",
                10752: "War",
                37: "Western"
            };

            for (var [key, value] of allResults) {

                var res = value[0]["results"];



                for (i=0; i<res.length; i++) {

                    var genreNames = [];

                    if (typeof res[i].genre_ids != "undefined") {
                         console.log(res[i].genre_ids);

                        for(j=0; j<res[i].genre_ids.length; j++){
                            console.log(genreMap[res[i].genre_ids[j]]);
                            genreNames.push(genreMap[res[i].genre_ids[j]]);

                        }
                    }

                    var genreStr = "";

                    if (genreNames.length > 0){
                        genreStr = genreNames.join(", ");
                    }


                    var imgPath = null;

                    if (key == "movies") {
                        imgPath = res[i].poster_path;
                    } else if (key == "tvshows") {
                        imgPath = res[i].poster_path;
                    } else if (key == "people") {
                        imgPath = res[i].profile_path;
                    }

                    var title = null;

                    if (typeof res[i].title != "undefined") {
                        title = res[i].title;
                    } else if (typeof res[i].name != "undefined") {
                        title = res[i].name;
                    }


                    var overview = res[i].overview;
                    var year = res[i].release_date;

                    var rating = null;

                    if (typeof res[i].vote_average != "undefined") {
                        rating = res[i].vote_average;
                    } else if (typeof res[i].popularity != "undefined") {
                        rating = res[i].popularity;
                    }

                    var yearStr = '';
                    var ratingStr = '';
                    if (typeof year != 'undefined') {
                        yearStr = "(" + JSON.stringify(year).substring(1, 5) + ")";
                    }

                    if (typeof rating != 'undefined') {
                        ratingStr = JSON.stringify(rating).substring(0, 4);
                    }
                    var img = null;

                    if(imgPath === null) {
                        img = "https://u.cubeupload.com/Masswap/475noposter.jpg";
                    } else {
                        img = "https://image.tmdb.org/t/p/w500" + imgPath;
                    }


                    var tmpResult = {
                        "title": title,
                        "yearStr": yearStr,
                        "ratingStr": ratingStr,
                        "overview": overview,
                        "img": img,
                        "year": year,
                        "genreStr": genreStr
                    };

                    finalResults.push(tmpResult);

            //         apiHTML += `
            //                 <div class="container gallery_product col-lg-6 col-md-6 col-sm-6 col-xs-6 filter ${key}">
            //                    <div class="frame">
            //                     <a href="#">
        	// <span class="caption">
        	// 	<h2>${title} ${yearStr} <span style="float: right; font-weight: lighter !important;"><span class="fa fa-star checked"></span> ${ratingStr}</span></h2>
            // <p class="desc">${overview}</p>
        	// </span>
            //       <img src=${img} class="img-responsive"></a>
            //     </div>
            //     </div>
            //             `;
                }
            }

            // console.log(finalResults);

            // finalResults.sort(dynamicSort("-ratingStr"));
            // finalResults.sort(dynamicSort("-yearStr"));

            // console.log(finalResults);

            for (i = 0; i < finalResults.length; i++) {
                apiHTML += `
                            <div class="container gallery_product col-lg-6 col-md-6 col-sm-6 col-xs-6 filter ${key}">
                               <div class="frame">
                                <a href="#">
        	<span class="caption">
        		<h2>${finalResults[i].title} ${finalResults[i].yearStr} <span style="float: right; font-weight: lighter !important;"><span class="fa fa-star checked"></span> ${finalResults[i].ratingStr}</span></h2>
                <h2>${finalResults[i].genreStr}</h2>
            <p class="desc">${finalResults[i].overview}</p>
        	</span>              
                  <img src=${finalResults[i].img} class="img-responsive"></a>
                </div>
                </div>
                        `;
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
