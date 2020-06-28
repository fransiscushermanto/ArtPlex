<?php
$user_id = (isset($_POST['user_id'])) ? $_POST['user_id'] : null;
$title = (isset($_POST['title'])) ? $_POST['title'] : null;
$title_html = (isset($_POST['title_html'])) ? $_POST['title_html'] : null;
$body = (isset($_POST['body'])) ? $_POST['body'] : null;
$body_html = (isset($_POST['body_html'])) ? $_POST['body_html'] : null;
$total_word = (isset($_POST['total_word'])) ? $_POST['total_word'] : null;
$story_id = (isset($_POST['story_id'])) ? $_POST['story_id'] : "";

include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Story/StoriesController.php");

// echo json_encode((object) array(
//     "user_id" => $user_id,
//     "title" => $title,
//     "body" => $body,
//     "total_word" => $total_word,
// ));
$story = new StoriesController($conn, $user_id, $title, $title_html, $body, $body_html, $total_word, $story_id);
echo json_encode($story->writeStory());
