/**
 * Proxy Checker Class.
 *
 * @author Lynxaa (github.com/Lynxaa)
 * @since 28/2/2015
 */
var ProxyChecker = function(proxies, host) {
    this.proxies = proxies;
    this.host = host;
    $("#status").html("Initializing...");
}

/**
 * Loop over our array of proxies grabbed and passed from @see index.html#45
 */
ProxyChecker.prototype.check = function() {
    /**
     * Load hidden divs and reset them if they have content.
     */
    $("#results-panel").fadeIn("fast");
    $("#status").html("Checking...");
    $("#results").empty();

    //Amount of proxies in our array.
    var max = this.proxies.length;
    //Amount of proxies checked.
    var checked = 0;
    //Amount of working proxies.
    var working = [];

    for (i = 0; i < this.proxies.length; i++) {
        var proxy = this.proxies[i];

        /**
         * Perform an AJAX request to our ping script.
         */
        $.ajax({
            url: "php/ping.php",
            data: "proxy=" + proxy + "&host=" + $(this.host).val(),
            success: function(response) {
                checked += 1;
                $("#checked").html(checked);

                //Strip and clean response.
                response = response.replace(/(<([^>]+)>)/ig,"");
                response = response.trim();

                if (response.match("^ERR") || response.match("^Fatal")) { //Match all possible errors.
                    $("#results").append("<p class=\"proxy proxy-error\">" + response + "</p>");
                } else if (response.length < 5) { //Empty responses, mostly caused by execution time being exceeded.

                } else { //All successful proxies.
                    $("#results").append("<p class=\"proxy proxy-success\">" + response + "</p>");
                    working.push(response); //Push the working proxy to our working proxies array.
                }

                if (checked == max - 1) { //Once all our proxies are checked.
                    var workingString = "";

                    //Loop over our working proxies array and append it to a single string for the file download.
                    for (i1 = 0; i1 < working.length; i1++) {
                        workingString += working[i1] + "\n";
                    }

                    download("proxies_checked_by_[site_name]-" + new Date().toJSON().substring(0,10) + ".txt", workingString);
                    $("#download_working_proxies").fadeIn("fast");
                    $("#status").html("Finished - " + working.length + " working proxies.");
                }
            }
        });
    }
}

/**
 * Creates a client-side file with the passed text.
 * @see http://stackoverflow.com/a/18197341
 */
function download(filename, text) {
    $("#download_working_proxies").attr('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    $("#download_working_proxies").attr('download', filename);
    $("#download_working_proxies").removeClass("hidden");
    console.log("Generated download button.");
}
