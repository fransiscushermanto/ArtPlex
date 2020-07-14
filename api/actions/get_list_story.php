<?php
$page = (isset($_POST['page'])) ? json_decode($_POST['page']) : 0;
$category_id = (isset($_POST['category_id'])) ? $_POST['category_id'] : "";
$story_title = (isset($_POST['title'])) ? $_POST['title'] : "";
$access_time = (isset($_POST['access_time'])) ? $_POST['access_time'] : "";
$deleted_number = (isset($_POST['deleted_number'])) ? json_decode($_POST['deleted_number']) : 0;
include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Story/StoriesController.php");
$get_list_page = new StoriesController($conn, "", "", "", "", "", "", "");
echo json_encode($get_list_page->getListPublishedStories($page, $category_id, $story_title, "", $access_time, $deleted_number));
