<?php

include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
session_start();
unset($_SESSION['user_id']);
if (isset($_COOKIE['remember_me'])) {
    $remember_token = $_COOKIE['remember_me'];
    mysqli_query($conn, "UPDATE `users` SET `remember_token` = '' WHERE `remember_token` = '$remember_token';");
    setcookie("remember_me", "", time() - 30);
}
header("location:" . BASE_URL . "index.php");
