<?php

class UsersController
{
    protected $conn, $user_id, $name, $email, $username, $password, $status, $level, $email_verified_at, $remember_token, $last_activity, $created_at, $updated_at;

    public function __construct($conn, $user_id = "", $name = "", $email = "", $username = "", $password = "", $status = "", $level = "", $email_verified_at = "", $remember_token = "", $last_activity = "", $created_at = "", $updated_at = "")
    {
        $this->conn = $conn;
        $this->user_id = $user_id;
        $this->name = $name;
        $this->email = $email;
        $this->username = $username;
        $this->password = $password;
        $this->status = $status;
        $this->level = $level;
        $this->email_verified_at = $email_verified_at;
        $this->remember_token = $remember_token;
        $this->last_activity = $last_activity;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
    }

    public function getUser()
    {
        $query_get = $this->conn->prepare("SELECT * FROM `users` WHERE `user_id` = ?;");
        $query_get->bind_param("s", $this->user_id);
        $query_get->execute();
        $res = $query_get->get_result();
        $row = $res->fetch_assoc();
        if ($row > 0) {
            return (object) array(
                "user_id" => $row['user_id'],
                "name" => $row['name'],
                "email" => $row['email'],
                "username" => $row['username'],
                "password" => $row['password'],
                "status" => $row['status'],
                "level" => $row['level'],
                "email_verified_at" => $row['email_verified_at'],
                "remember_token" => $row['remember_token'],
                "last_activity" => $row['last_activity'],
                "created_at" => $row['created_at'],
                "updated_at" => $row['updated_at'],
            );
        }
    }


    public function getListUser($page = 0, $name = "", $access_time = "", $deleted_number = 0)
    {
        if ($access_time !== "") {
            try {
                $dt = DateTime::createFromFormat("D M d Y H:i:s e+", $access_time);
                $access_time = $dt->format("Y-m-d H:i:s");
            } catch (Exception $eh) {
                return (object) array("success" => false, "comments" => [], "error" => "Failed to parse time", "page" => $page, "access_time" => $access_time);
            }
        }
        $arr_user = array();
        $limit = 10;
        $offset = ($page * $limit) - $deleted_number;
        $query = "SELECT * FROM `users` ";
        if ($access_time !== "") {
            $query .= " WHERE created_at < ? ";
        }
        if ($name != "") {
            $name = '%' . $name . '%';
            if ($access_time !== "") $query .= " AND `name` LIKE ? ";
            else     $query .= " WHERE `name` LIKE ? ";
        }
        $query .= " LIMIT $limit OFFSET $offset;";
        $query_get_list = $this->conn->prepare($query);
        if ($name !== "" && $access_time !== "") $query_get_list->bind_param("ss", $access_time, $name);
        else if ($name !== "") $query_get_list->bind_param("s", $name);
        else if ($access_time !== "") $query_get_list->bind_param("s", $access_time);
        $query_get_list->execute();
        $res = $query_get_list->get_result();
        $row = $res->fetch_assoc();
        if ($row > 0) {
            do {
                array_push($arr_user, (object) array(
                    "user_id" => $row['user_id'],
                    "name" => $row['name'],
                    "email" => $row['email'],
                    "username" => $row['username'],
                    "password" => $row['password'],
                    "verified" => $row['verified'] === 1 ? true : false,
                    "status" => $row['status'] === "on" ? true : false,
                    "level" => $row['level'],
                    "email_verified_at" => $row['email_verified_at'],
                    "remember_token" => $row['remember_token'],
                    "last_activity" => $row['last_activity'],
                    "created_at" => $row['created_at'],
                    "updated_at" => $row['updated_at'],
                ));
            } while ($row = $res->fetch_assoc());
        }
        if (count($arr_user) > 0) {
            return (object) array("success" => true, "users" => $arr_user);
        } else {
            return (object) array("success" => false, "users" => $arr_user, "error" => mysqli_error($this->conn), "access_time" => $access_time);
        }
    }

