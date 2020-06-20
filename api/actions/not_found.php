<?php
$not_found = isset($_POST["not_found"]) ? $_POST["not_found"] : null;
$route->setNotFound($not_found);
