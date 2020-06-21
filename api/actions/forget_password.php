<?php
$user_id = (isset($_POST["user_id"]))  ? $_POST["user_id"] : null;
$email = (isset($_POST["email"])) ? $_POST["email"] : null;
$type = (isset($_POST["type"])) ? $_POST["type"] : null;
$new_password = (isset($_POST["password"])) ? $_POST["password"] : null;
$key = (isset($_POST["key"])) ? $_POST["key"] : null;

include_once("../../vendor/autoload.php");
include_once("../controller/Auth/ForgetPasswordAuthController.php");
include_once("../controller/Auth.php");
include_once("../helper.php");
include_once("../database.php");

if ($type === "check") {
    $forget_password = new ForgetPasswordController($conn, $email);
    echo json_encode($forget_password->checkEmail());
} else if ($type === "reset") {
    $forget_password = new ForgetPasswordController($conn, "");
    echo json_encode($forget_password->changePassword($user_id, $new_password));
} else if ($type === "delete_reset") {
    $auth = new Auth($conn, $user_id);
    $auth->deleteToken($key, $type);
}
