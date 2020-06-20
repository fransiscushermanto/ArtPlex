<?php
$user_id = (isset($_POST["user_id"])) ?  $_POST["user_id"] : null;
$key = (isset($_POST["key"])) ? $_POST["key"] : null;

include_once("../controller/Auth/RegisterAuthController.php");
include_once("../helper.php");
include_once("../database.php");

$verify_email = new RegisterController($conn, "", "", "");
echo json_encode($verify_email->verifyEmail($user_id, $key));

$auth = new Auth($conn ,$user_id);
echo json_encode($auth->deleteToken($key));
