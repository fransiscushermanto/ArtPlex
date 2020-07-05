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
        date_default_timezone_set('Asia/Bangkok');
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
        date_default_timezone_set('Asia/Bangkok');
        $date = new DateTime();
        $current_date = $date->format('Y-m-d H:i:s');

        $query_continue = $this->conn->prepare("UPDATE stories SET `title` = ?, `title_html` = ?, `body` = ?, `body_html` = ?, `total_word` = ?, `last_update` = ?  WHERE `story_id` = ? AND `user_id` = ?;");
        $query_continue->bind_param("ssssssss", $this->title, $this->title_html, $this->body, $this->body_html, $this->total_word, $current_date, $this->story_id, $this->user_id);


        if ($query_continue->execute()) {
            return (object) array(
                "success" => true,
                "error" => null,
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to update story",
            );
        }
    }

    public function publishStory($preview_image = "", $categories, $status)
    {
        date_default_timezone_set('Asia/Bangkok');
        $date = new DateTime();
        $current_date = $date->format('Y-m-d H:i:s');
        $query_get_user = mysqli_query($this->conn, "SELECT * FROM users WHERE `user_id` = '$this->user_id';");
        $row = mysqli_fetch_assoc($query_get_user);
        if ($row['status'] === "off") {
            return [
                "success" => false,

                "error" => (object) array(
                    "email" => "Email is not registered. Please verify",
                    "message" => null,
                ),
            ];
        }

        if ($row['level'] === "reader") {
            $query_update_user_level = "UPDATE users SET `level`='author',`updated_at`='$current_date' WHERE `user_id` = '$this->user_id'; ";
            if (!mysqli_query($this->conn, $query_update_user_level)) {
                return [
                    "success" => false,
                    "error" => (object) array(
                        "email" => null,
                        "message" => "Failed to upgrade user level",
                    ),
                ];
            }
        }

        $query_publish = $this->conn->prepare("UPDATE `stories` SET `status` = 'on',  `last_update` = ?, `title` = ?, `body` = ? WHERE `story_id` = ? ;");
        $query_publish->bind_param("ssss", $current_date, $this->title, $this->body, $this->story_id);

        if (!($query_publish->execute())) {
            return [
                "success" => false,
                "error" => (object) array(
                    "email" => null,
                    "message" => "Failed to publish story",
                ),
            ];
        }

        $query_add_stories_publish = "";
        if ($status === "on") {
            $query_add_stories_publish = $this->conn->prepare("UPDATE `stories_publish` SET `preview_image` = ?, `publish_date` = ?  WHERE story_id = ? ");
            $query_add_stories_publish->bind_param("sss", $preview_image, $current_date, $this->story_id);
        } else if ($status === "off") {
            $query_add_stories_publish = $this->conn->prepare("INSERT INTO `stories_publish` (`story_id`, `preview_image`, `publish_date`) VALUES (?,?,?)");
            $query_add_stories_publish->bind_param("sss", $this->story_id, $preview_image, $current_date);
        }


        if (!$query_add_stories_publish->execute()) {
            return [
                "success" => false,
                "error" => (object) array(
                    "email" => null,
                    "message" => "Failed to insert story publish",
                ),
            ];
        }

        $this->deleteStoryCategoryLink();
        return ($this->hasCategory($categories));
    }

    public function unpublishStory()
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

    public function deleteStory()
    {
        $delete_query = "DELETE FROM `stories_categories` WHERE `story_id` = '$this->story_id';
                         DELETE FROM `stories_publish` WHERE `story_id` = '$this->story_id';
                        DELETE FROM `stories` WHERE `story_id` = '$this->story_id';
                        DELETE FROM `comments` WHERE `story_id` = '$this->story_id';
                        DELETE FROM `stories_comments` WHERE `story_id` = '$this->story_id'";
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

    public function countStory()
    {
        $query_count = "SELECT s.story_id FROM stories s JOIN stories_publish sp ON s.story_id = sp.story_id JOIN users u ON s.user_id = u.user_id WHERE s.status = 'on' ";
        $res = mysqli_query($this->conn, $query_count);
        return $total_story = mysqli_num_rows($res);
    }

    public function getListStory($page = 0, $category_id = "", $title = "")
    {
        $arr_story = $this->getAllPublishedStories($page, $category_id, $title);
        if (count($arr_story) > 0) {
            return (object) array("success" => true, "stories" => $arr_story, "page" => $page, "category_id" => $category_id, "title" => $title);
        } else {
            return (object) array("success" => false, "stories" => $arr_story, "error" => mysqli_error($this->conn), "page" => $page, "category_id" => $category_id, "title" => $title);
        }
    }


    public function getAllPublishedStories($page = 0, $category_id = "", $title = "")
    {
        $story_title = $title;
        $arr_publish = array();
        $limit = 20;
        $offset = ($page * $limit);
        $total_story = $this->countStory();
        $max_page = ceil($total_story / $limit);

        if ($page <= $max_page) {
            $query = "SELECT s.story_id, s.title, s.body, s.total_word, s.last_update, sp.publish_date, s.status, sp.preview_image, u.user_id, u.name, u.username FROM `stories` s JOIN `stories_publish` sp ON s.story_id = sp.story_id JOIN users u ON s.user_id = u.user_id";
            if ($category_id !== "none" && $category_id !== "") $query .= " JOIN stories_categories sc ON s.story_id = sc.story_id ";
            $query .= " WHERE s.status = 'on' ";
            if ($category_id !== "none" && $category_id !== "")  $query .= " AND sc.category_id = '$category_id' ";
            if ($story_title !== "") {
                $story_title = '%' . $story_title . '%';
                $query .= " AND s.title LIKE ?";
            }
            $query .= " ORDER BY sp.publish_date DESC LIMIT $limit OFFSET $offset";
            $query_get = $this->conn->prepare($query);
            if ($title != "") $query_get->bind_param("s", $story_title);
            $query_get->execute();
            $res = $query_get->get_result();
            $row  = $res->fetch_assoc();
            if ($row > 0) {
                do {
                    array_push(
                        $arr_publish,
                        (object) array(
                            "story_id" => $row['story_id'],
                            "title" => $row['title'],
                            "body" => $row['body'],
                            "total_word" => $row['total_word'],
                            "last_update" => $row['last_update'],
                            "publish_date" => $row["publish_date"],
                            "status" => $row["status"],
                            "image_preview" => $row["preview_image"],
                            "author" => ["user_id" => $row['user_id'], "name" => $row['name'], "username" => $row['username'],],
                            "error" => "",
                            "categories" => $this->getPublishedStoryRelatedTag($row['story_id']),
                        )
                    );
                } while ($row  = $res->fetch_assoc());
            }
        }

        return $arr_publish;
    }
    public function getStory()
    {
        $arr_tag = $this->getStoryRelatedTag();
        $query_view_story = "SELECT * FROM stories WHERE story_id = '$this->story_id'";
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
                "categories" => $arr_tag,
                "error" => "",
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "No story found",
            );
        }
    }
    public function getPublishedStory()
    {
        $query_view_story = "SELECT u.name, u.username, s.story_id, s.title, s.title_html, s.body, s.body_html, 
        s.total_word, s.last_update, s.status, sp.publish_date FROM stories s JOIN users u ON s.user_id = u.user_id 
        JOIN stories_publish sp ON s.story_id = sp.story_id JOIN stories_categories sc ON s.story_id = sc.story_id WHERE s.story_id = '$this->story_id' ";
        $arr_tag = $this->getStoryRelatedTag();
        $arr_Comment = $this->getStoryRelatedComment();
        // if ($type === "public") $query_view_story .= " AND s.status = 'on'";
        // else if ($type === "edit")  $query_view_story .= " AND s.status = 'off'";
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
                "publish_date" => $row["publish_date"],
                "status" => $row["status"],
                "author" => ["name" => $row['name'], "username" => $row['username'],],
                "categories" => $arr_tag,
                "comments" => $arr_Comment,
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
        $arr_draft = array();
        $arr_publish = array();
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
                array_push($arr_draft, (object) array(
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
                    $arr_publish,
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
        return (object) array("success" => true, "draftStories" => $arr_draft, "publishStories" => $arr_publish);
    }

    public function generateStoryID($user_id)
    {

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

    public function hasCategory($array_category)
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
                return [
                    "success" => false,
                    "error" => (object) array(
                        "email" => null,
                        "message" => "Failed to link category to story",
                    ),
                ];
            } else {
                return [
                    "success" => true,
                    "error" => null,
                ];
            }
        } else {
            return [
                "success" => true,
                "error" => null,
            ];
        }
    }
    public function getPublishedStoryRelatedTag($story_id = "")
    {
        $arr_tag = array();
        $query_get = "";
        if ($story_id !== "") {
            $query_get = "SELECT * FROM `stories_categories` sc JOIN `categories` c ON sc.category_id = c.category_id WHERE sc.story_id = '$story_id'";
        } else {
            $query_get = "SELECT * FROM `stories_categories` sc JOIN `categories` c ON sc.category_id = c.category_id WHERE sc.story_id = '$this->story_id'";
        }
        $res = mysqli_query($this->conn, $query_get);
        $row = mysqli_fetch_assoc($res);
        if ($row > 0) {
            do {
                array_push($arr_tag, $row["tag"]);
            } while ($row = mysqli_fetch_assoc($res));
        }

        return $arr_tag;
    }

    public function getStoryRelatedTag($story_id = "")
    {
        $arr_tag = array();
        $query_get = "";
        if ($story_id !== "") {
            $query_get = "SELECT * FROM `stories_categories` sc JOIN `categories` c ON sc.category_id = c.category_id WHERE sc.story_id = '$story_id'";
        } else {
            $query_get = "SELECT * FROM `stories_categories` sc JOIN `categories` c ON sc.category_id = c.category_id WHERE sc.story_id = '$this->story_id'";
        }
        $res = mysqli_query($this->conn, $query_get);
        $row = mysqli_fetch_assoc($res);
        if ($row > 0) {
            do {
                array_push($arr_tag, (object) array(
                    "category_id" => $row["category_id"],
                    "tag" => $row["tag"],
                ));
            } while ($row = mysqli_fetch_assoc($res));
        }

        return $arr_tag;
    }

    public function deleteStoryCategoryLink()
    {
        $query_delete  = "DELETE FROM `stories_categories` WHERE `story_id` = '$this->story_id'";
        if (mysqli_query($this->conn, $query_delete)) {
            return (object) array(
                "success" => true,
                "error" => "",
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to delete story related categories",
            );
        }
    }

    public function getMoreComment($page = 0)
    {
        $arr_Comment = $this->getStoryRelatedComment($page);
        if (count($arr_Comment) > 0) {
            return (object) array("success" => true, "comments" => $arr_Comment);
        } else {
            return (object) array("success" => false, "comments" => $arr_Comment);
        }
    }

    public function getStoryRelatedComment($page = 0)
    {
        $arr_Comment = array();
        $limit = 10;
        $offset = ($page * 10);
        $total_comment = $this->countStoryRelatedComment();
        $max_page = ceil($total_comment / $limit);

        if ($page <= $max_page) {
            $query_get = "SELECT c.comment_id, c.body, c.status, c.publish_date, c.last_updated, u.user_id, u.name, u.username FROM stories_comments sc JOIN comments c ON sc.comment_id = c.comment_id JOIN stories s ON sc.story_id = s.story_id JOIN users u ON c.user_id = u.user_id WHERE sc.story_id = '$this->story_id' ORDER BY c.publish_date DESC LIMIT $limit OFFSET $offset;";
            $res = mysqli_query($this->conn, $query_get);
            $row = mysqli_fetch_assoc($res);
            if ($row > 0) {
                do {
                    array_push($arr_Comment, (object) array(
                        "comment_id" => $row["comment_id"],
                        "comment_body" => $row["body"],
                        "status" => $row["status"],
                        "publish_date" => $row["publish_date"],
                        "last_updated" => $row["last_updated"],
                        "user_id" => $row["user_id"],
                        "comment_name" => $row["name"],
                        "comment_username" => $row["username"],
                    ));
                } while ($row = mysqli_fetch_assoc($res));
            }
        }

        return $arr_Comment;
    }

    public function countStoryRelatedComment()
    {
        $query_check = "SELECT c.comment_id FROM stories_comments sc JOIN comments c ON sc.comment_id = c.comment_id JOIN stories s ON sc.story_id = s.story_id JOIN users u ON c.user_id = u.user_id WHERE sc.story_id = '$this->story_id'";
        $res = mysqli_query($this->conn, $query_check);
        return $total_comment = mysqli_num_rows($res);
    }
}
