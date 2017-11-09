 document.addEventListener("DOMContentLoaded", function(event) {
    //detect browser
    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;
    var searchDone = false;   

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
                //added a onClick property so the entire li is clickeable
                var liElement = "<li onClick='window.open(\"" + adresses + "\", \"_blank\")' class='wikiarticle'><h2><a target='_blank' href='" + adresses + "'>" + titles + "</a></h2><i>" + summaries + "</i></li>";             
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
    };

    function addClass(elements, myClass) {
        // if there are no elements, we're done
        if (!elements) { return; }
    
        // if we have a selector, get the chosen elements
        if (typeof(elements) === 'string') {
        elements = document.querySelectorAll(elements);
        }
    
        // if we have a single DOM element, make it an array to simplify behavior
        else if (elements.tagName) { elements=[elements]; }
    
        // add class to all chosen elements
        for (var i=0; i<elements.length; i++) {
    
        // if class is not already found
        if ( (' '+elements[i].className+' ').indexOf(' '+myClass+' ') < 0 ) {
    
            // add class
            elements[i].className += ' ' + myClass;
        }
        }
    }

    function animationsIn() {
        var changingElements = [
            document.getElementById('id-header'), 
            document.getElementById('id-wikipediatitle'), 
            document.getElementById('id-supercapital1'),
            document.getElementById('id-supercapital2'),
            document.getElementById('id-viewer'),
            document.getElementById('id-wikilogo'),
            document.getElementById('id-searchrow'),
            document.getElementById('wikilist')
        ];

        var newClasses = [
            'header-small',
            'wikipediatitle-small',
            'supercapital-small',
            'supercapital-small',
            'viewer-small',
            'wikilogo-small',
            'searchrow-small',
            'wikiarticlesgrid-small'
        ]

        var oldClasses = [
            'header',
            'wikipediatitle',
            'supercapital',
            'supercapital',
            'viewer',
            'wikilogo',
            'searchrow',
            'wikiarticlesgrid'
        ]

        for (var i = 0; i < changingElements.length; i++) {
            addClass(changingElements[i], newClasses[i]);
        }

        if (isEdge === true || isIE === true) {
            document.getElementById('id-header').classList.remove('header-small');
            document.getElementById('id-wikilogo').classList.remove('wikiarticlesgrid-small');
            document.getElementById('id-header').classList.add('header-ms-browser');
            document.getElementById('id-wikilogo').classList.add('wikilogo-small-ms');
        }
    };
  
    function main() {
        var searchForm = document.getElementById("searchform");
        var wikilist = document.getElementById('wikilist');

        searchForm.addEventListener("submit", function(event){
            clearSearchResults();
            wikiApiCall(getSearchboxValue());    
            animationsIn();
            document.activeElement.blur();
            searchDone = true;
            event.preventDefault();
        });
    };
    
    main();

});