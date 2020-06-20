<?php
$user_id = (isset($_POST["user_id"]))  ? $_POST["user_id"] : null;
$key = (isset($_POST["key"])) ? $_POST["key"] : null;
$type = (isset($_POST["type"])) ? $_POST["type"] : null;

include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Auth.php");

if ($type === "verify") {
    $auth = new Auth($conn, $user_id);
    echo json_encode($auth->verifyToken($key));
} else if ($type === "forget") {
    $auth = new Auth($conn, $user_id);
    echo json_encode($auth->verifyToken($key));
}
