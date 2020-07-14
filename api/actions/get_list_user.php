<?php
$page = (isset($_POST['page'])) ? json_decode($_POST['page']) : 0;
$name = (isset($_POST['name'])) ? $_POST['name'] : "";
$access_time = (isset($_POST['access_time'])) ? $_POST['access_time'] : "";
$deleted_number = (isset($_POST['deleted_number'])) ? json_decode($_POST['deleted_number']) : 0;

include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/User/UsersController.php");

$user = new UsersController($conn,  "", "",  "",  "",  "", "", "",  "", "",  "",  "",  "");
echo json_encode($user->getListUser($page, $name, $access_time, $deleted_number));
