<?php

$story_id = (isset($_POST['story_id'])) ? $_POST['story_id'] : null;
$author_id = (isset($_POST['author_id'])) ? $_POST['author_id'] : null;

include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Story/StoriesController.php");

$check_story_published = new StoriesController($conn, $author_id, "", "", "", "", "", $story_id);
echo json_encode($check_story_published->verifyStoryId("public"));
