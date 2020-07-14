<?php

class CategoriesController
{
    protected $conn, $category_id, $tag;
    public function __construct($conn, $tag = "", $category_id = "")
    {
        $this->conn = $conn;
        $this->category_id = $category_id;
        $this->tag = $tag;
    }

    public function createTag()
    {
        $this->category_id = $this->generateTagID();
        $query_add = $this->conn->prepare("INSERT INTO `categories` (`category_id`, `tag`) VALUES(?, ?)");
        $query_add->bind_param("ss", $this->category_id, $this->tag);
        if ($query_add->execute()) {
            return (object) array(
                "success" => true,
                "categories" => (object) array(
                    "category_id" => $this->category_id,
                    "tag" => $this->tag,
                    "total_used_story" => 0,
                    "edit" => false,
                    "delete" => false,
                    "total_story" =>  $this->countStory(),
                ),
                "error" => "",
            );
        } else {
            return (object) array(
                "success" => true,
                "error" => "Failed to add category - " . mysqli_error($this->conn),
            );
        }
    }

    public function getTag()
    {
        $arr_category = array();
        if ($this->tag !== "") {
            $search_name = '%' . $this->tag . '%';
            $query_search = $this->conn->prepare("SELECT * FROM `categories` WHERE `tag` LIKE ?");
            $query_search->bind_param("s", $search_name);
            $query_search->execute();
            $res = $query_search->get_result();
            $row = $res->fetch_assoc();

            if ($row > 0) {
                do {
                    array_push(
                        $arr_category,
                        (object) array(
                            "category_id" => $row['category_id'],
                            "tag" => $row['tag'],
                        )
                    );
                } while ($row = $res->fetch_assoc());
            }
        }
        return $arr_category;
    }

    public function deleteTag()
    {
        $query_delete = $this->conn->prepare("DELETE FROM `categories` WHERE `category_id` = ?");
        $query_delete->bind_param("s", $this->category_id);
        if ($query_delete->execute()) {
            return [
                "success" => true,
                "error" => "",
            ];
        } else {
            return [
                "success" => false,
                "error" => "Failed to delete category - " . mysqli_error($this->conn),
            ];
        }
    }

    public function updateTag()
    {
        $query_edit = $this->conn->prepare("UPDATE `categories` SET `tag` = ? WHERE `category_id` = ?");
        $query_edit->bind_param("ss", $this->tag, $this->category_id);
        if ($query_edit->execute()) {
            return (object) array(
                "success" => true,
                "error" => "",
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to update category - " . mysqli_error($this->conn),
            );
        }
    }

    public function getAllTag($page = 0, $deleted_number = 0)
    {
        $arr_category = array();
        $limit = 20;
        $offset = ($page * $limit) - $deleted_number;
        $query = "SELECT * FROM `categories` ";
        $tag = $this->tag;

        if ($tag !== "") {
            $tag = '%' . $tag . '%';
            $query .= "  WHERE `tag` LIKE ? ";
        }


        $query_search = $this->conn->prepare($query);
        if ($tag !== "") $query_search->bind_param("sii", $tag);
        $query_search->execute();
        $res = $query_search->get_result();
        $row = $res->fetch_assoc();

        if ($row > 0) {
            do {
                array_push(
                    $arr_category,
                    (object) array(
                        "category_id" => $row['category_id'],
                        "tag" => $row['tag'],
                    )
                );
            } while ($row = $res->fetch_assoc());
        }
        return (object) array("success" => (count($arr_category) > 0), "categories" => $arr_category);
    }

