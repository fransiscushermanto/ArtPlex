<?php

class Auth
{
    protected $conn, $user_id;

    public function __construct($conn, $user_id)
    {
        $this->conn = $conn;
        $this->user_id = (int) $user_id;
    }

    function user()
    {
        if (!empty($this->user_id)) {
            $q = mysqli_query($this->conn, "SELECT user_id as id, name, email, email_verified_at, remember_token, last_activity, created_at, updated_at FROM users WHERE user_id = '$this->user_id'");
            $row = mysqli_fetch_array($q);
            return $row > 0 ? (object) array(
                "id" => $row['id'],
                "name" => $row['name'],
                "email" => $row['email'],
                "email_verified_at" => $row['email_verified_at'],
                "remember_token" => $row['remember_token'],
                "last_activity" => $row['last_activity'],
                "created_at" => $row['created_at'],
                "updated_at" => $row['updated_at'],
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
        $query = "";
        //check if token exist or not
        if ($type === "verify") {
            $query =  "SELECT * FROM `verify_tokens_temp` WHERE v_key = '$key' and  user_id = '$this->user_id';";
        } else if ($type === "forget") {
            $query = "SELECT * FROM `reset_tokens_temp` WHERE v_key = '$key' and  user_id = '$this->user_id';";
        }
        $query_check_token = mysqli_query($this->conn, $query);
        $query_get_user_data = mysqli_query($this->conn, "SELECT * FROM users WHERE user_id = '$this->user_id'");
        $row = mysqli_fetch_assoc($query_check_token);
        $rowUser = mysqli_fetch_assoc($query_get_user_data);

        if ($row <= 0) { //if token doesn't exist
            $this->deleteToken($key, $type);
            return (object) array(
                "success" => false,
            );
            //redirect to "token doesn't exist" page
        } else { //if token exists
            $expiry_date = $row['exp_date'];
            $current_date = $cur_date = date("Y-m-d H:i:s");
            if ($current_date > $expiry_date) { //compare if token expire or not, if expired..
                return (object) array(
                    "success" => false,
                );
                //redirect to token expired
            } else { //if token still valid
                return (object) array(
                    "success" => true,
                    "email" => $rowUser['email'],
                );
            }
        }
    }

    function deleteToken($key, $type)
    {
        $query_delete_token = "";
        if ($type === "verify") {
            $query_delete_token = "DELETE FROM `verify_tokens_temp` WHERE v_key = '$key' and user_id = '$this->user_id';";
        } else if ($type === "delete_reset") {
            $query_delete_token = "DELETE FROM `reset_tokens_temp` WHERE v_key = '$key' and user_id = '$this->user_id';";
        }
        mysqli_query($this->conn, $query_delete_token);
    }

    function checkCookie()
    {
        //check cookie if it set
        if (isset($_COOKIE['remember_token'])) {
            $remember_token = $_COOKIE['remember_token'];
            $query_read_rtoken = mysqli_query($this->conn, "SELECT `user_id`, `name`, `email`, `status`, `email_verified_at`, `remember_token`, `last_activity`, `created_at`, `updated_at`  FROM `users` WHERE `remember_token` = '$remember_token';");
            //check if cookie exists in `users` table`
            $row = mysqli_fetch_assoc($query_read_rtoken);
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
}
