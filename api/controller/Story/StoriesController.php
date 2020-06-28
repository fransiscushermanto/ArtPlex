<?php

class StoriesController
{
    protected $conn, $story_id, $user_id, $title, $title_html, $body, $body_html, $total_word;

    public function __construct($conn, $user_id = "", $title = "", $title_html = "", $body = "", $body_html = "", $total_word = 0, $story_id = "")
    {
        $this->conn = $conn;
        $this->user_id = $user_id;
        $this->story_id = $story_id;
        $this->title = $title;
        $this->title_html = $title_html;
        $this->body = $body;
        $this->body_html = $body_html;
        $this->total_word = $total_word;
        date_default_timezone_set('Asia/Bangkok');
    }

    function verifyStoryId()
    {
        $query_verify_story_id = "SELECT `story_id` FROM `stories` WHERE `story_id` = '$this->story_id' AND `user_id` = '$this->user_id'";
        $res = mysqli_query($this->conn, $query_verify_story_id);
        $row = mysqli_fetch_assoc($res);
        return ($row > 0) ? (object) array("success" => true, "error" => mysqli_error($this->conn)) : (object) array("success" => false, "error" => mysqli_error($this->conn));
    }

    function writeStory()
    {
        if (empty($this->story_id)) {
            return $this->createStory();
        } else {
            return $this->continueStory();
        }
    }
    function createStory()
    {
        $date = new DateTime();
        $current_date = $date->format('Y-m-d H:i:s');
        $this->story_id = $this->generateStoryID($this->user_id);
        $query_create = $this->conn->prepare("INSERT INTO `stories`(`story_id`, `title`, `title_html`, `body`, `body_html`, `total_word`, `last_update`, `user_id`, `status`) VALUES(?,?,?,?,?,?,?,?,'off');");
        $query_create->bind_param("ssssssss", $this->story_id, $this->title, $this->title_html, $this->body, $this->body_html, $this->total_word,  $current_date, $this->user_id);

        if ($query_create->execute()) {
            return (object) array(
                "success" => true,
                "error" => "",
                "story_id" => $this->story_id,
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to create story",
            );
        }
    }

    function continueStory()
    {
        $date = new DateTime();
        $current_date = $date->format('Y-m-d H:i:s');

        $query_continue = $this->conn->prepare("UPDATE stories SET `title` = ?, `title_html` = ?, `body` = ?, `body_html` = ?, `last_update` = ?  WHERE `story_id` = ? AND `user_id` = ?;");
        $query_continue->bind_param("sssssss", $this->title, $this->title_html, $this->body, $this->body_html, $current_date, $this->story_id, $this->user_id);


        if ($query_continue->execute()) {
            return (object) array(
                "success" => true,
                "error" => "",
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to update story",
            );
        }
    }

