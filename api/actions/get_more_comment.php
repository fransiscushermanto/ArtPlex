<?php
$page = (isset($_POST['page'])) ? $_POST['page'] : null;
$story_id = (isset($_POST['story_id'])) ? $_POST['story_id'] : null;

include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Story/StoriesController.php");

$get_more_comment = new StoriesController($conn, "", "", "", "", "", "", $story_id);
echo json_encode($get_more_comment->getMoreComment($page));
