<?php
$story_id = (isset($_POST['story_id'])) ? $_POST['story_id'] : null;
$body = (isset($_POST['body'])) ? $_POST['body'] : null;
$user_id = (isset($_POST['user_id'])) ? $_POST['user_id'] : null;

include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Comment/CommentsController.php");

$create_comment = new CommentsController($conn, $body, $user_id, "");
echo json_encode($create_comment->createComment($story_id));
