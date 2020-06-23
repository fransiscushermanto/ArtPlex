<?php

define("BASE_URL", isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] . "/" : "http://localhost:8000/");

use Dotenv\Dotenv;



$host = explode(":", $_SERVER['HTTP_HOST'])[0];
if ($host !== "localhost") {
    putenv("APP_ENV=production");
} else {
    putenv("APP_ENV=development");
}

if (getenv('APP_ENV') === 'development') {
    $dotenv = Dotenv::createImmutable(__DIR__ . "/../");
    $dotenv->load();
}

function env($env, $default)
{
    $var = isset($_ENV[$env]) ? $_ENV[$env] : $default;
    return $var;
}

function keygen($payload)
{
    $header = (object) array(
        "alg" => "salt",
        "typ" => "BCRYPT"
    );
    $verify_signature = "ArtplexTheBest1";
    $header = password_hash(json_encode($header), PASSWORD_BCRYPT);
    $payload = password_hash($payload, PASSWORD_BCRYPT);
    $verify_signature = password_hash($verify_signature, PASSWORD_BCRYPT);

    return $header . "." . $payload . "." . $verify_signature;
}


function redirectTohttps()
{
    if (getenv("APP_ENV") === "production") {
        if (empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] === 'off') {
            $redirect = "https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
            header("Location:$redirect");
        }
    }
}
