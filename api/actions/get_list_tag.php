<?php
$tag = (isset($_POST["tag"])) ? $_POST["tag"] : "";
$page = (isset($_POST['page'])) ? json_decode(($_POST['page'])) : 0;
$deleted_number = (isset($_POST['deleted_number'])) ? json_decode($_POST['deleted_number']) : 0;
$arr_added = (isset($_POST['arr_added_category_id'])) ? json_decode($_POST['arr_added_category_id']) : array();
include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Category/CategoriesController.php");

$category = new CategoriesController($conn, $tag, "");
echo json_encode($category->getListTag($page, $deleted_number, $arr_added));
