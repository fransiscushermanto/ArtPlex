<?php
//ob_start();

use PHPMailer\PHPMailer\PHPMailer;

class RegisterController
{
    protected $name, $email, $password, $conn, $username;

    public function __construct($conn, $email,  $name = "", $password = "", $username = "")
    {
        $this->name = $name;
        $this->email = $email;
        $this->password = $password;
        $this->username = $username;
        $this->conn = $conn;
    }

    public function createUser()
    {
        //check email
        $query_check_email = $this->conn->prepare("SELECT * FROM users WHERE email = ?");
        $query_check_email->bind_param("s", $this->email);
        $query_check_email->execute();
        $res = $query_check_email->get_result();
        $row = $res->fetch_assoc();
        $email_error = ($row > 0) ? true : false;

        //check username
        $query_check_username = $this->conn->prepare("SELECT *  FROM users WHERE username = ?");
        $query_check_username->bind_param("s", $this->username);
        $query_check_username->execute();
        $res = $query_check_username->get_result();
        $row = $res->fetch_assoc();
        $username_error = ($row > 0) ? true : false;

        if ($email_error && $username_error) {
            return ["success" => false, "error" => (object) array("email" => "Email already being used", "username" => "Username already being used")];
        } else if ($email_error) {
            return ["success" => false, "error" => (object) array("email" => "Email already being used", "username" => null)];
        } else if ($username_error) {
            return ["success" => false, "error" => (object) array("email" => null, "username" => "Username already being used")];
        } else {
            $this->password = password_hash($this->password, PASSWORD_BCRYPT);
            $current_date = date("Y-m-d H:i:s");
            $query_insert_user = $this->conn->prepare("INSERT INTO users (`name`, `email`, `password`, `status`, `updated_at`, `levels`,`username`) VALUES (?, ?, ?, 'off', ?, 'reader', ?)");
            $query_insert_user->bind_param("sssss", $this->name, $this->email, $this->password, $current_date, $this->username);
            $res = $query_insert_user->execute();
            if (!$res) {
                return ["success" => false, "error" => (object) array("email" => null, "username" => null, "other" => mysqli_error($this->conn))];
            } else return ["success" => true, "error" => (object) array("email" => null, "username" => null)];
        }
    }

    public function composeMail()
    {

        $query_check_email = $this->conn->prepare("SELECT user_id, name, status FROM users WHERE email = ?;");
        $query_check_email->bind_param("s", $this->email);
        $query_check_email->execute();
        $res = $query_check_email->get_result();
        $row = $res->fetch_assoc();

        if ($row > 0) {
            if ($row["status"] === "off") { //if user status is 'off'
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
                date_default_timezone_set("Europe/Kaliningrad");
                $expiry_date = date("Y-m-d H:i:s", $expiry_date_format);

                //generating key
                $any =  (2418 * 2);
                $key = md5(((string) $any . $this->email));
                $addKey = password_hash(uniqid(rand(), 1), PASSWORD_BCRYPT);
                $key = $key . "." . $addKey;

                $query = '';
                $query_check_user_token = mysqli_query($this->conn, "SELECT * FROM verify_tokens_temp WHERE user_id = '$user_id'");
                $token_user_row = mysqli_fetch_assoc($query_check_user_token);
                $res = null;
                if ($token_user_row > 0) {
                    $query_insert_token = $this->conn->prepare("UPDATE `verify_tokens_temp` SET v_key = '$key' WHERE user_id = ?");
                    $query_insert_token->bind_param("i", $user_id);
                    $res = $query_insert_token->execute();
                } else {
                    $query_insert_token = $this->conn->prepare("INSERT INTO `verify_tokens_temp`(`v_key`, `user_id`, `exp_date`) VALUES (?, ?, ?)");
                    $query_insert_token->bind_param("sis", $key, $user_id, $expiry_date);
                    $res = $query_insert_token->execute();
                }
                if ($res) {
                    $mail = new PHPMailer(true);
                    try {
                        //body email
                        $output = '<p>Dear user,</p>';
                        $output .= '<p>Please click on the following link to verify your Artplex account email.</p>';
                        $output .= '<p>-------------------------------------------------------------</p>';
                        $output .= '<p><a href="' . BASE_URL . 'verify?key=' . $key . '&user_id=' . $user_id .
                            '" target="_blank">Click here to verify your email</a></p>';
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
                            // echo "Mailer Error: " . $mail->ErrorInfo;
                            return (object) array(
                                "success" => false,
                                "error" => "Something went wrong when server trying to send password recovery mail."
                            );
                        } else {
                            return (object) array(
                                "success" => true,
                                "error" => ""
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
                        "error" => "Failed to insert token to database."
                    );
                }
            } else {
                return (object) array( //if user status is 'on'
                    "success" => false,
                    "error" => "Email is already verified"
                );
            }
        } else {
            return (object) array(
                "success" => false,
                "error" => "Email doesn't exist."
            );
        }
    }

    public function verifyEmail($user_id)
    {
        $current_date = date("Y-m-d H:i:s");
        $query_update_user = "UPDATE users SET status='on', email_verified_at = '$current_date', updated_at = '$current_date' where user_id = '$user_id';";
        if (mysqli_query($this->conn, $query_update_user)) { //if user status update success
            return (object) array(
                "success" => true,
                "error" => "",
                "updated_at" => $current_date
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
