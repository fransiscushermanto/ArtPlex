<?php
// if (!$route->has("login") && !$route->has("register")) {
//     $auth->hasUser() ? null : include_once("welcome.php");
// }
?>
<?php
echo $auth->hasUser() || $route->has("login") || $route->has("register") || $route->has("forget") || !$route->notFoundHandler($route->getCurrentPathName()) ?
    '<div id="app" class="height-100"></div>' :
    '<div id="landing" class="height-100">';
($auth->hasUser() || $route->has("login") || $route->has("register") || $route->has("forget") || !$route->notFoundHandler($route->getCurrentPathName()) ? null : include_once("welcome.php"));
echo  $auth->hasUser() || $route->has("login") || $route->has("register") || $route->has("forget") || !$route->notFoundHandler($route->getCurrentPathName()) ? null : '<div id="card-wrapper"></div>
    </div>';

?>