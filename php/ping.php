<?php
    set_time_limit(5);
    $proxy = isset($_GET['proxy']) ? empty($_GET['proxy']) ? false : $_GET['proxy'] : false;
    $host = isset($_GET['host']) ? empty($_GET['host']) ? false : $_GET['host'] : false;

    if ($proxy === false) { //No proxy passed.
        die("ERR:NO_PROXY;");
    }

    if ($host === false) {
        $host = "http://wtfismyip.com/";
    }

    $exploded = explode(":", $proxy);

    if (count($exploded) == 2) { //Proxy format is correct. IP:PORT
        $ip = $exploded[0];
        $port = $exploded[1];

        // [------] Start CURL Proxy Check
        $ch = curl_init($host);
        curl_setopt($ch, CURLOPT_URL, $host);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_PROXY, $proxy);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; SteamPriceChecker/1.0; +https://voided.eu/)');
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
    } else { //Proxy format is incorrect.
        die("ERR:NO_PORT;");
    }
?>
