<?php
session_start();

$user_id = isset($_SESSION["user_id"]) ? $_SESSION["user_id"] : null;

require_once("./vendor/autoload.php");
require_once("./api/helper.php");
require_once("./api/database.php");
require_once("./api/controller/Auth.php");
require_once("./api/controller/route.php");

use Api\Actions\Route;

$route = new Route();
$auth = new Auth($conn, $user_id);
$auth->checkCookie();
$stories =  [
    (object) array(
        "title" => "This is injected",
        "description" => "This description too is injected",
        "created_at" => "2020-6-18",
        "story_type" => "Bug",
    ),
    (object) array(
        "title" => "This is injected",
        "description" => "This description too is injected",
        "created_at" => "2020-6-17",
        "story_type" => "Bug",
    ),
];
?>
<!doctype html>
<html lang="en">

<head>
    <title><?php echo env("APP_NAME", "React App"); ?></title>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800,900" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,615;0,700;0,800;1,400;1,500;1,600;1,615;1,700;1,800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">
    <link rel="stylesheet" href="/app/assets/css/animate.css" />
    <link rel="stylesheet" href="/app/assets/css/aos.css" />
    <link rel="stylesheet" href="/app/assets/css/ionicons.min.css" />
    <link rel="stylesheet" href="/app/assets/css/app.css" />

</head>
<script type="text/javascript">
    var STATIC_URL = `${window.location.origin}/`;
    var myApp = {
        user: <?php echo $auth->hasUser() ? json_encode($auth->user()) : "null"; ?>,
        articles: <?php echo json_encode($stories); ?>
    };
</script>

<body>
    <div id="root">
        <?php $route->has("admin") ? null : include_once("./api/view/layout/nav.php") ?>
        <main class="py-0">
            <?php
            include_once("./api/view/content.php")
            ?>
        </main>
        <?php $auth->hasUser() || $route->has("login") || $route->has("register") || $route->has("forget") || $route->has("admin") || !$route->notFoundHandler($route->getCurrentPathName()) ? null : include_once("./api/view/layout/footer.php") ?>
        <!-- loader -->
        <div id="ftco-loader" class="show fullscreen"><svg class="circular" width="48px" height="48px">
                <circle class="path-bg" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke="#eeeeee" />
                <circle class="path" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke-miterlimit="10" stroke="#F96D00" /></svg></div>
    </div>

    <script src="/app/resources/js/jquery.min.js"></script>
    <script src="/app/resources/js/jquery-migrate-3.0.1.min.js"></script>
    <script src="/app/resources/js/popper.min.js"></script>
    <script src="/app/resources/js/bootstrap.min.js"></script>
    <script src="/app/resources/js/jquery.easing.1.3.js"></script>
    <script src="/app/resources/js/jquery.waypoints.min.js"></script>
    <script src="/app/resources/js/jquery.stellar.min.js"></script>
    <script src="/app/resources/js/aos.js"></script>
    <script src="/app/resources/js/jquery.animateNumber.min.js"></script>
    <script src="/app/resources/js/scrollax.min.js"></script>
    <script src="/app/resources/js/main.js"></script>
    <script type="text/javascript" src="/app/assets/bundle/main.bundle.js"></script>
    <script type="text/javascript" src="/app/assets/bundle/landing.bundle.js"></script>
</body>

</html>