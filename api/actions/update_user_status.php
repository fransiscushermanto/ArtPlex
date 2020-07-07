<?php

$user_id = (isset($_POST['user_id'])) ? $_POST['user_id'] : null;
$status = (isset($_POST['status'])) ? json_decode($_POST['status']) : null;
include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/User/UsersController.php");

$user = new UsersController($conn, $user_id, "", "", "", "", $status, "", "", "", "", "", "");
echo json_encode($user->updateUserStatus());
