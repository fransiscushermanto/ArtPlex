<?php
$image = (isset($_POST['image'])) ? $_POST['image'] : null;
$title = (isset($_POST['title'])) ? $_POST['title'] : null;
$description = (isset($_POST['description'])) ? $_POST['description'] : null;

include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
include_once("../controller/Card/CardsController.php");

$create_card = new CardsController($conn, $image, $title, $description, "",  "");
