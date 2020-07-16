<?php
$page = (isset($_POST['page'])) ? json_decode($_POST['page']) : 0;
$story_id = (isset($_POST['story_id'])) ? $_POST['story_id'] : null;
$access_time = (isset($_POST['access_time'])) ? $_POST['access_time'] : "";
$keyword  = (isset($_POST['comment'])) ? $_POST['comment'] : "";
$deleted_number = (isset($_POST['deleted_number'])) ? json_decode($_POST['deleted_number']) : 0;
$user_id = (isset($_POST['user_id'])) ? $_POST['user_id'] : null;
include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Story/StoriesController.php");

$get_more_comment = new StoriesController($conn, $user_id, "", "", "", "", "", $story_id);
echo json_encode($get_more_comment->getMoreComment($page, $keyword, $access_time, $deleted_number));
