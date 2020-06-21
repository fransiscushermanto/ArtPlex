<?php

if (isset($_POST["password"]) && isset($_POST["email"]) && isset($_POST["remember_me"])) {
    $email = isset($_POST["email"]) ? $_POST["email"] : null;
    $pass = isset($_POST["password"]) ? $_POST["password"] : null;
    $remember_me = isset($_POST["remember_me"]) ? $_POST["remember_me"] : null;

    include_once("../../vendor/autoload.php");
    include_once("../controller/Auth/LoginAuthController.php");
    include_once("../helper.php");
    include_once("../database.php");

    $login = new LoginController($conn, $email, $pass, $remember_me);

    echo json_encode($login->authenticateUser());
}
