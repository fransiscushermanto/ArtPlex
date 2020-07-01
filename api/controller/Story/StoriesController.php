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

    public function verifyStoryId($status = "")
    {
        $query_verify_story_id = "SELECT `story_id` FROM `stories` WHERE `story_id` = '$this->story_id' AND `user_id` = '$this->user_id' ";
        if ($status === "public") $query_verify_story_id .= " AND `status` = 'on'";
        $res = mysqli_query($this->conn, $query_verify_story_id);
        $row = mysqli_fetch_assoc($res);
        return ($row > 0) ? (object) array("success" => true, "error" => mysqli_error($this->conn)) : (object) array("success" => false, "error" => mysqli_error($this->conn));
    }

    public function writeStory()
    {
        if (empty($this->story_id)) {
            return $this->createStory();
        } else {
            return $this->continueStory();
        }
    }
    public function createStory()
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

    public function continueStory()
    {
        $date = new DateTime();
        $current_date = $date->format('Y-m-d H:i:s');

        $query_continue = $this->conn->prepare("UPDATE stories SET `title` = ?, `title_html` = ?, `body` = ?, `body_html` = ?, `total_word` = ?, `last_update` = ?  WHERE `story_id` = ? AND `user_id` = ?;");
        $query_continue->bind_param("ssssssss", $this->title, $this->title_html, $this->body, $this->body_html, $this->total_word, $current_date, $this->story_id, $this->user_id);


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

    public function publishStory($preview_image, $categories)
    {
        $date = new DateTime();
        $current_date = $date->format('Y-m-d H:i:s');
        $query_get_user = mysqli_query($this->conn, "SELECT * FROM users WHERE `user_id` = '$this->user_id';");
        $row = mysqli_fetch_assoc($query_get_user);

        if ($row['levels'] === "reader") {
            $query_update_user_level = "UPDATE users SET `levels`='author',`updated_at`='$current_date' WHERE `user_id` = '$this->user_id'; ";
            if (!mysqli_query($this->conn, $query_update_user_level)) {
                return (object) array(
                    "success" => false,
                    "error" => "Failed to upgrade user level",
                );
            }
        }
        $query_publish = $this->conn->prepare("UPDATE `stories` SET `status` = 'on',  `last_update` = ?, `title` = ?, `body` = ? WHERE `story_id` = ? ;");
        $query_publish->bind_param("ssss", $current_date, $this->title, $this->body, $this->story_id);

        if (!($query_publish->execute())) {
            return (object) array(
                "success" => false,
                "error" => "Failed to publish story",
            );
        }

        $query_add_stories_publish = $this->conn->prepare("INSERT INTO `stories_publish` (`story_id`, `preview_image`, `publish_date`) VALUES (?,?,?)");
        $query_add_stories_publish->bind_param("sss", $this->story_id, $preview_image, $current_date);
        if (!$query_add_stories_publish->execute()) {
            return (object) array(
                "success" => false,
                "error" => "Failed to insert story publish - " . mysqli_error($this->conn),
            );
        }

        return ($this->bulkAddLinkCategory($categories));
    }

    // public function unpublishStory()
    // {
    //     $date = new DateTime();
    //     $current_date = $date->format('Y-m-d H:i:s');

    //     $query_publish = mysqli_query($this->conn, "UPDATE stories SET `status` = 'off', `last_update` = '$current_date', `publish_date` = '$current_date' WHERE `story_id` = '$this->story_id';");
    //     if ($query_publish) {
    //         return (object) array(
    //             "success" => true,
    //             "error" => "",
    //         );
    //     } else {
    //         return (object) array(
    //             "success" => false,
    //             "error" => "Failed to unpublish story",
    //         );
    //     }
    // }

    public function deleteStory()
    {
        $delete_query = "DELETE FROM `stories_categories` WHERE `story_id` = '$this->story_id';
                         DELETE FROM `stories_publish` WHERE `story_id` = '$this->story_id';
                        DELETE FROM `stories` WHERE `story_id` = '$this->story_id' and `user_id` = '$this->user_id';";
        if ($this->conn->multi_query($delete_query)) {
            //echo json_encode((object) array("story_id" => $this->story_id, "user_id" => $this->user_id));
            while ($this->conn->next_result()) {;
            }
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

    public function deleteRangeStory($stories_id)
    {
        $delete_query = "";
        foreach ($stories_id as $story_id) {
            $delete_query .= "DELETE from stories where story_id = '$story_id'; ";
        }
        mysqli_query($this->conn, $delete_query);
    }

    // public function checkStoryPublished()
    // {
    //     $query_story_published = "SELECT * from `stories` WHERE `story_id` = '$this->story_id' AND `user_id` = '$this->user_id' AND `status` = 'on'";
    //     $res = mysqli_query($this->conn, $query_story_published);
    //     $row = mysqli_fetch_assoc($res);
    //     if ($row > 0) {
    //         return (object) array(
    //             "success" => true,
    //         );
    //     } else {
    //         return (object) array(
    //             "success" => false,
    //         );
    //     }
    // }


    public function getAllPublishedStories($status)
    {
        $query_get_published_story_list = "SELECT * FROM `stories` s JOIN `stories_publish` sp ON s.story_id WHERE `status` = 'on'  ORDER BY s.`publish_date` DESC ";
        $res = mysqli_query($this->conn, $query_get_published_story_list);
        $row_publish = mysqli_fetch_assoc($res);
        if ($row_publish > 0) {
            do {
                array_push(
                    $publishArr,
                    (object) array(
                        "story_id" => $row_publish['story_id'],
                        "title" => $row_publish['title'],
                        "title_html" => $row_publish['title_html'],
                        "body" => $row_publish['body'],
                        "body_html" => $row_publish['body_html'],
                        "total_word" => $row_publish['total_word'],
                        "last_update" => $row_publish['last_update'],
                        "publish_date" => $row_publish["publish_date"],
                        "status" => $row_publish["status"],
                        "error" => "",
                    )
                );
            } while ($row_publish = mysqli_fetch_assoc($res));
        }
        return $res;
    }

    public function getStory($type)
    {
        $query_view_story = "SELECT * from `stories` WHERE `story_id` = '$this->story_id' ";
        if ($type === "public") $query_view_story .= " AND `status` = 'on'";
        else if ($type === "edit")  $query_view_story .= " AND `status` = 'off'";
        $res = mysqli_query($this->conn, $query_view_story);
        $row = mysqli_fetch_assoc($res);
        if ($row > 0) {
            return (object) array(
                "success" => true,
                "story_id" => $row['story_id'],
                "title" => $row['title'],
                "title_html" => $row['title_html'],
                "body" => $row['body'],
                "body_html" => $row['body_html'],
                "total_word" => $row['total_word'],
                "last_update" => $row['last_update'],
                "status" => $row["status"],
                "error" => "",
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "No story found",
            );
        }
    }

    public function getUserStory()
    {
        $drafArr = array();
        $publishArr = array();
        //query a list from unpublished story of a user
        $query_view_story_unpublished = "SELECT `story_id`, s.title, s.title_html, s.body, s.body_html, s.total_word, s.last_update, s.user_id, s.status FROM stories s  WHERE s.user_id = '$this->user_id' AND s.status = 'off'  ORDER BY s.last_update DESC";
        $res_unpublish = mysqli_query($this->conn, $query_view_story_unpublished);
        $row_unpublish = mysqli_fetch_assoc($res_unpublish);

        //query a list from published story of a user
        $query_view_story_published = "SELECT * FROM `stories` s JOIN `stories_publish` sp ON s.story_id = sp.story_id WHERE `status` = 'on' AND s.user_id = '$this->user_id' ORDER BY s.last_update DESC";
        $res_publish = mysqli_query($this->conn, $query_view_story_published);
        $row_publish = mysqli_fetch_assoc($res_publish);
        if ($row_unpublish > 0) {
            do {
                array_push($drafArr, (object) array(
                    "story_id" => $row_unpublish['story_id'],
                    "title" => $row_unpublish['title'],
                    "title_html" => $row_unpublish['title_html'],
                    "body" => $row_unpublish['body'],
                    "body_html" => $row_unpublish['body_html'],
                    "total_word" => $row_unpublish['total_word'],
                    "last_update" => $row_unpublish['last_update'],
                    "status" => $row_unpublish["status"],
                    "error" => "",
                ));
            } while ($row_unpublish = mysqli_fetch_assoc($res_unpublish));
        }
        if ($row_publish > 0) {
            do {
                array_push(
                    $publishArr,
                    (object) array(
                        "story_id" => $row_publish['story_id'],
                        "title" => $row_publish['title'],
                        "title_html" => $row_publish['title_html'],
                        "body" => $row_publish['body'],
                        "body_html" => $row_publish['body_html'],
                        "total_word" => $row_publish['total_word'],
                        "last_update" => $row_publish['last_update'],
                        "publish_date" => $row_publish["publish_date"],
                        "status" => $row_publish["status"],
                        "error" => "",
                    )
                );
            } while ($row_publish = mysqli_fetch_assoc($res_publish));
        }
        return (object) array("success" => true, "draftStories" => $drafArr, "publishStories" => $publishArr);
    }

    public function generateStoryID($user_id)
    {
        $user_id = 10;
        $dt = new DateTime();
        $time = $dt->format('HisvldFY');
        $result = md5($time . $user_id);
        return $result;
    }

    public function addLink($category_id)
    {
        $query_add = "INSERT INTO `stories_categories` (`category_id`, `story_id`) VALUES('$category_id', '$this->story_id')";
        if (mysqli_query($this->conn, $query_add)) {
            return (object) array(
                "success" => true,
                "error" => "",
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to add link between story and category",
            );
        }
    }

    public function bulkAddLinkCategory($array_category)
    {
        if (count($array_category) > 0) {
            $category_id = "";
            $query_bulk_add = $this->conn->prepare("INSERT INTO `stories_categories` (`category_id`, `story_id`) VALUES(?, '$this->story_id')");
            $query_bulk_add->bind_param("s", $category_id);

            foreach ($array_category as $item) {
                $category_id = $item->category_id;
                $query_bulk_add->execute();
            }
            if (mysqli_error($this->conn) != "") {
                return (object) array(
                    "success" => false,
                    "error" => mysqli_error($this->conn),
                );
            } else {
                return (object) array(
                    "success" => true,
                    "error" => "",
                );
            }
        } else {
            return (object) array(
                "success" => true,
                "error" => "No tag",
            );
        }
    }
}
