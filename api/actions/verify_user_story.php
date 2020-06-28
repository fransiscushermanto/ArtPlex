<?php

$user_id = (isset($_POST['user_id'])) ? $_POST['user_id'] : null;
$story_id = (isset($_POST['story_id'])) ? $_POST['story_id'] : null;

include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Story/StoriesController.php");
//($conn, $user_id = "", $title = "", $title_html = "", $body = "", $body_html = "", $total_word = 0, $story_id = "")
$verify_story = new StoriesController($conn, $user_id, "", "", "", "", "", $story_id);
echo json_encode($verify_story->verifyStoryId());
