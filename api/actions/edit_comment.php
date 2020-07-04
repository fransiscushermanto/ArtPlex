<?php
$body = (isset($_POST['body'])) ? $_POST['body'] : null;
$user_id = (isset($_POST['user_id'])) ? $_POST['user_id'] : null;
$comment_id = (isset($_POST['comment_id'])) ? $_POST['comment_id'] : null;

include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Comment/CommentsController.php");

$edit_comment = new CommentsController($conn, $body, "", $comment_id);
echo json_encode($edit_commnt->edit_comment());
