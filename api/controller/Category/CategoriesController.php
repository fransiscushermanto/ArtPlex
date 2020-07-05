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
                "error" => "Failed to add category",
            );
        }
    }

    public function getTag()
    {
        $categoryArr = array();
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
                        $categoryArr,
                        (object) array(
                            "category_id" => $row['category_id'],
                            "tag" => $row['tag'],
                        )
                    );
                } while ($row = $res->fetch_assoc());
            }
        }
        return $categoryArr;
    }

    public function deleteTag()
    {
        $query_delete = $this->conn->prepare("DELETE FROM `categories` WHERE `category_id` = ?");
        $query_delete->bind_param("s", $this->category_id);
        if ($query_delete->execute()) {
            return (object) array(
                "success" => true,
                "error" => "",
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to delete category.",
            );
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
                "error" => "Failed to update category.",
            );
        }
    }

    public function getAllTag()
    {
        $categoryArr = array();
        $query_search = $this->conn->prepare("SELECT * FROM `categories`");
        $query_search->execute();
        $res = $query_search->get_result();
        $row = $res->fetch_assoc();

        if ($row > 0) {
            do {
                array_push(
                    $categoryArr,
                    (object) array(
                        "category_id" => $row['category_id'],
                        "tag" => $row['tag'],
                    )
                );
            } while ($row = $res->fetch_assoc());
        }

        return (object) array("success" => true, "categories" => $categoryArr);
    }

    public function generateTagID()
    {
        $dt = new DateTime();
        $time = $dt->format('HisvldFY');
        $result = md5($time . $this->tag);
        return $result;
    }
}
