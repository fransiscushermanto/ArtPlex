<?php

require("./vendor/autoload.php");

define("BASE_URL", isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] . "/" : "http://localhost:8000/");

use Dotenv\Dotenv;

if (getenv('APP_ENV') === 'development') {
    $dotenv = Dotenv::createImmutable(__DIR__ . "/../");
    $dotenv->load();
}
$dotenv->required('OTHER_VAR');


function env($env, $default)
{
    $var = isset($_ENV[$env]) ? $_ENV[$env] : $default;
    return $var;
}

function keygen($header, $payload, $verify_signature)
{
    $header = (object) array(
        "alg" => "salt",
        "typ" => "BCRYPT"
    );
    $header = password_hash($header, PASSWORD_BCRYPT);
    $payload = password_hash($payload, PASSWORD_BCRYPT);
    $verify_signature = password_hash($verify_signature, PASSWORD_BCRYPT);

    return $header . "." . $payload . "." . $verify_signature;
}
