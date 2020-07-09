<?php
$page = (isset($_POST['page'])) ? $_POST['page'] : null;
$category_id = (isset($_POST['category_id'])) ? $_POST['category_id'] : "";
$story_title = (isset($_POST['title'])) ? $_POST['title'] : "";
$type = (isset($_POST['type'])) ? $_POST['type'] : null;
include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Story/StoriesController.php");
$get_list_page = new StoriesController($conn, "", "", "", "", "", "", "");
if ($type === "all") echo json_encode($get_list_page->getListAllStories($page, $category_id, $story_title));
else if ($type === "publish") echo json_encode($get_list_page->getListPublishedStories($page, $category_id, $story_title, $type));
else if ($type === "unpublish") echo json_encode($get_list_page->getListUnpublishedStories($page, $story_title));
