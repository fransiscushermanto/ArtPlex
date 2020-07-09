<?php

$user_id = (isset($_POST['user_id'])) ? $_POST['user_id'] : null;
$title = (isset($_POST['title'])) ? $_POST['title'] : null;
$title_html = (isset($_POST['title_html'])) ? $_POST['title_html'] : null;
$body = (isset($_POST['body'])) ? $_POST['body'] : null;
$body_html = (isset($_POST['body_html'])) ? $_POST['body_html'] : null;
$total_word = (isset($_POST['total_word'])) ? $_POST['total_word'] : null;
$story_id = (isset($_POST['story_id'])) ? $_POST['story_id'] : "";
$status = (isset($_POST['status'])) ? $_POST['status'] : null;
$image_preview = (isset($_POST['image_preview'])) ? $_POST['image_preview'] : null;
$category_id = (isset($_POST['category_id'])) ? $_POST['category_id'] : "";

include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Story/StoriesController.php");


$story = new StoriesController($conn, $user_id, $title, $title_html, $body, $body_html, $total_word, $story_id);
if ($status === "on") {
    $story->continueStory();
    echo json_encode($story->publishStory($image_preview, $category_id, $status));
} else if ($status === "off") {
    echo json_encode($story->continueStory());
}
