<?php

class Auth
{
    protected $conn, $user_id;

    public function __construct($conn, $user_id = "")
    {
        $this->conn = $conn;
        $this->user_id = (int) $user_id;
    }

    function user()
    {
        date_default_timezone_set('Asia/Bangkok');
        if (!empty($this->user_id)) {
            $q = mysqli_query($this->conn, "SELECT user_id as id, username, name, email, email_verified_at, remember_token, last_activity, created_at, updated_at, level FROM users WHERE user_id = '$this->user_id'");
            $row = mysqli_fetch_array($q);
            return $row > 0 ? (object) array(
                "id" => $row['id'],
                "name" => $row['name'],
                "username" => $row['username'],
                "email" => $row['email'],
                "email_verified_at" => $row['email_verified_at'],
                "remember_token" => $row['remember_token'],
                "last_activity" => $row['last_activity'],
                "created_at" => $row['created_at'],
                "updated_at" => $row['updated_at'],
                "level" => $row['level'],
            ) : $row;
        } else {
            return null;
        }
    }

    function hasUser()
    {
        return !empty($this->user());
    }

    function verifyToken($key, $type)
    {
        date_default_timezone_set('Asia/Bangkok');
        $query_check_token = null;
        //check if token exist or not
        if ($type === "verify") {
            $query_check_token = $this->conn->prepare("SELECT * FROM `verify_tokens_temp` WHERE v_key = ? and  user_id = '$this->user_id';");
        } else if ($type === "forget") {
            $query_check_token = $this->conn->prepare("SELECT * FROM `reset_tokens_temp` WHERE v_key = ? and  user_id = '$this->user_id';");
        }
        $query_check_token->bind_param("s", $key);
        $query_check_token->execute();
        $res = $query_check_token->get_result();
        $row = $res->fetch_assoc();
        if ($row <= 0) { //if token doesn't exist
            return (object) array(
                "success" => false,
                "error" => "Token doesn't exist"
            );
            //redirect to "token doesn't exist" page
        } else { //if token exists
            $expiry_date = $row['exp_date'];
            $current_date = date("Y-m-d H:i:s");
            if ($current_date > $expiry_date) { //compare if token expire or not, if expired..
                return (object) array(
                    "success" => false,
                    "error" => "Token has expired",
                );
                //redirect to token expired
            } else { //if token still valid
                return (object) array(
                    "success" => true,
                );
            }
        }
    }

    function deleteToken($key, $type)
    {
        $query_delete_token = null;
        if ($type === "verify") {
            $query_delete_token = $this->conn->prepare("DELETE FROM `verify_tokens_temp` WHERE v_key = ? and user_id = '$this->user_id';");
        } else if ($type === "delete_reset") {
            $query_delete_token = $this->conn->prepare("DELETE FROM `reset_tokens_temp` WHERE v_key = ? and user_id = '$this->user_id';");
        }
        if (!empty($query_delete_token)) {
            $query_delete_token->bind_param("s", $key);
            $query_delete_token->execute();
        }
    }

    function checkCookie()
    {
        //check cookie if it set
        if (isset($_COOKIE['remember_token'])) {
            $remember_token = $_COOKIE['remember_token'];
            $query_read_rtoken = $this->conn->prepare("SELECT `user_id`, `name`, `email`, `status`, `email_verified_at`, `remember_token`, `last_activity`, `created_at`, `updated_at`  FROM `users` WHERE `remember_token` = ?;");
            $rtoken = $remember_token;
            $query_read_rtoken->bind_param("s", $rtoken);
            //check if cookie exists in `users` table`
            $query_read_rtoken->execute();
            $res = $query_read_rtoken->get_result();
            $row = $res->fetch_assoc();
            if ($row > 0) {
                //check if remember_token in user table is the same with the one in cookie
                if ($row['remember_token'] === $remember_token) {
                    //login
                    session_start();
                    $this->user_id = $row["user_id"];
                    //set session
                    $_SESSION["user_id"] = $row["user_id"];
                }
            }
        }
    }

    function checkRegisteredUsername($username)
    {
        $query_check_email = $this->conn->prepare("SELECT * FROM users WHERE username = ?");
        $query_check_email->bind_param("s", $username);
        $query_check_email->execute();
        $res = $query_check_email->get_result();
        $row = $res->fetch_assoc();
        if ($row > 0) {
            return ["success" => true, "author_id" => $row["user_id"],];
        } else {
            return ["success" => false];
        }
    }
}
