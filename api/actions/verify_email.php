<?php
$user_id = (isset($_POST["user_id"])) ?  $_POST["user_id"] : null;
$key = (isset($_POST["key"])) ? $_POST["key"] : null;
$type = (isset($_POST["type"])) ? $_POST["type"] : null;

include_once("../../vendor/autoload.php");
include_once("../controller/Auth/RegisterAuthController.php");
include_once("../controller/Auth.php");
include_once("../helper.php");
include_once("../database.php");

if ($type === "verify") {
    $verify_email = new RegisterController($conn, "", "", "");
    echo json_encode($verify_email->verifyEmail($user_id, $key));
    $auth = new Auth($conn, $user_id);
    $auth->deleteToken($key, $type);
}
