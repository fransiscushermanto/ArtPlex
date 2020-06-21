<?php
//ob_start();

use PHPMailer\PHPMailer\PHPMailer;

class RegisterController
{
    protected $name, $email, $password, $conn;

    public function __construct($conn, $email,  $name = "", $password = "")
    {
        $this->name = $name;
        $this->email = $email;
        $this->password = $password;
        $this->conn = $conn;
    }


    public function createUser()
    {
        $query_check_email = mysqli_query($this->conn, "SELECT * FROM users WHERE email = '$this->email'");

        $row = mysqli_fetch_array($query_check_email);
        if ($row > 0) {
            return ["success" => false, "error" => "Email is already in used"];
        } else {
            $this->password = password_hash($this->password, PASSWORD_BCRYPT);
            $current_date = date("Y-m-d H:i:s");
            $query = "INSERT INTO users (name, email, password, status, updated_at) VALUES ('$this->name', '$this->email', '$this->password', 'off', '$current_date')";
            $res = mysqli_query($this->conn, $query);
            if (!$res) {
                return ["success" => false, "error" => mysqli_error($this->conn)];
            } else return ["success" => true, "error" => ""];
        }
    }

    public function composeMail()
    {

        $q = mysqli_query($this->conn, "SELECT user_id, name FROM users WHERE email = '$this->email';");
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

            //inserting key into database
            $query_insert_token = mysqli_query($this->conn, "INSERT INTO `tokens_temp`(`v_key`, `user_id`, `exp_date`) VALUES ('$key','$user_id','$expiry_date')");
            if ($query_insert_token) {
                $mail = new PHPMailer(true);
                try {
                    //body email
                    $output = '<p>Dear user,</p>';
                    $output .= '<p>Please click on the following link to verify your Artplex account email.</p>';
                    $output .= '<p>-------------------------------------------------------------</p>';
                    $output .= '<p><a href="' . BASE_URL . 'verify?key=' . $key . '&user_id=' . $user_id .
                        '&action=reset" target="_blank">Click here to verify your email</a></p>';
                    $output .= '<p>-------------------------------------------------------------</p>';
                    $output .= '<p>Please be sure to copy the entire link into your browser.
                    The link will expire after 30 minutes for security reason.</p>';
                    $output .= '<p>If you did not request this forgotten password email, no action 
                    is needed, your password will not be reset. However, you may want to log into 
                    your account and change your security password as someone may have guessed it.</p>';
                    $output .= '<p>Thanks,</p>';
                    $output .= '<p>Artplex</p>';
                    $body = $output;
                    $subject = "Account Email Verification - Artplex";

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
                            "message" => "Successfully send password recovery mail."
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
                    "message" => "Failed to insert token to database."
                );
            }
        } else {
            return (object) array(
                "success" => false,
                "message" => "Email doesn't exist."
            );
        }
    }

    public function verifyEmail($user_id, $key)
    {
        $cur_date = date("Y-m-d H:i:s");
        $query_update_user = "UPDATE users SET status='on', email_verified_at = '$cur_date' where user_id = '$user_id';";
        if (mysqli_query($this->conn, $query_update_user)) { //if user status update success
            return (object) array(
                "success" => true,
                "error" => "",
            );
            //redirect to email_verified page
        } else { //if user status update fails
            return (object) array(
                "success" => false,
                "error" => "Something went wrong when updating status in user table",
            );
            //something when wrong when updating user table
        }
    }
}
