"use strict";angular.module("d3",[]).factory("d3Service",["$document","$q","$rootScope",function(a,b,c){function d(){c.$apply(function(){e.resolve(window.d3)})}var e=b.defer(),f=a[0].createElement("script");f.type="text/javascript",f.async=!0,f.src="http://d3js.org/d3.v3.min.js",f.onreadystatechange=function(){"complete"==this.readyState&&d()},f.onload=d;var g=a[0].getElementsByTagName("body")[0];return g.appendChild(f),{d3:function(){return e.promise}}}]),angular.module("aib.timeline",["d3"]),angular.module("aib.timeline").directive("timelineviz",["$q","d3Service",function(a,b){return{restrict:"E",template:'<div id="vis-container"></div>',link:function(a){b.d3().then(function(b){a.$watch("timeline",function(a){a&&(d(),c(a.start,a.end,a.albums))});var c=function(a,c,d){var e=670,f=400,g=b.scale.category20b(),h=50,i=b.select("#vis-container").append("svg").attr("id","timeline-graph").attr("width",e).attr("height",f),j=b.scale.linear().domain([a,c]).range([h,e-2*h]),k=b.scale.linear().domain([b.min(d,function(a){return a.popularity}),b.max(d,function(a){return a.popularity})]).range([f-h,h]),l=b.scale.linear().domain([b.min(d,function(a){return a.popularity}),b.max(d,function(a){return a.popularity})]).range([10,50]),m=b.scale.linear().domain([b.min(d,function(a){return a.popularity}),b.max(d,function(a){return a.popularity})]).range([.9,.35]),n=i.selectAll("g").data(d).enter().append("g").on("mouseenter",function(){b.select(this).select("text").transition().duration(100).style({})}).on("mouseleave",function(){b.select(this).select("text").transition().duration(500).style({})});n.append("circle").attr("fill",function(a){return g(a.name)}).attr("fill-opacity",function(a){return m(a.popularity)}).attr("cx",function(a){return j(new Date(a.release_date).getFullYear())}).attr("cy",f).transition().duration(1e3).attr("cy",function(a){return k(a.popularity)}).attr("r",10).transition().duration(500).attr("r",function(a){return l(a.popularity)}),n.append("text").text(function(a){return a.name}).attr("x",function(a){return j(new Date(a.release_date).getFullYear())}).attr("y",f).transition().duration(1500).attr("y",function(a){return k(a.popularity)}).attr("text-anchor","middle").attr("font-family","sans-serif").attr("font-size","11px").attr("fill","black");var o=b.svg.axis().scale(j).orient("bottom").ticks(5).tickFormat(b.format("<"));i.append("g").attr("class","axis x-axis").attr("transform","translate(0,"+(f-h)+")").call(o);var p=b.svg.axis().orient("left").scale(k);i.append("g").attr("class","axis y-axis").attr("transform","translate("+h+",0)").call(p)},d=function(){b.select("#timeline-graph").remove()}})}}}]),angular.module("aib.services",["underscore"]);var songkickID="zNsbeO3A1boYdJjN",echonestID="ZIIXBXAKFJWAUX2SN";angular.module("aib.services").factory("artistService",["$http",function(a){return{getArtist:function(b){return a.get("https://api.spotify.com/v1/artists/"+b).then(function(a){return a})},getArtistAlbums:function(b){return a.get("https://api.spotify.com/v1/artists/"+b+"/albums",{params:{album_type:"album",country:"GB"}}).then(function(a){return a.albumIds=_.pluck(a.data.items,"id"),a})}}}]),angular.module("aib.services").factory("albumService",["$http",function(a){return{getAlbums:function(b){return a.get("https://api.spotify.com/v1/albums?",{params:{ids:b}}).then(function(a){return a})}}}]),angular.module("aib.services").factory("artistGigography",["$http","$q",function(a,b){return{get:function(c,d){return c=c.replace("songkick:artist:",""),a.jsonp("http://api.songkick.com/api/3.0/artists/"+c+"/gigography.json",{params:{apikey:songkickID,page:d,jsoncallback:"JSON_CALLBACK"}}).then(function(d){for(var e=Math.floor(d.data.resultsPage.totalEntries/d.data.resultsPage.perPage),f=[],g=1;e>=g;g++)f.push(a.jsonp("http://api.songkick.com/api/3.0/artists/"+c+"/gigography.json",{params:{apikey:songkickID,page:g,jsoncallback:"JSON_CALLBACK"}}));return b.all(f).then(function(a){return _.chain(a).map(function(a){return a.data.resultsPage.results.event}).flatten().value()})})}}}]),angular.module("aib.services").factory("echoNest",["$http",function(a){return{getArtistProfile:function(b){return a.jsonp("http://developer.echonest.com/api/v4/artist/profile?bucket=years_active&",{params:{api_key:echonestID,format:"jsonp",id:"spotify:artist:"+b,bucket:"id:songkick",callback:"JSON_CALLBACK"}}).then(function(a){return a.data.response})}}}]),angular.module("aib.services").factory("metaScoreService",["$http",function(a){return{getAlbumScores:function(b){return b=b.replace(" ","-"),a.get("http://nodejs-xwatkins.rhcloud.com/score/"+b).success(function(a){return a}).error(function(a){console.log(a)})}}}]),angular.module("aib.tourmapper",["d3"]),angular.module("aib.tourmapper").factory("mapFactory",["$http",function(a){return{getMapData:function(){return a.get("scripts/tourmap/uk.json").success(function(a){return a})}}}]),angular.module("aib.tourmapper").directive("map",["d3Service","mapFactory",function(a,b){return{template:'<div id="tourmap-container"></div>',restrict:"A",link:function(c){a.d3().then(function(a){c.$watch("gigography",function(a){a&&(d(),e(a))});var d=function(){a.select("#tourmap-graph").remove()},e=function(c){var d=660,e=860,f=(a.scale.sqrt().domain([0,1e6]).range([0,15]),a.select("#tourmap-container").append("svg").attr("id","tourmap-graph").attr("width",d).attr("height",e));b.getMapData().then(function(b){var g=b.data,h=a.geo.albers().center([0,55.4]).rotate([4.4,0]).parallels([50,60]).scale(4e3).translate([d/2,e/2]),i=a.geo.path().projection(h).pointRadius(2);f.selectAll(".subunit").data(topojson.feature(g,g.objects.subunits).features).enter().append("path").attr("class",function(a){return"subunit "+a.id}).attr("d",i),f.append("path").datum(topojson.feature(g,g.objects.places)).attr("d",i).attr("class","place"),f.selectAll(".place-label").data(topojson.feature(g,g.objects.places).features).enter().append("text").attr("class","place-label").attr("transform",function(a){return"translate("+h(a.geometry.coordinates)+")"}).attr("dy",".35em").text(function(a){return a.properties.name}),f.selectAll(".place-label").attr("x",function(a){return a.geometry.coordinates[0]>-1?6:-6}).style("text-anchor",function(a){return a.geometry.coordinates[0]>-1?"start":"end"}),f.selectAll(".event-location").data(eventsToTopoJSON(c)).enter().append("path").attr("d",i.pointRadius(6)).attr("class","event-location"),f.selectAll(".event-number").data(eventsToTopoJSON(c)).enter().append("path").attr("d",i.pointRadius(10)).attr("class","event-location")})}})}}}]);var eventsToTopoJSON=function(a){var b=[];return a.forEach(function(a){b.push({type:"Feature",id:a.id,geometry:{type:"Point",coordinates:[a.location.lng,a.location.lat]},features:{popularity:a.popularity}})}),b};angular.module("aib",["ui.bootstrap","ngRoute","aib.services","aib.timeline","aib.tourmapper","underscore"]),angular.module("aib").config(["$routeProvider","$locationProvider",function(a,b){a.when("/",{redirectTo:"/dashboard/0wz0jO9anccPzH04N7FLBH"}).when("/dashboard/:artistId",{templateUrl:"views/dashboard.html",controller:"AIBController"}).otherwise({redirectTo:"/"})}]),angular.module("aib").controller("TypeaheadCtrl",["$scope","$http","$q","$location",function(a,b,c,d){a.getArtists=function(a){return b.get("https://api.spotify.com/v1/search?",{params:{q:"*"+a+"*",type:"artist"}}).then(function(a){return a.data.artists.items})},a.onSelect=function(a){d.path("dashboard/"+a.id)}}]),angular.module("aib").controller("AIBController",["$scope","$http","$q","$routeParams","artistService","albumService","echoNest","metaScoreService","mapFactory","artistGigography",function(a,b,c,d,e,f,g,h,i,j){a.loadingTimeline=!0,a.loadingHistory=!0,a.artistId=d.artistId;var k=e.getArtist(a.artistId),l=e.getArtistAlbums(a.artistId),m=g.getArtistProfile(a.artistId);c.all([k,m,l]).then(function(b){var d=b[0],e=b[1],g=b[2],i=e.artist.years_active[0].start,k=e.artist.years_active[0].end?e.artist.years_active[0].end:(new Date).getFullYear(),l=f.getAlbums(g.albumIds.join()),m=h.getAlbumScores(e.artist.name);a.loadingTimeline=!1,c.all([l,m]).then(function(b){var c=b[0];c.scores=_.object(_.map(b[1].data.scores,function(a){return[a.album,a.score]})),a.timeline={start:i,end:k,albums:c.data.albums}});var n=_.find(e.artist.foreign_ids,function(a){return"songkick"===a.catalog});j.get(n.foreign_id).then(function(b){a.gigography=b}),a.loadingHistory=!1,a.selectedArtist=d.data})}]);