    function publishStory()
    {
        $date = new DateTime();
        $current_date = $date->format('Y-m-d H:i:s');
        $query = "";
        $query_get_user = mysqli_query($this->conn, "SELECT * FROM users WHERE `user_id` = '$this->user_id';");
        $row = mysqli_fetch_assoc($query_get_user);

        if ($row['levels'] === "reader") $query .= "UPDATE users SET `levels`='author',`updated_at`='$current_date' WHERE `user_id` = '$this->user_id'; ";
        $query .= "UPDATE `stories` SET `status` = 'on',  `last_update` = '$current_date', `publish_date` = '$current_date' WHERE `story_id` = '$this->story_id' ;";

        if (mysqli_multi_query($this->conn, $query)) {
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
                "error" => "Failed to publish story or upgrade user",
            );
        }
    }

    function unpublishStory()
    {
        $date = new DateTime();
        $current_date = $date->format('Y-m-d H:i:s');

        $query_publish = mysqli_query($this->conn, "UPDATE stories SET `status` = 'off', `last_update` = '$current_date', `publish_date` = '$current_date' WHERE `story_id` = '$this->story_id';");
        if ($query_publish) {
            return (object) array(
                "success" => true,
                "error" => "",
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to unpublish story",
            );
        }
    }

    function deleteStory()
    {
        $delete_query = "DELETE from stories where `story_id` = '$this->story_id' and `user_id` = '$this->user_id'";
        if (mysqli_query($this->conn, $delete_query)) {
            return (object) array(
                "success" => true,
                "error" => ""
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to delete story"
            );
        }
    }

    function deleteRangeStory($stories_id)
    {
        $delete_query = "";
        foreach ($stories_id as $story_id) {
            $delete_query .= "DELETE from stories where story_id = '$story_id'; ";
        }
        mysqli_query($this->conn, $delete_query);
    }

    function getAllPublishedStories($status)
    {
        $query_get_story_list = "SELECT `story_id`, s.title, s.title_html, s.body, s.body_html, s.total_word, s.last_update, s.publish_date, s.user_id FROM stories s  WHERE  s.status = 'on' ORDER BY s.publish_date ";
        if ($status === "on") $query_get_story_list .= "ORDER BY publish_date DESC";
        else if ($status === "off") $query_get_story_list .= "ORDER BY last_update DESC";
        $res = mysqli_query($this->conn, $query_get_story_list);
        return $res;
    }

    function getUserStory($type = "")
    {
        $query_view_story = "SELECT `story_id`, s.title, s.title_html, s.body, s.body_html, s.total_word, s.last_update, s.publish_date, s.user_id, status FROM stories s  WHERE  s.user_id = '$this->user_id'  ";
        if (isset($this->story_id)) $query_view_story .= " AND s.story_id = '$this->story_id' ";
        else if ($type === "all") $query_view_story .= "ORDER BY s.last_update DESC";

        $res = mysqli_query($this->conn, $query_view_story);
        $row = mysqli_fetch_assoc($res);
        if ($row > 0) {
            if (isset($this->story_id)) {
                return (object) array(
                    "story_id" => $row['story_id'],
                    "title" => $row['title'],
                    "title_html" => $row['title_html'],
                    "body" => $row['body'],
                    "body_html" => $row['body_html'],
                    "total_word" => $row['total_word'],
                    "last_update" => $row['last_update'],
                    "publish_date" => $row["publish_date"],
                    "status" => $row["status"],
                    "error" => "",
                );
            } else if (isset($type)) {
                $drafArr = array();
                $publishArr = array();
                do {
                    if ($row['status'] === "on") {
                        array_push($publishArr, (object) array(
                            "story_id" => $row['story_id'],
                            "title" => $row['title'],
                            "title_html" => $row['title_html'],
                            "body" => $row['body'],
                            "body_html" => $row['body_html'],
                            "total_word" => $row['total_word'],
                            "last_update" => $row['last_update'],
                            "publish_date" => $row["publish_date"],
                            "status" => $row["status"],
                            "error" => "",
                        ));
                    } else {
                        array_push(
                            $drafArr,
                            (object) array(
                                "story_id" => $row['story_id'],
                                "title" => $row['title'],
                                "title_html" => $row['title_html'],
                                "body" => $row['body'],
                                "body_html" => $row['body_html'],
                                "total_word" => $row['total_word'],
                                "last_update" => $row['last_update'],
                                "publish_date" => $row["publish_date"],
                                "status" => $row["status"],
                                "error" => "",
                            )
                        );
                    }
                } while ($row = mysqli_fetch_assoc($res));
                return (object) array("success" => true, "draftStories" => $drafArr, "publishStories" => $publishArr);
            }
        } else {
            return (object) array(
                "success" => false,
                "error" => "No story found",
            );
        }
    }

    function generateStoryID($user_id)
    {
        $user_id = 10;
        $dt = new DateTime();
        $time = $dt->format('HisvldFY');
        $result = md5($time . $user_id);
        return $result;
    }
}
