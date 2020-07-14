<?php

class CommentsController
{
    protected $conn, $comment_id, $body, $user_id;
    public function __construct($conn, $body, $user_id,  $comment_id = "")
    {
        $this->conn = $conn;
        $this->body = $body;
        $this->user_id = $user_id;
        $this->comment_id = $comment_id;
        // date_default_timezone_set('Asia/Bangkok');
    }

    public function generateCommentId($story_id)
    {
        date_default_timezone_set('Asia/Bangkok');
        $dt = new DateTime();
        $time = $dt->format('HisvldFY');
        $result = md5($time . $this->user_id . $story_id);
        return $result;
    }

    public function createComment($story_id)
    {
        date_default_timezone_set('Asia/Bangkok');
        $date = new DateTime();
        $current_date = $date->format('Y-m-d H:i:s');
        $this->comment_id =  $this->generateCommentId($story_id);
        $query_create = $this->conn->prepare("INSERT INTO `comments` (`comment_id`, `user_id`, `body`,  `publish_date`, `last_updated`, `status`) VALUES (?, ?, ?, ?, ?,  'on');");
        $query_create->bind_param("sssss", $this->comment_id, $this->user_id, $this->body, $current_date, $current_date);
        if ($query_create->execute()) {
            if ($this->belongTo($story_id)) {
                $query_get_user = $this->conn->prepare("SELECT `username`, `name` FROM `users` WHERE `user_id` = ?");
                $query_get_user->bind_param("s", $this->user_id);
                $query_get_user->execute();
                $res = $query_get_user->get_result();
                $row = $res->fetch_assoc();
                return (object) array(
                    "comment" => (object) array(
                        "comment_id" => $this->comment_id,
                        "comment_body" => $this->body,
                        "status" => "on",
                        "publish_date" => $current_date,
                        "last_updated" => $current_date,
                        "user_id" => $this->user_id,
                        "comment_name" => $row['name'],
                        "comment_username" => $row["username"],
                    ),
                    "success" => true,
                );
            }
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to create a new comment",
            );
        }
    }

    public function editComment()
    {
        date_default_timezone_set('Asia/Bangkok');
        $date = new DateTime();
        $current_date = $date->format('Y-m-d H:i:s');
        $query_edit = $this->conn->prepare("UPDATE `comments` UPDATE `comments` SET `body`= ?, `last_updated`= ? WHERE `comment_id` = ?;");
        $query_edit->bind_param("sss", $this->body, $current_date, $this->comment_id);
        if ($query_edit->execute()) {
            return (object) array(
                "success" => true,
                "error" => "",
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to edit comment",
            );
        }
    }

    public function deleteComment()
    {
        $query_delete = "DELETE FROM `stories_comments` WHERE `comment_id` = '$this->comment_id'; DELETE FROM `comments` WHERE `comment_id` = '$this->comment_id'; ";
        if ($this->conn->multi_query($query_delete)) {
            while ($this->conn->next_result()) {;
            }
            return (object) array(
                "success" => true,
                "error" => "",
            );
        } else {
            while ($this->conn->next_result()) {;
            }
            return (object) array(
                "success" => false,
                "error" => "Failed to delete comment",
            );
        }
    }

    public function belongTo($story_id)
    {
        $query_belong = $this->conn->prepare("INSERT INTO `stories_comments` (`story_id`,`comment_id`) VALUES (?, ?)");
        $query_belong->bind_param("ss", $story_id, $this->comment_id);
        if ($query_belong->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function toggleComment()
    {
        $status = ($this->status) ? "on" : "off";
        $query_nonactivate = $this->conn->prepare("UPDATE `comments` SET `status` = ? WHERE `comment_id` = ?");
        $query_nonactivate->bind_param("ss", $status, $this->comment_id);
        if ($query_nonactivate->execute()) {
            return (object) array(
                "success" => true,
                "error" => "",
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to toggle comment",
            );
        }
    }



    public function getListComment($page = 0, $delete)
    {
        $arr_Comment = array();
        $limit = 10;
        $offset = ($page * $limit) - $delete;
        $query_get = $this->conn->prepare("SELECT * FROM `comments` LIMIT ? OFFSET ?;");
        $query_get->bind_param("ii", $limit, $offset);

        $query_get->execute();

        $res = $query_get->get_result();
        $row = $res->fetch_assoc();
        if ($row > 0) {
            do {
                array_push($arr_Comment, (object) array(
                    "comment_id" => $row["comment_id"],
                    "comment_body" => $row["body"],
                    "status" => $row["status"],
                    "publish_date" => $row["publish_date"],
                    "last_updated" => $row["last_updated"],
                    "user_id" => $row["user_id"],
                    "comment_name" => $row['name'],
                    "comment_username" => $row["username"],
                ));
            } while ($row = $res->fetch_assoc());
        }
        if (count($arr_Comment > 0)) {
            return (object) array("success" => true, "comments" => $arr_Comment);
        } else {
            return (object) array("success" => false, "comments" => $arr_Comment);
        }
    }
}
