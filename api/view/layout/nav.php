<nav class="navbar px-md-0 navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light 
    <?php echo $auth->hasUser() || $route->getCurrentPathName()[0] === '@' ? 'bg-white' : 'transparent' ?> <?php echo $route->has("reset") || $route->has("verify") || $route->has("login") || $route->has("register") || $route->has("forget") ? "hidden" : "" ?> " id="ftco-navbar">
    <div class="container">
        <a href="/" class="navbar-brand font-weight-bolder">
            <?php echo env("APP_NAME", "React App"); ?>
        </a>
        <!-- <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="{{ __('Toggle navigation') }}">
            <span class="navbar-toggler-icon"></span>
        </button> -->

        <div class="collapse navbar-collapse nav-wrapper" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <?php
                if ($auth->hasUser()) {
                    echo '
                            <li class="nav-item">
                                <a href="/story" class="nav-link">
                                    Stories
                                </a>
                            </li>
                        ';
                }
                ?>

            </ul>

            <ul class="navbar-nav ml-auto">
                <?php
                $var = null;
                echo isset($var);
                if (empty($auth->user())) {
                    if (!$route->has("login") && !$route->has("register")) {
                        echo '
                                <li class="nav-item">
                                    <a href="/login" class="nav-link">
                                        Login
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a href="/register" class="nav-link">
                                        Register
                                    </a>
                                </li>
                            ';
                    } else if (!$route->has("login")) {
                        echo '
                                <li class="nav-item d-flex align-items-center">
                                    <span>Have an account ?</span> 
                                    <a href="/login" class="nav-link" style="padding-left:5px; padding-right:5px; font-size: 1rem;">
                                        Login
                                    </a>
                                </li>
                            ';
                    } else if (!$route->has("register")) {
                        echo '
                                <li class="nav-item d-flex align-items-center">
                                     <span>Don\'t have an account ?</span> 
                                    <a href="/register" class="nav-link" style="padding-left:5px; padding-right:5px; font-size: 1rem;">
                                        Register
                                    </a>
                                </li>
                            ';
                    }
                } else {
                    echo '
                            <li class="nav-item dropdown">
                                <a href="" id="navbarDropdown" class="nav-link dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    ' . $auth->user()->name . ' <span class="caret"></span> 
                                </a>

                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                    <div class="wrapper-dropdown-menu">
                                        <div class="popover-item">
                                            <form id="logout-form" action="/api/actions/logout.php" method="POST">
                                                <button type="submit" class="dropdown-item">Logout</button>
                                            </form>
                                        </div>
                                        <div class="popover-arrow"></div>
                                    </div>
                                </div>
                            </li>
                        ';
                }
                ?>

            </ul>
        </div>
    </div>
</nav>