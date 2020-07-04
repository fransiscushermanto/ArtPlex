<?php
$page = (isset($_POST['page'])) ? $_POST['page'] : null;

include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Story/StoriesController.php");

$get_list_page = new StoriesController($conn, "", "", "", "", "", "", "");
echo json_encode($get_list_page->getListStory($page));
