<?php

$name = isset($_POST["name"]) ? $_POST["name"] : null;
$email = isset($_POST["email"]) ? $_POST["email"] : null;
$user_name = isset($_POST["username"]) ? $_POST["username"] : null;
$pass = isset($_POST["password"]) ? $_POST["password"] : null;

include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Auth/RegisterAuthController.php");

$register = new RegisterController($conn, $email, $name, $pass, $user_name);
echo json_encode($register->createUser());
