<?php
$user_id = (isset($_POST['user_id'])) ? $_POST['user_id'] : null;
$story_id = (isset($_POST['story_id'])) ? $_POST['story_id'] : null;
$type = (isset($_POST['type'])) ? $_POST['type'] : null;
// $type = (isset($_POST['type'])) ? $_POST['type'] : null;
include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Story/StoriesController.php");

$get_story = new StoriesController($conn, $user_id, "", "", "", "", "", $story_id);
echo json_encode($get_story->getUserStory($type));