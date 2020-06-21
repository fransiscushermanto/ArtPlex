<?php

//ob_start();

use PHPMailer\PHPMailer\PHPMailer;

class ForgetPasswordController
{
    protected $email, $conn;

    public function __construct($conn, $email = "")
    {
        $this->conn = $conn;
        $this->email = $email;
    }

    function checkEmail()
    {
        $q = mysqli_query($this->conn, "SELECT user_id, status FROM users WHERE email = '$this->email'");
        $row = mysqli_fetch_assoc($q);
        if ($row > 0) {
            $status = $row["status"];
            if ($status === 'on') {
                return (object) array(
                    "success" => true,
                    "error" => "",
                    "status" => $status,
                );
            } else {
                return (object) array(
                    "success" => false,
                    "error" => "Email is not verified yet.",
                    "status" => $status,
                );
            }
        } else {
            return (object) array(
                "success" => false,
                "error" => "Email is not registered",
            );
        }
    }

    function composeMail()
    {

        $q = mysqli_query($this->conn, "SELECT user_id, name FROM users WHERE email = '$this->email'");
        $row = mysqli_fetch_assoc($q);

        if ($row > 0) {
            //fetching data from query result
            $user_id = $row["user_id"];
            $name = $row["name"];


            //setting expiry date for key
            $expiry_date_format = mktime(
                date("H"),
                date("i") + 30,
                date("s"),
                date("m"),
                date("d"),
                date("Y")
            );

            $expiry_date = date("Y-m-d H:i:s", $expiry_date_format);

            //generating key
            $any =  (2418 * 2);
            $key = md5(((string) $any . $this->email));
            $addKey = password_hash(uniqid(rand(), 1), PASSWORD_BCRYPT);
            $key = $key . "." . $addKey;

            $query = '';
            $query_check_user_token = mysqli_query($this->conn, "SELECT * FROM reset_tokens_temp WHERE user_id = '$user_id'");
            $token_user_row = mysqli_fetch_assoc($query_check_user_token);
            if ($token_user_row > 0) {
                $query = "UPDATE `reset_tokens_temp` SET v_key = '$key' WHERE user_id = '$user_id'";
            } else {
                $query = "INSERT INTO `reset_tokens_temp`(`v_key`, `user_id`, `exp_date`) VALUES ('$key','$user_id','$expiry_date')";
            }
            $query_insert_token = mysqli_query($this->conn, $query);
            //inserting key into database
            if ($query_insert_token) {
                $mail = new PHPMailer(true);
                try {
                    //body email
                    $output = '<p>Dear user,</p>';
                    $output .= '<p>Please click on the following link to reset your password.</p>';
                    $output .= '<p>-------------------------------------------------------------</p>';
                    $output .= '<p><a href="' . BASE_URL . 'reset?key=' . $key . '&user_id=' . $user_id .
                        '" target="_blank">Click here to recover your password</a></p>';
                    $output .= '<p>-------------------------------------------------------------</p>';
                    $output .= '<p>Please be sure to copy the entire link into your browser.
                    The link will expire after 30 minutes for security reason.</p>';
                    $output .= '<p>If you did not request this forgotten password email, no action 
                    is needed, your password will not be reset. However, you may want to log into 
                    your account and change your security password as someone may have guessed it.</p>';
                    $output .= '<p>Thanks,</p>';
                    $output .= '<p>Artplex</p>';
                    $body = $output;
                    $subject = "Password Recovery - Artplex";

                    $mail->isSMTP();
                    $mail->Host = env("MAIL_HOST", "smtp");
                    $mail->setFrom(env("MAIL_FROM_ADDRESS", ""), env("APP_NAME", "REACT PHP"));
                    $mail->Port = env("MAIL_PORT", "25");
                    $mail->SMTPDebug = 2;
                    $mail->SMTPSecure = env("MAIL_ENCRYPTION", "tls");
                    $mail->SMTPAuth = true;
                    $mail->Username = env("MAIL_FROM_ADDRESS", "");
                    $mail->Password = env("MAIL_PASSWORD", "");
                    $mail->addAddress($this->email, $name);
                    $mail->isHTML(true);
                    $mail->Subject = $subject;
                    $mail->Body = $body;

                    if (!$mail->send()) {
                        echo "Mailer Error: " . $mail->ErrorInfo;
                        return (object) array(
                            "success" => false,
                            "message" => "Something went wrong when server trying to send password recovery mail."
                        );
                    } else {
                        return (object) array(
                            "success" => true,
                            "error" => "",
                        );
                        //header("Location: " . BASE_URL . "PleaseCheckYourMail.php?name=" . $name);
                    }
                } catch (Exception $e) {
                    echo "Caught Exception: " . $e->getMessage() . "<br>";
                    echo "Something went wrong when trying to send password recovery mail.";
                }
            } else {
                return (object) array(
                    "success" => false,
                    "error" => "Something went wrong when trying to insert token to database $query_insert_token"
                );
            }
        } else {
            return (object) array(
                "success" => false,
                "Error" => "Email doesn't exist.",
            );
        }
    }


    function changePassword($user_id, $new_password)
    {
        $query_check_old_password = "SELECT password FROM users WHERE user_id = '$user_id'";
        if ($result = mysqli_query($this->conn, $query_check_old_password)) {
            $row = mysqli_fetch_assoc($result);
            $old_password = $row['password'];
            if (password_verify($new_password, $old_password)) { //if new password is the same as the old one
                return (object) array(
                    "success" => false,
                    "error" => "Password may not same as the old password.",
                );
            } else { //if new password is not the same as the old one
                $new_password = password_hash($new_password, PASSWORD_BCRYPT);
                $query_change_password = "UPDATE users SET `password`= '$new_password' WHERE user_id = '$user_id'";
                if ($result = mysqli_query($this->conn, $query_change_password)) {
                    return (object) array(
                        "success" => true,
                        "error" => "",
                    );
                } else {
                    return (object) array(
                        "success" => false,
                        "error" => "Failed to update password",
                    );
                }
            }
        }
    }
}
