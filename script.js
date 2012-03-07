Map = function(){
 this.map = new Object();
};   

Map.prototype = {   
    put : function(key, value){   
        this.map[key] = value;
    },   
    get : function(key){   
        return this.map[key];
    },
    containsKey : function(key){    
     return key in this.map;
    },
    containsValue : function(value){    
     for(var prop in this.map){
      if(this.map[prop] == value) return true;
     }
     return false;
    },
    isEmpty : function(key){    
     return (this.size() == 0);
    },
    clear : function(){   
     for(var prop in this.map){
      delete this.map[prop];
     }
    },
    remove : function(key){    
     delete this.map[key];
    },
    keys : function(){   
        var keys = new Array();   
        for(var prop in this.map){   
            keys.push(prop);
        }   
        return keys;
    },
    values : function(){   
     var values = new Array();   
        for(var prop in this.map){   
         values.push(this.map[prop]);
        }   
        return values;
    },
    size : function(){
      var count = 0;
      for (var prop in this.map) {
        count++;
      }
      return count;
    },    
    sort : function() {
    	var array = [];
    	for(var key in this.map) {
    		array.push([key, this.map[key]]);	
    	}
    	
    	array.sort(function() {
    		return arguments[1][1] - arguments[0][1];
    	});
    	
    	return array; 
    }
};


var access_token = "";
        
var actorMap = new Map();
var directorMap = new Map();
var recommendMovieMap = new Map();
var sortedActors, sortedDirectors;
var getRecommendMovieFinished = false;
var directorCount = 0;
var actorCount = 0;
var directorMax = -1;
var actorMax = -1;
var index = 0;
var sorted = [];
var recommendMax = -1;
var ytplayer;
var showCount = 1;

function fbMovieListFetch(token) {
	var url = "https://graph.facebook.com/me/movies?access_token=" + token + "&callback=?";
	$.getJSON(url, function(json) {
		var p = "";
		console.log(json);
		if(json === undefined || json === null) fbMovieListFetch(access_token);
		else {
			$.each(json.data, function(i, fb) {
				getMovieInfo(fb.name, null, false, false);
			});
			
			$("#start").fadeIn("slow");	
		}	
		
		
	});
}

var params = {
	"target" : "",
	"query" : "",
	"display" : 0,
	"yearfrom" : "",
	"yearto" : ""
}

function vote(type) {
	if(type === 0) {
		
	} else if(type === 1) {
		
	}
	
	showResult();
}

function showResult() {
	if(getRecommendMovieFinished === true) {
		if(index < recommendMax) {
			$("#versus").fadeOut("slow");
			$("#viewRecommendMovieLoading").fadeIn(500);
			$("#viewRandomMovieLoading").fadeIn(500);

			$("#random_movie > #movie").remove();
			$("#recommend_movie > #movie").remove();

			if(ytplayer != null) {
				$(ytplayer).width(1);
				$(ytplayer).height(1);
			}

			showRecommendMovie(index++);
			showRandomMovieFromRank();
			showCount++;
			var p = ("ROUND&nbsp;&nbsp;" + (showCount) + " / 30");
			$("#count").html(p);
			
			
		}
	} else {
		
		$('#count_bar').slideDown('slow', function() {
    		var p = ("ROUND&nbsp;&nbsp;1 / 30");
			$("#count").html(p);
						
  		});
		$("#start").fadeOut("fast");
		var sortedActors = actorMap.sort();
		var sortedDirectors = directorMap.sort();
		directorMax = sortedDirectors.length;
		if(directorMax > 10)
			directorMax = 10;
		actorMax = sortedActors.length;
		if(actorMax > 10)
			actorMax = 10;

		getRecommendMovies(sortedDirectors, sortedActors);
		
		$("#viewRecommendMovieLoading").fadeIn(500);
		$("#viewRandomMovieLoading").fadeIn(500);

		var myInterval = window.setInterval(function() {

			if(directorCount == directorMax && actorCount == actorMax) {
				clearInterval(myInterval);
				sorted = recommendMovieMap.sort();
				if(sorted === undefined) {
					showResult();	
				}
				
				getRecommendMovieFinished = true;
				//console.log(sorted);
				index = 0;
				recommendMax = sorted.length;
				if(recommendMax > 30)
					recommendMax = 30;

				showRecommendMovie(index++);
				showRandomMovieFromRank();

			}
		}, 20);
	}
}


