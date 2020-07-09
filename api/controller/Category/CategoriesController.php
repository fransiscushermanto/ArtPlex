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

    public function addTag()
    {
        $this->category_id = $this->generateTagID();
        $query_add = $this->conn->prepare("INSERT INTO `categories` (`category_id`, `tag`) VALUES(?, ?)");
        $query_add->bind_param("s", $this->category_id, $this->tag);
        if ($query_add->execute()) {
            return (object) array(
                "success" => true,
                "category" => (object) array(
                    "category_id" => $this->category_id,
                    "tag" => $this->tag,
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
        $arr_Category = array();
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
                        $arr_Category,
                        (object) array(
                            "category_id" => $row['category_id'],
                            "tag" => $row['tag'],
                        )
                    );
                } while ($row = $res->fetch_assoc());
            }
        }
        return $arr_Category;
    }

    public function deleteTag()
    {
        $query_check_story = $this->conn->prepare("SELECT * `stories_categories` WHERE  `category_id` = ?");
        $query_check_story->bind_param("s", $this->category_id);
        $query_check_story->execute();
        $res_story = $query_check_story->get_result();
        $story_error = ($res_story->fetcth_assoc() > 0) ? true : false;
        if ($story_error) {
            return ["success" => false, "error" => "There's story related to this user"];
        } else {
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
    }

    public function editTag()
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

    public function getAllTag($page = 0, $tag = "")
    {
        $arr_Category = array();
        $limit = 20;
        $offset = ($page * $limit);
        $query = "SELECT * FROM `categories` ";
        if ($tag !== "") {
            $tag = '%' . $tag . '%';
            $query .= "  WHERE `tag` LIKE ? ";
        }
        $query .= " LIMIT ? OFFSET ?";
        $query_search = $this->conn->prepare($query);
        if ($tag !== "") $query_search->bind_param("sii", $this->$tag, $limit, $offset);
        $query_search->bind_param("ii", $limit, $offset);
        $query_search->execute();
        $res = $query_search->get_result();
        $row = $res->fetch_assoc();

        if ($row > 0) {
            do {
                array_push(
                    $arr_Category,
                    (object) array(
                        "category_id" => $row['category_id'],
                        "tag" => $row['tag'],
                    )
                );
            } while ($row = $res->fetch_assoc());
        }
        if (count($arr_Category) > 0) return (object) array("success" => true, "categories" => $arr_Category);
        else return (object) array("success" => false, "categories" => $arr_Category);
    }

    public function generateTagID()
    {
        $dt = new DateTime();
        $time = $dt->format('HisvldFY');
        $result = md5($time . $this->tag);
        return $result;
    }
}
