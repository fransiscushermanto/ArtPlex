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

        $q = mysqli_query($this->conn, "SELECT user_id AS id,  password, created_at FROM users WHERE email = '$this->email'");

        $row = mysqli_fetch_assoc($q);
        if ($row > 0) {
            if (password_verify($this->password, $row['password'])) {
                $user_id = $row["id"];

                if ($this->remember_me) {
                    $created_at = $row["created_at"];
                    $remember_token = keygen($this->email . $created_at);
                    $query_insert_remember_token = "UPDATE `users` SET `remember_token` = '$remember_token' WHERE `user_id` = '$user_id';";
                    if (mysqli_query($this->conn, $query_insert_remember_token)) {
                        $cookie_name = "remember_me";
                        $cookie_value = $remember_token;
                        $domain = ($_SERVER['HTTP_HOST'] != 'localhost') ? $_SERVER['HTTP_HOST'] : false;
                        setcookie($cookie_name, $cookie_value, time() + 30 * 24 * 3600, '/', $domain, false); //1 bulan
                        session_start();

                        $_SESSION['user_id'] = $row['id'];
                        return (object) array(
                            "success" => true,
                            "error" => "",
                            "rtoken" => $remember_token,
                        );
                    } else {
                        return (object) array(
                            "success" => false,
                            "error" => "Failed to insert remember token",
                            "rtoken" => $remember_token,
                        );
                    }
                } else {
                    session_start();

                    $_SESSION['user_id'] = $row['id'];
                    return (object) array(
                        "success" => true,
                        "error" => "",
                    );
                }
            } else return ["success" => false, "error" => "Sorry, Email or Password is incorrect"];
        } else return ["success" => false, "error" => "Email is not registered"];
    }
}