    public function getListTag($page = 0, $deleted_number = 0, $arr_reject)
    {
        $arr_category = array();
        $limit = 12;
        $offset = ($page * $limit) - $deleted_number;
        $tag = $this->tag;
        $whereState = false;
        $query = "SELECT * FROM `categories` ";
        if ($tag !== "") {
            $tag = '%' . $tag . '%';
            $query .= "  WHERE `tag` LIKE ? ";
            $whereState = true;
        }
        if (count($arr_reject) > 0) {

            foreach ($arr_reject as $key) {
                if (!$whereState) {
                    $query .= " WHERE ";
                    $query .= " category_id <> '$key' ";
                    $whereState = true;
                } else {
                    $query .= " AND ";
                    $query .= " category_id <> '$key' ";
                }
            }
        }
        $query .= " LIMIT ? OFFSET ? ";
        $query_search = $this->conn->prepare($query);
        if ($tag !== "") $query_search->bind_param("sii", $tag, $limit, $offset);
        else $query_search->bind_param("ii", $limit, $offset);
        $query_search->execute();
        $res = $query_search->get_result();
        $row = $res->fetch_assoc();
        $total_story = $this->countStory();
        if ($row > 0) {
            do {
                array_push(
                    $arr_category,
                    (object) array(
                        "category_id" => $row['category_id'],
                        "tag" => $row['tag'],
                        "total_used_story" => $this->getUsedCount($row['category_id']),
                        "edit" => false,
                        "delete" => false,
                        "total_story" => $total_story,
                    )
                );
            } while ($row = $res->fetch_assoc());
        }

        return (object) array("success" => (count($arr_category) > 0), "categories" => $arr_category, "limit" => $limit, "offset" => $offset, "page" => $page,);
    }

    public function generateTagID()
    {
        $dt = new DateTime();
        $time = $dt->format('HisvldFY');
        $result = md5($time . $this->tag);
        return $result;
    }

    public function getUsedBy($page = 0, $keyword = "")
    {
        $arr_story = array();
        $limit = 10;
        $offset = ($page * $limit);
        $query = "SELECT u.username, u.user_id, u.name, s.story_id, s.title, sp.publish_date FROM categories c 
        JOIN stories s ON c.story_id = s.story_id 
        JOIN users u ON s.user_id = u.user_id 
        JOIN stories_published sp ON s.story_id = sp.story_id
        WHERE c.category_id = ? ";
        if ($keyword !== "") $query .= "AND s.title LIKE ?";
        $query .=  "LIMIT ? OFFSET ?";

        $query_get = $this->conn->prepare($query);
        if ($keyword !== "") $query_get->bind_param("ssii", $this->category_id, $keyword, $limit, $offset);
        else $query_get->bind_param("sii", $this->category_id, $limit, $offset);
        $query_get->execute();
        $res = $query_get->get_result();
        $row = $res->fetch_assoc();

        if ($row > 0) {
            array_push($arr_story, (object)array(
                "user_id" => $row['user_id'],
                "name" => $row['name'],
                "username" => $row['username'],
                "story_id" => $row['story_id'],
                "title" => $row['title'],
                "publish_date" => $row['publish_date'],
            ));
        }

        return ["success" => (count($arr_story) > 0), "stories" => $arr_story];
    }

    public function getUsedCount($category_id)
    {
        $count = 0;
        $query = "SELECT COUNT(*) category_count FROM categories c 
        JOIN stories_categories sc ON c.category_id = sc.category_id 
        WHERE c.category_id = ? ";
        $query_get = $this->conn->prepare($query);
        $query_get->bind_param("s", $category_id);
        $query_get->execute();
        $res = $query_get->get_result();
        $row = $res->fetch_assoc();
        if ($row > 0) {
            $count = $row['category_count'];
        }
        return $count;
    }

    function parseTime($access_time)
    {
        $dt = DateTime::createFromFormat("D M d Y H:i:s e+", $access_time);
        $access_time = $dt->format("Y-m-d H:i:s");
        return $access_time;
    }

    public function countStory()
    {
        $query_count = $this->conn->prepare("SELECT s.story_id FROM stories s JOIN stories_publish sp ON s.story_id = sp.story_id JOIN users u ON s.user_id = u.user_id WHERE s.status = 'on' ");
        $query_count->execute();
        $res = $query_count->get_result();
        return $total_story = $res->num_rows;
    }
}
