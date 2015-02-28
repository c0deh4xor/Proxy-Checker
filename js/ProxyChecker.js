/**
 * TODO:
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

var ProxyChecker = function(proxies, host) {
    this.proxies = proxies;
    this.host = host;
    $("#status").html("Initializing...");
}

ProxyChecker.prototype.check = function() {
    $("#results-panel").fadeIn("fast");
    $("#status").html("Checking...");
    $("#results").empty();
    var max = this.proxies.length;
    var checked = 0;
    var working = [];

    for (i = 0; i < this.proxies.length; i++) {
        var proxy = this.proxies[i];
        $.ajax({
            url: "php/ping.php",
            data: "proxy=" + proxy + "&host=" + $(this.host).val(),
            success: function(response) {
                checked += 1;
                $("#checked").html(checked);
                response = response.replace(/(<([^>]+)>)/ig,"");
                response = response.trim();

                if (response.match("^ERR") || response.match("^Fatal")) {
                    $("#results").append("<p class=\"proxy proxy-error\">" + response + "</p>");
                } else {
                    $("#results").append("<p class=\"proxy proxy-success\">" + response + "</p>");
                    working.push(response);
                }

                if (checked == max - 1) {
                    console.log(working);
                    var workingString = "";

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

function download(filename, text) {
    $("#download_working_proxies").attr('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    $("#download_working_proxies").attr('download', filename);
    $("#download_working_proxies").removeClass("hidden");
    console.log("Generated download button.");
}
