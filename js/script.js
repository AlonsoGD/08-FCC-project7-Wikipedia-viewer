 document.addEventListener("DOMContentLoaded", function(event) {
    function wikiApiCall(searchtext) {
        var request = new XMLHttpRequest();
        var apiEndpoint = "https://en.wikipedia.org/w/api.php";
        var params = {
            action: "opensearch",
            format: "json",
            origin: "*",
            search: searchtext,
            limit: 20,
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
                alert("Server reached, but returned an error")
            }
        };
    
        function requestError() {
            alert("There was a connection error");
        }
    
        function showArticles(r) {
            var wikiList = document.getElementById("wikilist");   
            for (var i = 0; i < r[1].length; i++) {
                var adresses = r[3][i];
                var titles = r[1][i];
                var summaries = r[2][i];
                console.log(adresses);
                var liElement = '<li class="wikiarticle"><h2><a href="' + adresses + '" target="_blank">' + titles + '</a></h2><i>' + summaries + '</i></li>';
                wikilist.innerHTML += liElement;
            }
        }
    };    
    function getSearchboxValue() {
        var searchBoxValue = document.getElementById("searchBox").value;
        return searchBoxValue;
    };
    function clearSearchResults() {
        var wikiList = document.getElementById("wikilist");
        wikilist.innerHTML = "";   
    }
    
    //Search box event listener.
    document.getElementById("searchform").addEventListener("submit", function(event){
        clearSearchResults();
        wikiApiCall(getSearchboxValue());
        event.preventDefault();
    });
});