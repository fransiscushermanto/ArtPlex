<?php
include_once("../helper.php");
session_start();
unset($_SESSION['user_id']);
header("location:" . BASE_URL . "index.php");
