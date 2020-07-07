<?php
$page = (isset($_POST['page'])) ? $_POST['page'] : null;
$name = (isset($_POST['name'])) ? $_POST['name'] : "";

include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/User/UsersController.php");

$user = new UsersController($conn,  "", "",  "",  "",  "", "", "",  "", "",  "",  "",  "");
echo json_encode($user->getListUser($page, $name));
