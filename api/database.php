<?php
$host = env("DB_HOST", null);
$username = env("DB_USERNAME", "none");
$password = env("DB_PASSWORD", "none");
$database = env("DB_DATABASE", "none");

$conn = mysqli_connect($host, $username, $password, $database) or die("Failed when try to connecting db " . mysqli_connect_error());
