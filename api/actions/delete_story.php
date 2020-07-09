<?php
$story_id = (isset($_POST['story_id'])) ? $_POST['story_id'] : null;

include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Story/StoriesController.php");

$delete_story = new StoriesController($conn, "", "", "", "", "", "", $story_id);
echo json_encode($delete_story->deleteStory());
