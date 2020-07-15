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
        $query_check = $this->conn->prepare("SELECT `user_id`, `verified` FROM `users` WHERE `email` = ?");
        $query_check->bind_param("s", $this->email);
        $query_check->execute();
        $res = $query_check->get_result();
        $row = $res->fetch_assoc();
        if ($row > 0) {
            $verified = $row["verified"];
            if ($verified === 1) {
                return (object) array(
                    "success" => true,
                    "error" => "",
                    "verified" => true,
                );
            } else {
                return (object) array(
                    "success" => false,
                    "error" => "Email is not verified yet.",
                    "verified" => false,
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
        date_default_timezone_set('Asia/Bangkok');
        $query_check = $this->conn->prepare("SELECT user_id, name FROM users WHERE email = ?");
        $query_check->bind_param("s", $this->email);
        $email = $this->email;
        $query_check->execute();
        $res = $query_check->get_result();
        $row = $res->fetch_assoc();

        if ($row > 0) {
            //fetching data from query result
            $user_id = $row["user_id"];
            $name = $row["name"];


            //setting expiry date for key
            $date = new DateTime();
            $date->add(new DateInterval('PT30M'));
            $expiry_date = $date->format('Y-m-d H:i:s');

            //generating key
            $any =  (2418 * 2);
            $key = md5(((string) $any . $this->email));
            $addKey = password_hash(uniqid(rand(), 1), PASSWORD_BCRYPT);
            $key = $key . "." . $addKey;

            $query = null;
            $query_check_user_token = $this->conn->prepare("SELECT * FROM reset_tokens_temp WHERE `user_id` = ?");
            $query_check_user_token->bind_param("s", $user_id);
            $query_check_user_token->execute();
            $res = $query_check_user_token->get_result();
            $token_user_row = $res->fetch_assoc();
            if ($token_user_row > 0) {
                $query = $this->conn->prepare("UPDATE `reset_tokens_temp` SET v_key = ?, `expiry_date` = ? WHERE `user_id` = ?");
                $query->bind_param("sss", $expiry_date, $key, $user_id);
            } else {
                $query = $this->conn->prepare("INSERT INTO `reset_tokens_temp`(`v_key`, `user_id`, `exp_date`) VALUES (?,?,?)");
                $query->bind_param("sss", $key, $user_id, $expiry_date);
            }
            //inserting key into database
            if ($query->execute()) {
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
                        // echo "Mailer Error: " . $mail->ErrorInfo;
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
                    return  $e->getMessage() . "<br>";
                }
            } else {
                return (object) array(
                    "success" => false,
                    "error" => "Something went wrong when trying to insert token to database",
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
        date_default_timezone_set('Asia/Bangkok');
        $query_check_old_password = $this->conn->prepare("SELECT password FROM users WHERE `user_id` = ?");
        $query_check_old_password->bind_param("s", $user_id);
        if ($query_check_old_password->execute()) {
            $res = $query_check_old_password->get_result();
            $row = mysqli_fetch_assoc($res);
            $old_password = $row['password'];
            if (password_verify($new_password, $old_password)) { //if new password is the same as the old one
                return (object) array(
                    "success" => false,
                    "error" => "Password may not same as the old password.",
                );
            } else { //if new password is not the same as the old one
                $new_password = password_hash($new_password, PASSWORD_BCRYPT);
                $date = new DateTime();
                $current_date = $date->format('Y-m-d H:i:s');
                $query_change_password = $this->conn->prepare("UPDATE users SET `password`= ?, updated_at = ? WHERE `user_id` = ?");
                $query_change_password->bind_param("sss", $new_password, $current_date, $user_id);

                if ($query_change_password->execute()) {
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
