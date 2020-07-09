<?php
$comment_id = (isset($_POST['comment_id'])) ? $_POST['comment_id'] : null;


include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Comment/CommentsController.php");

$comment = new CommentsController($conn, "", "", $comment_id);
echo json_encode($commnet->deleteComment());
