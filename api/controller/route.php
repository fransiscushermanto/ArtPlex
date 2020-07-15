<?php

namespace Api\Actions;

class Route
{
    protected $request, $status;

    public function __construct()
    {
        $this->request = strtolower(explode("/", $_SERVER['REQUEST_URI'])[1]);
    }

    public function getCurrentPathName()
    {
        return $this->request;
    }

    protected function listPath($path)
    {
        switch ($path) {
            case '':
                return true;
                break;
            case 'index.php':
                return true;
                break;
            case 'login':
                return true;
                break;
            case 'register':
                return true;
                break;
            case 'forget':
                return true;
                break;
            case 'stories':
                return true;
                break;
            case 'story':
                return true;
                break;
            case 'checkEmail':
                return true;
                break;
            case '@':
                return true;
                break;
            default:
                return false;
                break;
        }
    }

    public function notFoundHandler($path)
    {
        return $this->listPath($path);
    }

    function has($path)
    {
        return explode("?", $this->getCurrentPathName())[0] === $path ? true : false;
    }
}
