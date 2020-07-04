<?php

class CardsController
{
    protected $conn, $image, $title, $description, $card_id, $status;
    public function __construct($conn, $image = "", $title = "", $description = "", $status = "", $card_id = "")
    {
        $this->conn = $conn;
        $this->image = $image;
        $this->title = $title;
        $this->description = $description;
        $this->card_id = $card_id;
        $this->status = $status;
    }

    public function createCard()
    {
        $query_create = $this->conn->prepare("INSERT INTO cards (`image`, `title`, `description`, `status`) VALUES (?, ?, ?, 'off')");
        $query_create->bind_param("sss", $this->image, $this->title, $this->description);
        if ($query_create->execute()) {
            return (object) array(
                "success" => true,
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to create card",
            );
        }
    }

    public function toggleCard()
    {
        $status = !($this->status);
        $query_toggle = $this->conn->prepare("UPDATE `cards` SET `status` = '$status' WHERE `card_id` = '$this->card_id'");
        if ($query_toggle->execute()) {
            return (object) array(
                "success" => true,
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to toggle card",
            );
        }
    }

    public function editCard()
    {
        $query_edit = $this->conn->prepare("UPDATE `cards` SET `title` = ?, `description` = ?, `image` = ?, `status` = ? WHERE `card_id` = ?");
        $query_edit->bind_param("sssss", $this->title, $this->description, $this->image, $this->status, $this->card_id);
        if ($query_edit->execute()) {
            return (object) array(
                "success" => true,
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Failed to edit card",
            );
        }
    }

    public function getAllCard($status = "")
    {
        $arr_card = array();
        $query = "SELECT * FROM `cards` ";
        if ($status === "active") $query .= " WHERE `status` = `on` ";
        $query_get = $this->conn->prepare("SELECT * FROM `cards` ");
        $query_get->execute();
        $res = $query_get->get_result();
        $row = $res->fetch_assoc();
        if ($row > 0) {
            do {
                array_push($arrCard, (object) array(
                    "card_id" => $row['card_id'],
                    "card_title" => $row['title'],
                    "card_description" => $row['description'],
                    "status" => $row['status'],
                    "image" => $row['image'],
                ));
            } while ($row = $res->fetch_assoc());
        }

        return (object) array("success" => true, "cards" => $arr_card);
    }

    function getCard()
    {
        $query_get = $this->conn->prepare("SELECT * FROM `cards` WHERE `card_id` = ?");
        $query_get->bind_param("s", $this->card_id);
        $query_get->execute();
        $res = $query_get->result_get();
        $row = $res->fetch_assoc();
        if ($row > 0) {
            return (object) array(
                "success" => true,
                "card_id" => $row['card_id'],
                "card_title" => $row['title'],
                "card_description" => $row['description'],
                "status" => $row['status'],
                "image" => $row['image'],
            );
        } else {
            return (object) array(
                "success" => false,
                "error" => "Card doesn't exist",
            );
        }
    }

    public function deleteCard()
    {
        $query_delete = $this->conn->prepare("DELETE FROM `cards` WHERE `card_id` = ?");
        $query_delete->bind_param("s", $this->card_id);
        if ($query_delete->execute()) {
            return (object) array(
                "success" => true,
            );
        } else {
            return (object) array(
                "success" => false,
            );
        }
    }
}