function showRandomMovieFromRank() {
	var ajax_url = "NaverMovieRank.php";
	$.ajax({
		type : "get",
		url : ajax_url,
		error : function(xhr, status, error) {
			console.log("error : " + status + ", " + error);

		},
		success : function(html) {
			// console.log(html);
			var p = $(html).find("table.list_ranking > tbody > tr > td.title > a");
			p = p[Math.floor(Math.random() * 49)];

			console.log(p);
			var link = "http://movie.naver.com" + $(p).attr("href");
			var title = $(p).text();

			var p = $("<div id='movie' class='movie'><div class='title'><a href='" + link + "' target='_new'>" + title + "</a></div><input type='hidden' value='' id='video_id' /><div id='show_trailer' class='show_trailer' onclick='showTrailer(1);'>Trailer</div><img id ='poster_img' src='' onclick='vote(1);' /'></div>");

			$('#movies > #random_movie').append(p);

			getPosterImage(link, p, "random");

			getRandomMovieTrailer(link);

		}
	});
}

function getRandomMovieTrailer(link) {

	var params = {
		"link" : link
	};
	var q = $.param(params);
	var ajax_url = "NaverMovieInfo.php?" + q;
	$.ajax({
		type : "get",
		url : ajax_url,
		error : function(xhr, status, error) {
			console.log("error : " + status + ", " + error);
		},
		success : function(html) {

			var p = $(html).find("div.movie_spec > div.title_group > h2.title_eng").text();
			var lastIndex = p.lastIndexOf();
			var title = p.substring(0, p.length - 8);
			var year = p.substring(p.length - 6);

			getYoutubeMovie(title, year, "random");
		}
	});

}

function showRecommendMovie(i) {
	if(getRecommendMovieFinished === true && sorted != undefined) {
		console.log(sorted[i]);
		
		if(i < recommendMax) {
			var movie = sorted[i];
			var filmInfo = movie[0].split("|");
			var title = filmInfo[0].substr(0, filmInfo[0].length - 6);
			;
			var year = filmInfo[0].substr(filmInfo[0].length - 5, 4);

			//console.log(title + " " + year);
			//getMovieInfo(title, year, true, true);

			var link = filmInfo[1];
			//$("#viewRecommendMovieLoading").hide();
			var p = $("<div id='movie' class='movie'><div class='title'><a href='" + link + "' target='_new'>" + title + "</a></div><input type='hidden' value='' id='video_id' /><div id='show_trailer' class='show_trailer' onclick='showTrailer(0);'>Trailer</div><img id ='poster_img' src=''onclick='vote(0);' /></div>");

			$('#movies > #recommend_movie').append(p);

			getPosterImage(link, p, "recommend");
			getYoutubeMovie(title, year, "recommend");

		}
	}
}

function loadImage() {
};

function getYoutubeMovie(title, year, type) {
	var youTubeAPIKey = "AI39si7EHr3FOixi92r8WZVcgDMlZKVF_0-h95sR2hWkXngcfdf8zX2Ajnx9HbRo7ToWctvB0qu9MyKMH2a-x-PJ7LEf7OmCFg";
	var url = "https://gdata.youtube.com/feeds/api/videos?key=" + youTubeAPIKey + "&q=" + title + "+" + year + "+trailer&orderby=relevance&max-results=10&v=2&alt=json-in-script&callback=?";
	//console.log(url);
	//console.log(encodeURI(url));
	$.getJSON(url, function(json) {
		var p = "";
		//console.log(json);
		var id;
		if(json.feed.entry != null) {
			$.each(json.feed.entry, function(i, entry) {
				//console.log(entry.title.$t + " : " + entry.content.src);
			});
			id = (json.feed.entry[0].id.$t).split(":");
			//console.log(id);
			if(type === "recommend")
				$("#recommend_movie > #movie > #video_id").val(id[3]);
			else if(type === "random")
				$("#random_movie > #movie > #video_id").val(id[3]);
			//loadVideo(id[3]);
		} else {
			if(type === "recommend")
				$("#recommend_movie > #movie > #show_trailer").hide();
			else if(type === "random")
				$("#random_movie > #movie > #show_trailer").hide();
		}

	});
}

