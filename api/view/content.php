<?php
// if (!$route->has("login") && !$route->has("register")) {
//     $auth->hasUser() ? null : include_once("welcome.php");
// }
?>
<?php
echo $auth->hasUser() || $route->has("login") || $route->has("register") || $route->has("forget") || !$route->notFoundHandler($route->getCurrentPathName()) ?
    '<div id="app" class="height-100"></div>' :
    '<div id="landing" class="height-100">' .
    (include_once("welcome.php"))
    . '<div id="article-wrapper"></div>
    </div>'

?>