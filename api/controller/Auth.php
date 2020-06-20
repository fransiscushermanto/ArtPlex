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

    function verifyToken($key)
    {
        //check if token exist or not
        $query_check_token = mysqli_query($this->conn, "SELECT * FROM `tokens_temp` WHERE v_key = '$key' and  user_id = '$this->user_id';");
        $row = mysqli_fetch_assoc($query_check_token);
        if ($row <= 0) { //if token doesn't exist
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
                );
            }
        }
    }

    function deleteToken($key)
    {
        $query_delete_token =  "DELETE FROM `tokens_temp` WHERE v_key = '$key' and user_id = '$this->user_id';";
        mysqli_query($this->conn, $query_delete_token);
    }
}
