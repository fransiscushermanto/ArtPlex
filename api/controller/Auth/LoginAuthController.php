<?php

class LoginController
{
    protected $conn, $email, $password, $remember_me;
    public function __construct($conn, $email, $password, $remember_me)
    {
        $this->conn = $conn;
        $this->email = $email;
        $this->password = $password;
        $this->remember_me = $remember_me;
    }

    public function authenticateUser()
    {

        $q = mysqli_query($this->conn, "SELECT user_id AS id, status, password FROM users WHERE email = '$this->email'");

        $row = mysqli_fetch_assoc($q);
        if ($row > 0) {
            $status = $row['status'];
            if (password_verify($this->password, $row['password'])) {
                if ($status === "on") {
                    session_start();

                    $_SESSION['user_id'] = $row['id'];
                    return ["success" => true, "status" => $status];
                } else {
                    return ["success" => false, "error" => "Account is not activated", "status" => $status];
                }
            } else return ["success" => false, "error" => "Sorry, Email or Password is incorrect", "status" => $status];
        } else return ["success" => false, "error" => "Email is not registered"];
    }
}
