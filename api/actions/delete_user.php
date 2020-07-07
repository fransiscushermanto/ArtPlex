<?php

$user_id = (isset($_POST['user_id'])) ? $_POST['user_id'] : null;

include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/User/UsersController.php");

$user = new UsersController($conn, $user_id, "",  "",  "",  "", "", "",  "", "",  "",  "",  "");
echo json_encode($user->deleteUser());
