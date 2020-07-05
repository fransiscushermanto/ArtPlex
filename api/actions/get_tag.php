<?php
$tag = (isset($_POST["tag"])) ? $_POST["tag"] : "";
include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Category/CategoriesController.php");

$category = new CategoriesController($conn, $tag, "");
echo json_encode($category->getTag());
