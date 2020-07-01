<?php

class LoginController
{
    protected $conn, $email, $password, $remember_me, $input;
    public function __construct($conn, $email, $password, $remember_me)
    {
        $this->conn = $conn;
        $this->email = $email;
        $this->password = $password;
        $this->remember_me = $remember_me;
    }

    public function authenticateUser()
    {
        $query_select = $this->conn->prepare("SELECT user_id AS id,  password, created_at FROM users WHERE `email` = ? OR `username` = ?");
        $query_select->bind_param("ss", $this->email, $this->email);
        $query_select->execute();
        $res = $query_select->get_result();
        $row = $res->fetch_assoc();
        if ($row > 0) {
            if (password_verify($this->password, $row['password'])) {
                $user_id = $row["id"];

                if ($this->remember_me === true) {
                    $created_at = $row["created_at"];
                    $remember_token = keygen($this->email . $created_at);
                    $query_insert_remember_token = $this->conn->prepare("UPDATE `users` SET `remember_token` = ? WHERE `user_id` = '$user_id';");
                    $query_insert_remember_token->bind_param("s", $remember_token);


                    if ($query_insert_remember_token->execute()) {
                        $cookie_name = "remember_token";
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
            } else return ["success" => false, "error" => "Sorry, Email/Username or Password is incorrect"];
        } else return ["success" => false, "error" => "Email or Username is not registered"];
    }
}
