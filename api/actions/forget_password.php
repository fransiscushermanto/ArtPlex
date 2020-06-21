<?php
$email = (isset($_POST["email"])) ? $_POST["email"] : null;

include_once("../../vendor/autoload.php");
include_once("../controller/Auth/ForgetPasswordAuthController.php");
include_once("../helper.php");
include_once("../database.php");


$forget_password = new ForgetPasswordController($conn, $email);

//echo json_encode($forget_password->checkEmail());