    public function deleteUser()
    {
        $query_check_comment = $this->conn->prepare("SELECT * FROM `comments` WHERE `user_id` = ?;");
        $query_check_comment->bind_param("s", $this->user_id);
        $query_check_comment->execute();
        $res_comment = $query_check_comment->get_result();
        $row_comment = $res_comment->fetch_assoc();
        $comment_error = ($row_comment > 0) ? true : false;

        $query_check_story = $this->conn->prepare("SELECT * FROM `stories` WHERE `user_id` = ?");
        $query_check_story->bind_param("s", $this->user_id);
        $query_check_story->execute();
        $res_story = $query_check_story->get_result();
        $row_story = $res_story->fetch_assoc();
        $story_error = ($row_story > 0) ? true : false;

        if ($comment_error && $story_error) {
            return ["success" => false, "error" => "There's story and comments related to this user",];
        } else if ($comment_error) {
            return ["success" => false, "error" => "There's comment related to this user"];
        } else if ($story_error) {
            return ["success" => false, "error" => "There's story related to this user"];
        } else {
            $query_delete = "
            DELETE FROM verify_tokens_temp WHERE user_id = '$this->user_id';
            DELETE FROM reset_tokens_temp WHERE user_id = '$this->user_id';
            DELETE FROM users WHERE user_id = '$this->user_id';
            ";
            if (mysqli_multi_query($this->conn, $query_delete)) {
                while ($this->conn->next_result()) {;
                }
                return [
                    "success" => true,
                    "error" => "",
                ];
            } else {
                while ($this->conn->next_result()) {;
                }
                return [
                    "success" => false,
                    "error" =>  "Failed to delete user -  " . mysqli_error($this->conn),
                ];
            }
        }
    }

    public function bulkDeleteUser($arr_user)
    {
        foreach ($arr_user as $user) {
            $this->user_id = $user->user_id;
            $query_delete = "
                DELETE stories_comments, comments FROM comments JOIN stories_comments ON stories_comments.comment_id = comments.comment_id WHERE comments.user_id = '$this->user_id';
                DELETE stories_categories, stories_publish FROM stories JOIN stories_publish ON stories_publish.story_id = stories.story_id JOIN stories_categories ON stories_categories.story_id = stories.story_id WHERE stories.user_id = '$this->user_id';
                DELETE FROM stories WHERE user_id = '$this->user_id';
                DELETE FROM verify_tokens_temp WHERE user_id = '$this->user_id';
                DELETE FROM users WHERE user_id = '$this->user_id';
                DELETE FROM reset_tokens_temp WHERE user_id = '$this->user_id';
                DELETE FROM users WHERE user_id = '$this->user_id';
                ";
            if (!mysqli_multi_query($this->conn, $query_delete)) {
                return (object) array(
                    "success" => false,
                    "error" => "Failed to delete user -  " . mysqli_error($this->conn),
                );
            }
            while ($this->conn->next_result()) {;
            }
        }

        return (object) array(
            "success" => true,
        );
    }

    public function updateUser()
    {
        date_default_timezone_set('Asia/Bangkok');
        $date = new DateTime();
        $current_date = $date->format('Y-m-d H:i:s');
        $query_update = $this->conn->prepare("UPDATE `users` SET 
            `name`=?,
            `level`=?,
            `updated_at`=? 
            WHERE `user_id` = ?");

        $query_update->bind_param("ssss", $this->name,  $this->level, $current_date, $this->user_id);
        if ($query_update->execute()) {
            return (object) array(
                "success" => true,
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to update user - " . mysqli_error($this->conn),
            );
        }
    }

    public function updateUserStatus()
    {
        $status = ($this->status) ?  "on" : "off";
        $query_toggle = $this->conn->prepare("UPDATE `users` SET `status` = ? WHERE `user_id` = ?");
        $query_toggle->bind_param("ss", $status, $this->user_id);
        if ($query_toggle->execute()) {
            return (object) array(
                "success" => true,
                "error" => "",
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to toggle user - " . mysqli_error($this->conn),
            );
        }
    }
}
