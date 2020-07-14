<?php
$category_id = (isset($_POST["category_id"])) ? $_POST["category_id"] : null;
include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Category/CategoriesController.php");

$category = new CategoriesController($conn, "", $category_id);
echo json_encode($category->deleteTag());
