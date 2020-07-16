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
        $query = "SELECT `story_id` FROM `stories` WHERE `story_id` = ? AND `user_id` = ? ";
        if ($status === "public") $query .= " AND `status` = 'on'";
        $query_verify_story_id = $this->conn->prepare($query);
        $query_verify_story_id->bind_param("ss", $this->story_id, $this->user_id);
        $query_verify_story_id->execute();
        $res = $query_verify_story_id->get_result();
        $row = $res->fetch_assoc();
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
                "story_id" => $this->story_id,
                "title" => $this->title,
                "title_html" => $this->title_html,
                "body" => $this->body,
                "body_html" => $this->body_html,
                "total_word" => $this->total_word,
                "last_update" => $current_date,
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to create story - " . mysqli_error($this->conn),
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
                "story_id" => $this->story_id,
                "title" => $this->title,
                "title_html" => $this->title_html,
                "body" => $this->body,
                "body_html" => $this->body_html,
                "total_word" => $this->total_word,
                "last_update" => $current_date,
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to update story - " . mysqli_error($this->conn),

            );
        }
    }

    public function publishStory($preview_image = "", $categories, $status)
    {
        date_default_timezone_set('Asia/Bangkok');
        $date = new DateTime();
        $current_date = $date->format('Y-m-d H:i:s');
        $query_get_user = $this->conn->prepare("SELECT * FROM users WHERE `user_id` = ?;");
        $query_get_user->bind_param("s", $this->user_id);
        $query_get_user->execute();
        $res = $query_get_user->get_result();
        $row = $res->fetch_assoc();
        if ($row['verified'] === 0) {
            return [
                "success" => false,

                "error" => (object) array(
                    "email" => "Email is not registered. Please verify",
                    "message" => null,
                ),
            ];
        }

        if ($row['level'] === "reader") {
            $query_update_user_level = $this->conn->prepare("UPDATE users SET `level`='author',`updated_at`= ? WHERE `user_id` =  ?; ");
            $query_update_user_level->bind_param("ss", $current_date, $this->user_id);

            if (!$query_update_user_level->execute()) {
                return [
                    "success" => false,
                    "error" => (object) array(
                        "email" => null,
                        "message" => "Failed to upgrade user level - " . mysqli_error($this->conn),
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
                    "message" => "Failed to publish story - " . mysqli_error($this->conn),
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
                    "message" => "Failed to insert story publish - " . mysqli_error($this->conn),
                ),
            ];
        }

        $this->deleteStoryCategoryLink();
        return ($this->hasCategory($categories));
    }

    public function unpublishStory()
    {
        date_default_timezone_set('Asia/Bangkok');
        $date = new DateTime();
        $current_date = $date->format('Y-m-d H:i:s');

        $query_publish = $this->conn->prepare("UPDATE stories SET `status` = 'off', `last_update` = '$current_date', `publish_date` = '$current_date' WHERE `story_id` = '$this->story_id';");
        $query_publish->bind_param("sss", $current_date, $current_date, $this->story_id);

        if ($query_publish->execute()) {
            return (object) array(
                "success" => true,
                "error" => "",
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to unpublish story - " . mysqli_error($this->conn),
            );
        }
    }

    public function deleteStory()
    {
        $delete_query = "DELETE FROM `stories_categories` WHERE `story_id` = '$this->story_id';
                         DELETE FROM `stories_publish` WHERE `story_id` = '$this->story_id';
                        DELETE stories_comments, comments 
                        FROM comments JOIN stories_comments ON stories_comments.comment_id = comments.comment_id 
                        WHERE stories_comments.story_id = '$this->story_id';
                        DELETE FROM `stories` WHERE `story_id` = '$this->story_id';";
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
                "error" => "Failed to delete story - " . mysqli_error($this->conn)
            );
        }
    }



    public function countStory()
    {
        $query_count = $this->conn->prepare("SELECT s.story_id FROM stories s JOIN stories_publish sp ON s.story_id = sp.story_id JOIN users u ON s.user_id = u.user_id WHERE s.status = 'on' ");
        $query_count->execute();
        $res = $query_count->get_result();
        return $total_story = $res->num_rows;
    }

    public function getListAllStories($page = 0, $category_id = "", $title = "", $access_time = "", $deleted_number = 0)
    {
        $arr_story = array();
        $limit = 10;
        $offset = ($page * $limit) - $deleted_number;
        $where_state = false;
        if ($access_time !== "") {
            $access_time = $this->parseTime($access_time);
        }
        //get  list story
        $query = "SELECT s.story_id, s.title, s.body, s.total_word, s.last_update, sp.publish_date, s.status, sp.preview_image, u.user_id, u.name, u.username FROM `stories` s LEFT JOIN `stories_publish` sp ON s.story_id = sp.story_id JOIN users u ON s.user_id = u.user_id";

        if ($category_id !== "none" && $category_id !== "") {
            $query .= " LEFT JOIN stories_categories sc ON s.story_id = sc.story_id ";
            $query .= " WHERE sc.category_id = ? ";
            $where_state = true;
        }
        if ($access_time !== "") {
            if ($where_state) $query  .= " AND s.last_update < ?";
            else {
                $query .= " WHERE s.last_update < ?";
                $where_state = true;
            }
        }
        if ($title !== "") {
            $title = '%' . $title . '%';
            if ($where_state) $query .= " AND (s.title LIKE ?) OR (u.name LIKE ?) ";
            else $query .= " WHERE (s.title LIKE ?) OR (u.name LIKE ?) ";
        }

        $query .= " ORDER BY s.last_update DESC LIMIT ? OFFSET ? ;";
        $query_get = $this->conn->prepare($query);
        if ($category_id !== "none" && $category_id !== "" && $title !== "" && $access_time !== "") $query_get->bind_param("ssssii", $category_id, $access_time, $title, $title, $limit, $offset);

        else if ($access_time !== "" && $category_id !== "" && $category_id !== "none") $query_get->bind_param("ssii", $category_id, $access_time, $limit, $offset);

        else if ($access_time !== "" && $title !== "") $query_get->bind_param("sssii", $access_time, $title, $title, $limit, $offset);

        else if ($title !== "" && $category_id !== "" && $category_id !== "none") $query_get->bind_param("sssii", $category_id, $title, $title, $limit, $offset);

        else if ($access_time !== "") $query_get->bind_param("sii", $access_time, $limit, $offset);

        else if ($category_id !== "" && $category_id !== "none")  $query_get->bind_param("sii", $category_id, $limit, $offset);

        else if ($title !== "") $query_get->bind_param("ssii", $title, $title, $limit, $offset);

        else $query_get->bind_param("ii", $limit, $offset);
        $query_get->execute();
        $res = $query_get->get_result();
        $row  = $res->fetch_assoc();
        if ($row > 0) {
            do {
                array_push(
                    $arr_story,
                    (object) array(
                        "story_id" => $row['story_id'],
                        "title" => $row['title'],
                        "body" => $row['body'],
                        "total_word" => $row['total_word'],
                        "last_update" => $row['last_update'],
                        "publish_date" => $row["publish_date"],
                        "status" => $row["status"],
                        "image_preview" => isset($row["preview_image"]) ? $row["preview_image"] : "null",
                        "author" => ["user_id" => $row['user_id'], "name" => $row['name'], "username" => $row['username'],],
                        "categories" => ($row['status'] === "on") ? $this->getPublishedStoryRelatedTag($row['story_id']) : [],
                    )
                );
            } while ($row  = $res->fetch_assoc());
        }
        //sort array

        if (count($arr_story) > 0) {
            return (object) array("success" => true, "stories" => $arr_story, "page" => $page, "limit" => $limit, "offset" => $offset);
        } else {
            return (object) array("success" => false, "stories" => $arr_story, "error" => mysqli_error($this->conn), "page" => $page, "limit" => $limit, "offset" => $offset);
        }
    }



    public function getListUnpublishedStories($page = 0, $title = "", $access_time = "", $deleted_number = 0)
    {
        $arr_unpublish = array();
        $limit = 10;
        $offset = ($page * $limit);
        $access_time = "";
        if ($access_time !== "") {
            $access_time = $this->parseTime($access_time);
        }
        $query = "SELECT s.story_id, s.title, s.body, s.total_word, s.last_update, s.status, u.user_id, u.name, u.username FROM `stories` s  JOIN users u ON s.user_id = u.user_id WHERE s.status = 'off' ";
        if ($access_time !== "") {
            $query  .= " AND s.last_update < ?";
        }
        if ($title !== "") {
            $title = '%' . $title . '%';
            $query .= " AND (s.title LIKE ?) OR (u.name LIKE ?) ";
        }
        $query .= " ORDER BY s.last_update ASC LIMIT ? OFFSET ? ";
        $query_get = $this->conn->prepare($query);
        if ($title !== "" && $access_time !== "") $query_get->bind_param("sssii", $access_time, $title, $title, $limit, $offset);
        else if ($title != "") $query_get->bind_param("ssii", $title, $title, $limit, $offset);
        else $query_get->bind_param("ii", $limit, $offset);
        $query_get->execute();
        $res = $query_get->get_result();
        $row  = $res->fetch_assoc();
        if ($row > 0) {
            do {
                array_push(
                    $arr_unpublish,
                    (object) array(
                        "story_id" => $row['story_id'],
                        "title" => $row['title'],
                        "body" => $row['body'],
                        "total_word" => $row['total_word'],
                        "last_update" => $row['last_update'],
                        "status" => $row["status"],
                        "author" => ["user_id" => $row['user_id'], "name" => $row['name'], "username" => $row['username'],],
                        "categories" => [],
                        "image_preview" => "null",
                    )
                );
            } while ($row  = $res->fetch_assoc());
        }
        return (object) array("success" => (count($arr_unpublish) > 0), "stories" => $arr_unpublish,);
    }


    public function getListPublishedStories($page = 0, $category_id = "", $title = "", $type = "", $access_time = "", $deleted_number = 0)
    {
        $story_title = $title;
        $arr_publish = array();
        $limit = ($type !== "") ? 10 : 20; // admin : homepage
        $offset = ($page * $limit) - $deleted_number;
        if ($access_time !== "") {
            $access_time = $this->parseTime($access_time);
        }
        $query = "SELECT s.story_id, s.title, s.body, s.total_word, s.last_update, sp.publish_date, s.status, sp.preview_image, u.user_id, u.name, u.username FROM `stories` s JOIN `stories_publish` sp ON s.story_id = sp.story_id JOIN users u ON s.user_id = u.user_id";
        if ($category_id !== "none" && $category_id !== "") {
            $query .= " JOIN stories_categories sc ON s.story_id = sc.story_id ";
        }

        $query .= " WHERE s.status = 'on' ";

        if ($category_id !== "none" && $category_id !== "") {
            $query .= " AND sc.category_id = ? ";
        }
        if ($access_time !== "") {
            $query .= " AND s.last_update < ? ";
        }
        if ($title !== "") {
            $title = '%' . $title . '%';
            $query .= " AND s.title LIKE ? OR u.name = ? ";
        }

        $query .= " ORDER BY sp.publish_date ";

        if ($type !== "") $query .= " ASC ";
        else $query .= " DESC ";

        $query .= " LIMIT ? OFFSET ? ";
        $query_get = $this->conn->prepare($query);

        if ($category_id !== "none" && $category_id !== "" && $title !== "" && $access_time !== "") $query_get->bind_param("ssssii", $category_id, $access_time, $title, $title, $limit, $offset);

        else if ($access_time !== "" && $category_id !== "" && $category_id !== "none") $query_get->bind_param("ssii", $category_id, $access_time, $limit, $offset);

        else if ($access_time !== "" && $title !== "") $query_get->bind_param("sssii", $access_time, $title, $title, $limit, $offset);

        else if ($title !== "" && $category_id !== "" && $category_id !== "none") $query_get->bind_param("sssii", $category_id, $title, $title, $limit, $offset);

        else if ($access_time !== "") $query_get->bind_param("sii", $access_time, $limit, $offset);

        else if ($category_id !== "" && $category_id !== "none")  $query_get->bind_param("sii", $category_id, $limit, $offset);

        else if ($title !== "") $query_get->bind_param("ssii", $title, $title, $limit, $offset);

        else $query_get->bind_param("ii", $limit, $offset);

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
                        "image_preview" => isset($row["preview_image"]) ? $row["preview_image"] : "null",
                        "author" => ["user_id" => $row['user_id'], "name" => $row['name'], "username" => $row['username'],],
                        "categories" => $this->getPublishedStoryRelatedTag($row['story_id']),
                    )
                );
            } while ($row  = $res->fetch_assoc());
        }

        return (object) array("success" => (count($arr_publish) > 0), "stories" => $arr_publish,);
    }
    public function getStory()
    {
        $arr_tag = $this->getStoryRelatedTag();
        $query_view_story = $this->conn->prepare("SELECT * FROM stories WHERE story_id = ?");
        $query_view_story->bind_param("s", $this->story_id);
        $query_view_story->execute();
        $res = $query_view_story->get_result();
        $row = $res->fetch_assoc();
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
    public function getPublishedStory($access_time)
    {
        $arr_tag = $this->getStoryRelatedTag();
        $dt = DateTime::createFromFormat("D M d Y H:i:s e+", $access_time);
        $access_time = $dt->format("Y-m-d H:i:s");
        $arr_comment = $this->getStoryRelatedComment(0, "", $access_time);
        $total_comment = $this->getTotalComment();
        $query_view_story = $this->conn->prepare("SELECT u.name, u.username, s.story_id, s.title, s.title_html, s.body, s.body_html, 
        s.total_word, s.last_update, s.status, sp.publish_date FROM stories s JOIN users u ON s.user_id = u.user_id 
        JOIN stories_publish sp ON s.story_id = sp.story_id  WHERE s.story_id = ? ");


        $query_view_story->bind_param("s", $this->story_id);
        $query_view_story->execute();
        $res = $query_view_story->get_result();
        $row = $res->fetch_assoc();
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
                "comments" => $arr_comment,
                "total_comment" => $total_comment,
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
        $query_view_story_unpublished = $this->conn->prepare("SELECT `story_id`, s.title, s.title_html, s.body, s.body_html, s.total_word, s.last_update, s.user_id, s.status FROM stories s  WHERE s.user_id = ? AND s.status = 'off'  ORDER BY s.last_update DESC");
        $query_view_story_unpublished->bind_param("s", $this->user_id);
        $query_view_story_unpublished->execute();
        $res_unpublish = $query_view_story_unpublished->get_result();
        $row_unpublish = $res_unpublish->fetch_assoc();

        //query a list from published story of a user
        $query_view_story_published = $this->conn->prepare("SELECT * FROM `stories` s JOIN `stories_publish` sp ON s.story_id = sp.story_id WHERE `status` = 'on' AND s.user_id = ? ORDER BY s.last_update DESC");
        $query_view_story_published->bind_param("s", $this->user_id);
        $query_view_story_published->execute();
        $res_publish = $query_view_story_published->get_result();
        $row_publish = $res_publish->fetch_assoc();
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
            } while ($row_unpublish = $res_unpublish->fetch_assoc());
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
            } while ($row_publish = $res_publish->fetch_assoc());
        }
        return (object) array("success" => true, "draftStories" => $arr_draft, "publishStories" => $arr_publish);
    }

    public function generateStoryID($user_id)
    {
        date_default_timezone_set('Asia/Bangkok');
        $dt = new DateTime();
        $time = $dt->format('HisvldFY');
        $result = md5($time . $user_id);
        return $result;
    }

    public function addLink($category_id)
    {
        $query_add = $this->conn->prepare("INSERT INTO `stories_categories` (`category_id`, `story_id`) VALUES(?, ?)");
        $query_add->bind_param("ss", $category_id, $this->story_id);
        if ($query_add->execute()) {
            return (object) array(
                "success" => true,
                "error" => "",
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to add link between story and category - " . mysqli_error($this->conn),
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
                        "message" => "Failed to link category to story - " . mysqli_error($this->conn),
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

        $query = "SELECT * FROM `stories_categories` sc JOIN `categories` c ON sc.category_id = c.category_id WHERE sc.story_id = ?";

        $query_get = $this->conn->prepare($query);
        if ($story_id !== "") $query_get->bind_param("s", $story_id);
        else $query_get->bind_param("s", $this->story_id);
        $query_get->execute();
        $res = $query_get->get_result();
        $row = $res->fetch_assoc();
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
        $query = "SELECT * FROM `stories_categories` sc JOIN `categories` c ON sc.category_id = c.category_id WHERE sc.story_id = ?";
        $query_get = $this->conn->prepare($query);
        if ($story_id !== "") $query_get->bind_param("s", $story_id);
        else $query_get->bind_param("s", $this->story_id);
        $query_get->execute();
        $res = $query_get->get_result();
        $row = $res->fetch_assoc();
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
        $query_delete  = $this->conn->prepare("DELETE FROM `stories_categories` WHERE `story_id` = ?");
        $query_delete->bind_param("s", $this->story_id);

        if ($query_delete->execute()) {
            return (object) array(
                "success" => true,
                "error" => "",
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to delete story related categories - " . mysqli_error($this->conn),
            );
        }
    }

    public function getMoreComment($page = 0, $search = "", $access_time, $deleted_number = 0)
    {
        // if ($access_time !== "") {
        try {
            $dt = DateTime::createFromFormat("D M d Y H:i:s e+", $access_time);
            $access_time = $dt->format("Y-m-d H:i:s");
        } catch (Exception $eh) {
            return (object) array("success" => false, "comments" => [], "error" => "Failed to parse time", "page" => $page, "access_time" => $access_time);
        }

        // }

        $arr_comment = $this->getStoryRelatedComment($page, $search, $access_time, $deleted_number);
        if (count($arr_comment) > 0) {
            return (object) array("success" => true, "comments" => $arr_comment, "story_id" => $this->story_id, "keyword" => $search);
        } else {
            return (object) array("success" => false, "comments" => $arr_comment, "error" => mysqli_error($this->conn), "story_id" => $this->story_id, "keyword" => $search);
        }
    }

    public function getStoryRelatedComment($page = 0, $search = "", $access_time = "", $deleted_number = 0)
    {
        $arr_comment = array();
        $limit = 10;
        $offset = ($page * $limit) - $deleted_number;


        if ($this->story_id !== "none") {
            $query = "SELECT c.comment_id, c.body, c.status, c.publish_date, c.last_updated, u.user_id, u.name, u.username 
            FROM stories_comments sc 
            JOIN comments c ON sc.comment_id = c.comment_id 
            JOIN stories s ON sc.story_id = s.story_id 
            JOIN users u ON c.user_id = u.user_id 
            WHERE sc.story_id = ? ";

            if ($access_time !== "") $query .= " AND c.publish_date < ? ";
            if ($search !== "") {
                $search = '%' . $search . '%';
                $query .= " AND u.name LIKE ? OR c.body LIKE ? ";
            }
            $query .= " ORDER BY c.publish_date DESC LIMIT ? OFFSET ?;";
            $query_get = $this->conn->prepare($query);
            if ($search !== "") $query_get->bind_param("ssssii", $this->story_id, $access_time, $search, $search, $limit, $offset);
            else $query_get->bind_param("ssii", $this->story_id, $access_time, $limit, $offset);
            // $query_get->bind_param("sii", $this->story_id, $limit, $offset);
            $query_get->execute();
            $res = $query_get->get_result();
            $row = $res->fetch_assoc();
            if ($row > 0) {
                do {
                    array_push($arr_comment, (object) array(
                        "comment_id" => $row["comment_id"],
                        "comment_body" => $row["body"],
                        "status" => $row["status"],
                        "publish_date" => $row["publish_date"],
                        "last_updated" => $row["last_updated"],
                        "user_id" => $row["user_id"],
                        "comment_name" => $row["name"],
                        "comment_username" => $row["username"],
                        "menu" => (((int) $this->user_id) === $row["user_id"]),
                    ));
                } while ($row = mysqli_fetch_assoc($res));
            }
        }


        return $arr_comment;
    }

    public function getTotalComment()
    {
        $total_Comment = 0;

        $query_get = $this->conn->prepare("SELECT COUNT(*) comment_count FROM comments c JOIN stories_comments sc ON sc.comment_id = c.comment_id JOIN stories s ON sc.story_id = s.story_id JOIN users u ON c.user_id = u.user_id WHERE sc.story_id = ?;");
        $query_get->bind_param("s", $this->story_id);
        $query_get->execute();
        $res = $query_get->get_result();
        $row = $res->fetch_assoc();
        if ($row > 0) {
            $total_comment = (int) $row['comment_count'];
        }
        return $total_comment;
    }

    function parseTime($access_time)
    {
        $dt = DateTime::createFromFormat("D M d Y H:i:s e+", $access_time);
        $access_time = $dt->format("Y-m-d H:i:s");
        return $access_time;
    }
}
