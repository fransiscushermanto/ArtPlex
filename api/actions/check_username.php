<?php
$user_name = isset($_POST["username"]) ? $_POST["username"] : null;
$user_id = (isset($_POST['user_id'])) ? $_POST['user_id'] : null;

include_once("../../vendor/autoload.php");
include_once("../controller/Auth.php");
include_once("../helper.php");
include_once("../database.php");

$check_email = new Auth($conn, $user_id);
echo json_encode($check_email->checkRegisteredUsername($user_name));
