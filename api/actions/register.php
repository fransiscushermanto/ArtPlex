<?php

$name = isset($_POST["name"]) ? $_POST["name"] : null;
$email = isset($_POST["email"]) ? $_POST["email"] : null;
$pass = isset($_POST["password"]) ? $_POST["password"] : null;

include_once("../controller/Auth/RegisterAuthController.php");
include_once("../helper.php");
include_once("../database.php");

$register = new RegisterController($conn, $email, $name, $pass);
echo json_encode($register->createUser());
