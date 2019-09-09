<?php
// 1. get the content Id (here: an Integer) and sanitize it properly
$referenceCode = filter_input(INPUT_GET, 'referenceCode', FILTER_SANITIZE_STRING);

// 2. get the content from a flat file (or API, or Database, or ...)
$data = json_decode(file_get_contents('https://api2.madebyblume.com/v3/prerender/product?referenceCode='.$referenceCode));

// 3. return the page
return makePage($data); 

function makePage($data) {
    // 1. get the page
    
    // 2. generate the HTML with open graph tags
    $html  = '<!doctype html>'.PHP_EOL;
    $html .= '<html>'.PHP_EOL;
    $html .= '<head>'.PHP_EOL;

    //SEO
    $html .= '<title>' .$data->title.' </title>'.PHP_EOL;
    $html .= '<meta name="description" content="'.$data->description.'"/>'.PHP_EOL;
    $html .= '<meta name="keywords" content="'.$data->keywords.'"/>'.PHP_EOL;
    $html .= '<meta name="author" content="Blume"/>'.PHP_EOL;

    //Google+
    $html .= '<meta itemprop="name" content="'.$data->googleName.'"/>'.PHP_EOL;
    $html .= '<meta itemprop="description" content="'.$data->googleDescription.'"/>'.PHP_EOL;
    $html .= '<meta itemprop"image" content="'.$data->googleImage.'"/>'.PHP_EOL;

    //Twitter Cards
    $html .= '<meta name="twitter:card" content="summary"/>'.PHP_EOL;
    $html .= '<meta name="twitter:site" content="'.$data->twitterSite.'"/>'.PHP_EOL;
    $html .= '<meta name="twitter:title" content="'.$data->twitterTitle.'"/>'.PHP_EOL;
    $html .= '<meta name="twitter:description" content="'.$data->twitterDescription.'"/>'.PHP_EOL;
    $html .= '<meta name="twitter:img:src" content="'.$data->twitterImage.'"/>'.PHP_EOL;

    //OpenGraph(Facebook)
    $html .= '<meta property="og:site_name" content="'.$data->ogSiteName.'"/>'.PHP_EOL;
    $html .= '<meta property="og:type" content="website"/>'.PHP_EOL;
    $html .= '<meta property="og:title" content="'.$data->ogTitle.'"/>'.PHP_EOL;
    $html .= '<meta property="og:url" content="'.$data->ogPageUrl.'"/>'.PHP_EOL;
    $html .= '<meta property="og:description" content="'.$data->ogDescription.'"/>'.PHP_EOL;
    $html .= '<meta property="og:image" content="'.$data->ogImage.'"/>'.PHP_EOL;
    
    $html .= '</head>'.PHP_EOL;
    $html .= '<body></body>'.PHP_EOL;
    $html .= '</html>';
    // 3. return the page
    echo $html;
}

?>