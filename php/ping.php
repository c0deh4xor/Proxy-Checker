<?php
    /**
     * @author Lynxaa
     * @since 28/02/2015
     */

     /**
      * Turn of error reporting.
      * This should be default on any web server for safety reasons, so we'll turn it off in here to try get a similar response.
      */
     error_reporting(0);

    /**
     * Since single CURL requests aren't ASYNC we need to change the php-file execution time to improve speed.
     * We can safely assume any proxy taking longer than 5 seconds to load sites like google/wtfismyip/youtube/etc aren't good proxies or they don't work.
     */
    set_time_limit(5);


    $proxy = isset($_GET['proxy']) ? empty($_GET['proxy']) ? false : $_GET['proxy'] : false;
    $host = isset($_GET['host']) ? empty($_GET['host']) ? false : $_GET['host'] : false;

    /**
     * No proxy passed.
     */
    if ($proxy === false) {
        die("ERR:NO_PROXY;");
    }

    /**
     * No host passed; defaults to wtfismyip. (Tested to be the most stable site to test proxies against with these CURL settings.)
     */
    if ($host === false) {
        $host = "http://wtfismyip.com/";
    }

    $exploded = explode(":", $proxy);

    /**
     * At the moment the script only supports proxy formates of IP:PORT.
     * Later i'll add options to support IP:PORT:USER:PASS etc.
     */
    if (count($exploded) == 2) {
        $ip = $exploded[0];
        $port = $exploded[1];

        // [------] Start CURL Proxy Check
        $ch = curl_init($host);
        curl_setopt($ch, CURLOPT_URL, $host);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_PROXY, $proxy);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; LynxaaProxyChecker/1.0; +http://lynxaa.me/)');
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_VERBOSE, false);

        $exec = curl_exec($ch);
        if ($exec === false) {
            echo 'ERR:CURL_"' . curl_error($ch) . '";';
        } else {
            echo $proxy;
        }

        curl_close($ch);
        // [------] End CURL Proxy Check
    } else {
        /**
         * Unsupported proxy format.
         */
        die("ERR:UNSUPPORTED_PROXY_FORMAT;");
    }
?>
