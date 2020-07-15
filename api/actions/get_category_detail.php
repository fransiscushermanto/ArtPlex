<?php

$category_id = (isset($_POST['category_id'])) ? $_POST['category_id'] : null;
$page = (isset($_POST['page'])) ? json_decode(($_POST['page'])) : 0;
$keyword = (isset($_POST['name'])) ? $_POST['name'] : "";

include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Category/CategoriesController.php");

$tag = new CategoriesController($conn, "", $category_id);
echo json_encode($tag->getDetail($page, $keyword));
