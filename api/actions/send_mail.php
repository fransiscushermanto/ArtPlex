<?php
$email = (isset($_POST["email"])) ? $_POST["email"] : false;
$type = (isset($_POST["type"])) ? $_POST["type"] : false;

include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Auth/ForgetPasswordAuthController.php");
include_once("../controller/Auth/RegisterAuthController.php");

if ($type === "forget") {
    $forget_password = new ForgetPasswordController($conn, $email);
    echo json_encode((object) array("success" => true));
    // echo json_encode($forget_password->composeMail());
} else if ($type === "verify") {
    $email_verification = new RegisterController($conn, $email, "", "");
    // echo json_encode((object) array("success" => true, "type" => $type));
    echo json_encode($email_verification->composeMail());
}
