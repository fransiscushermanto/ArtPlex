<?php

include_once("../../vendor/autoload.php");
include_once("../helper.php");
include_once("../database.php");
session_start();
unset($_SESSION['user_id']);
header("location:" . BASE_URL . "index.php");