function showTrailer(type) {

	var videoId = "";
	if(type === 0)
		videoId = $("#recommend_movie > #movie > #video_id").val();
	else if(type === 1)
		videoId = $("#random_movie > #movie > #video_id").val();

	if(videoId != "") {
		$("#trailer").width('100%');
		$("#trailer").height('100%');
		$("#trailer").show();
		$("#close_trailer").show();
		loadVideo(videoId);
	} else {
		alert("해당 영화의 트레일러를 찾지 못했습니다.")
	}
}

function hideTrailer() {
	
	$("#trailer").width(1);
	$("#trailer").height(1);
	$("#close_trailer").hide();
	if(ytplayer != null) {
			$(ytplayer).width(1);
			$(ytplayer).height(1);
	}
	
}

// Loads the selected video into the player.
function loadVideo(videoID) {
	if(ytplayer) {
		$(ytplayer).width(480);
		$(ytplayer).height(295);

		console.log("loadVideo");
		ytplayer.loadVideoById(videoID);
	} else {
		// The video to load.
		//var videoID = id[3];//"ylLzyHk54Z0";
		// Lets Flash from another domain call JavaScript
		var params = {
			allowScriptAccess : "always"
		};
		// The element id of the Flash embed
		var atts = {
			id : "ytPlayer"
		};
		// All of the magic handled by SWFObject (http://code.google.com/p/swfobject/)
		swfobject.embedSWF("http://www.youtube.com/v/" + videoID + "?version=3&enablejsapi=1&playerapiid=player1", "youtube", "480", "295", "9", null, null, params, atts);

	}
}

function onYouTubePlayerReady(playerId) {
	ytplayer = document.getElementById("ytPlayer");
	ytplayer.addEventListener("onError", "onPlayerError");
}

// This function is called when an error is thrown by the player
function onPlayerError(errorCode) {
	alert("An error occured of type:" + errorCode);
}

function getPosterImage(link, div, type) {
	var params = {
		"link" : link
	};
	var q = $.param(params);
	var ajax_url = "NaverMovieInfo.php?" + q;
	$.ajax({
		type : "get",
		url : ajax_url,
		error : function(xhr, status, error) {
			console.log("error : " + status + ", " + error);
		},
		success : function(html) {

			var p = $(html).find("div.main_poster > span > a > img");
			var src = p.attr("src");
			if(src != null) {
				//src = src.substring(0, src.length - 10);
				$(div).find("img").attr("src", src);
				//+ "?type=m210");
				if(type === "random") {
					$("#viewRandomMovieLoading").hide();
					$("#random_movie").show();
				}
				else if(type === "recommend") {
					$("#viewRecommendMovieLoading").hide();
					$("#recommend_movie").show();
				}
				
				div.fadeIn("slow");
				if(type === "recommend") {
					$("#versus").fadeIn("slow");
					
				}
			} else {
				if(type === "random") {
					//showRandomMovieFromRank();
					$("#random_movie > #movie").remove();
				} else if(type === "recommend") {
					$("#recommend_movie > #movie").remove();
					recommendMax++;
					if(recommendMax > sorted.length)
						recommendMax = sorted.length;
					showRecommendMovie(index++);
					//showResult();

				}
			}
		}
	});
}

