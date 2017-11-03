 document.addEventListener("DOMContentLoaded", function(event) {
    function wikiApiCall(searchtext) {
        var request = new XMLHttpRequest();
        var apiEndpoint = "https://en.wikipedia.org/w/api.php";
        var params = {
            action: "opensearch",
            format: "json",
            origin: "*",
            search: searchtext,
            limit: 16,
            };
    
        var esc = encodeURIComponent;
        var query = Object.keys(params)
            .map(function(k) {return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);})
            .join('&');    
    
        request.open("GET", apiEndpoint + "?" + query, true);
        request.send();
        
        request.onload = requestSuccess;
        request.onerror = requestError;
        
        function requestSuccess() {
            if (request.status >= 200 && request.status < 400) {
                var resp = JSON.parse(request.response);
                showArticles(resp);     
            } else {
                console.log("Server reached, but returned an error")
            }
        };
    
        function requestError() {
            console.log("There was a connection error");
        }
    
        function showArticles(r) {
            var wikiList = document.getElementById("wikilist");   
            for (var i = 0; i < r[1].length; i++) {
                wikilist.innerHTML += '<li class="wikiarticle"><h2><a href="' + r[3][i] + '" target="_blank">' + r[1][i]+ '</a></h2><i>' + r[2][i] + '</i></li>';
            }
        }
    };    
    function getSearchboxValue() {
        var searchBoxValue = document.getElementById("searchBox").value;
        return searchBoxValue;
    };
      
    document.getElementById("searchBox").addEventListener("search", function(event){
        console.log("Test");
        wikiApiCall(getSearchboxValue());

    });
});