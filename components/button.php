<?php

function renderButton($class = " ", $id = "", $img = "", $text, $function, $type) {
    echo "<a href=\"$function\" > <button type=\"$type\" id=\"$id\" class=\"$class\, type=\"$type\"> <img src=\"$img\"> $text </button></a>";
}
?>
