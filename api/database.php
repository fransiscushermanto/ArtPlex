<?php
$host = env("DB_HOST", "localhost");
$username = env("DB_USERNAME", "root");
$password = env("DB_PASSWORD", "");
$database = env("DB_DATABASE", "");


$conn = mysqli_connect($host, $username, $password, $database) or die("Failed when try to connecting db " . mysqli_connect_error());
