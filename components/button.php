<?php

function renderLinkButton($text, $function, $class = "", $id = "", $img = "")
{
    echo "
        <a href=\"$function\" class=\"$class\" id=\"$id\">
            " . (!empty($img) ? "<img width=\"32px\" height=\"32px\" src=\"$img\" alt=\"\">" : "") . "
            $text
        </a>
    ";
}

function renderSubmitButton($text, $function, $class = "", $id = "", $img = "", $type="submit")
{
    echo "
        <button type=\"$type\" function=\"$function\" class=\"$class\" id=\"$id\">
            " . (!empty($img) ? "<img width=\"32px\" height=\"32px\" src=\"$img\" alt=\"\">" : "") . "
            $text
        </button>
    ";
}

function renderUploadButton($text, $function, $class = "", $id = "", $img = "", $type="button")
{
    echo "
        <button type=\"$type\" function=\"$function\" class=\"$class\" id=\"$id\">
            " . (!empty($img) ? "<img width=\"32px\" height=\"32px\" src=\"$img\" alt=\"\">" : "") . "
            $text
        </button>
    ";
}

function renderSortButton($text, $function, $class = "", $id = "", $type="button")
{
    echo "
        <button type=\"$type\" function=\"$function\" class=\"$class\" id=\"$id\">
            $text
        </button>
    ";
}
