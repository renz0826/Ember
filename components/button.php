<?php

function renderButton($class = " ", $id = "", $img = "", $text, $function, $type ="button") {
    echo "<a href=\"$function\" > <button type=\"$type\" id=\"$id\" class=\"$class\"> <img src=\"$img\"> $text </button></a>";
}
?>
