<?php
if (isset($_FILES["file"])) {
    $nama_file = $_FILES["file"]["name"];
    $user_id = (isset($_POST["user_id"])) ? $_POST["user_id"] : null;
    $file_name = (isset($_POST["file_name"])) ? $_POST["file_name"] : null;
    // $dt = new DateTime();
    // $time = $dt->format('H-i-s-v-d-m-Y');
    $final_name = md5($file_name) . "." . explode(".", $_FILES['file']['name'])[1];
    move_uploaded_file($_FILES["file"]["tmp_name"], "../../app/assets/temp-img/" . $final_name);
    //unset($_FILES["file"]["name"]);
    echo $final_name;
}
