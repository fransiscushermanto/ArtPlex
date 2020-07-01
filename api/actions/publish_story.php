<?php
$categories = (isset($_POST['categories'])) ? $_POST['categories'] : null;
$user_id = (isset($_POST['user_id'])) ? $_POST['user_id'] : null;
$title = (isset($_POST['title'])) ? $_POST['title'] : null;
$body = (isset($_POST['body'])) ? $_POST['body'] : null;
$story_id = (isset($_POST['story_id'])) ? $_POST['story_id'] : "";
$image_preview = (isset($_POST['image_preview'])) ? $_POST['image_preview'] : null;

include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Story/StoriesController.php");
// echo json_encode((object) array(
//     "category" => json_decode($categories),
//     "user_id" => $user_id,
//     "title" => $title,
//     "body" => $body,
//     "story_id" => $story_id,
//     "image_preview" => $image_preview,
// ));
$publish = new StoriesController($conn, $user_id, $title, "", $body, "", "", $story_id);
echo json_encode($publish->publishStory($image_preview, json_decode($categories)));
