<?php
$host = env("DB_HOST", null);
$username = env("DB_USERNAME", "none");
$password = env("DB_PASSWORD", "none");
$database = env("DB_DATABASE", "none");

$conn = mysqli_connect($host, $username, $password, $database) or die("Failed when try to connecting db " . mysqli_connect_error());

$s3 = new Aws\S3\S3Client([
    'version' => 'latest',
    'region'   => 'ap-southeast-1',
    'credentials' => array(
        'key' => env("AWS_ACCESS_KEY_ID", "none"),
        'secret'  => env("AWS_SECRET_ACCESS_KEY", "none"),
    )
]);

$bucket = env('S3_BUCKET_NAME', "none") ?: die('No "S3_BUCKET_NAME" config var in found in env!');