function getRecommendMovies(directors, actors) {
	params.target = "movieman";
	params.display = 5;

	$.each(directors, function(i, director) {
		//console.log(director[0]);

		if(i < directorMax) {
			var factor = director[1];
			params.query = director[0];
			var q = $.param(params);
			var ajax_url = "naver_api_proxy.php?" + q;
			$.ajax({
				type : "get",
				url : ajax_url,
				contentType : "text/xml; charset=utf-8",
				dataType : "xml",
				error : function(xhr, status, error) {
					console.log("error : " + status + ", " + error);

				},
				success : function(xml) {
					var filmo = $(xml).find("filmo");

					$.each(filmo, function(i, film) {
						var title = $(film).find("title").text();
						var link = $(film).find("link").text();
						//console.log(title);
						var count = recommendMovieMap.get(title + "|" + link);
						if(count == null)
							count = 0;
						count += 1 * factor;
						recommendMovieMap.put(title + "|" + link, count);
					});
					directorCount++;
				}
			});
		}
	});

	$.each(actors, function(i, actor) {
		//console.log(actor[0]);
		if(i < actorMax) {

			var factor = actor[1];
			params.query = actor[0];
			var q = $.param(params);
			var ajax_url = "naver_api_proxy.php?" + q;
			$.ajax({
				type : "get",
				url : ajax_url,
				contentType : "text/xml; charset=utf-8",
				dataType : "xml",
				error : function(xhr, status, error) {
					console.log("error : " + status + ", " + error);
					
				},
				success : function(xml) {
					var filmo = $(xml).find("filmo");

					$.each(filmo, function(i, film) {
						var title = $(film).find("title").text();
						var link = $(film).find("link").text();
						//console.log(title);
						var count = recommendMovieMap.get(title + "|" + link);
						if(count == null)
							count = 0;
						count += 1 * factor;
						recommendMovieMap.put(title + "|" + link, count);
					});
					actorCount++;
				}
			});
		}
	});
}

function getMovieInfo(title, year, recommend, show) {
	params.query = title;
	params.target = "movie";
	if(recommend === true)
		params.display = 1;
	else
		params.display = 100;

	if(year != null) {
		params.yearfrom = year;
		params.yearto = year;
	}

	var q = $.param(params);
	var ajax_url = "naver_api_proxy.php?" + q;
	$.ajax({
		type : "get",
		url : ajax_url,
		contentType : "text/xml; charset=utf-8",
		dataType : "xml",
		error : function(xhr, status, error) {
			console.log("error : " + status + ", " + error);

		},
		success : function(xml) {
			//console.log(xml);
			//title in xml.title string or year matching

			$.each($(xml).find("item"), function(i, item) {
				var resultTitle = $(item).find("title").text();
				var subTitle = $(item).find("subtitle").text();
				var pubDate = $(item).find("pubDate").text();
				if(recommend === true && pubDate != year) {
					//console.log("pubDate false");
					return true;
				}

				if(resultTitle.toLowerCase() === title.toLowerCase() || subTitle.toLowerCase() === title.toLowerCase()) {
					//console.log("Found it!!");

					if(show === true) {
						var link = $(item).find("link").text();
						var image = $(item).find("image");
						var imgUrl = "";
						console.log(item);

						if(image.length > 1) {
							var i = 0;
							while(image[0].childNodes[i] === null) {
								i++;
								if(i === image.length) {
									i = -1;
									break;
								}
							}
							if(i != -1) {
								imgUrl = image[0].childNodes[i].nodeValue;

							}
						} else {
							imgUrl = $(image).text();

						}
						//console.log(imgUrl);
						if(imgUrl === "") {

							return true;
						}

						//$("#viewRecommendMovieLoading").hide();
						/*

						 var p = $("<div id='recommend_movie' class='recommend_movie'><a href='"
						 + link + "' target='_new'><div class='title'>"
						 + title + "</div><img id ='poster_img' src='"
						 + imgUrl + "' /></a></div>");
						 $('#movies').append(p);
						 p.fadeIn("slow");
						 */

					}

					if(recommend === false) {

						var actors = $(item).find("actor");
						var directors = $(item).find("director");

						$.each(actors, function(i, actor) {
							if(actor.childNodes[0] != null) {
								var names = actor.childNodes[0].nodeValue;

								$.each(names.split("|"), function(j, name) {
									if(name != "") {
										//console.log(name);
										var count = actorMap.get(name);
										if(count == null)
											count = 0;
										count++;
										actorMap.put(name, count);
									}
								});
							}
						});

						$.each(directors, function(i, director) {
							if(director.childNodes[0] != null) {
								var names = director.childNodes[0].nodeValue;

								$.each(names.split("|"), function(j, name) {
									if(name != "") {
										//console.log(name);
										var count = directorMap.get(name);
										if(count == null)
											count = 0;
										count++;
										directorMap.put(name, count);
									}
								});
							}

						});
					} // end of if(recommend === true)
				} // end of if(resultTitle.toLowerCase() === title.toLowerCase()
				//  || subTitle.toLowerCase() === title.toLowerCase())

			});
			//end of $.each($(xml).find("item"), function(i, item)
		} // end of success: function(xml)
	});
	// end of $.ajax({
}
