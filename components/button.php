<?php

// Renders a reference button
function renderReferenceButton(
    $text,
    $reference,
    $class = "",
    $id = "",
    $img = ""
) {
    $imgHtml = '';
    if ($img) {
        $imgHtml = "<img 
            src='$img' 
            class='btn-icon'
        />";
    }

    // Output using Heredoc syntax
    echo <<<HTML
<a 
    href="$reference" 
    class="$class" 
    id="$id"
>
    $imgHtml
    $text
</a>
HTML;
}


// Renders a submit button
function renderSubmitButton(
    $text,
    $function,
    $class = "",
    $id = "",
    $img = "",
    $type="submit",
    $name="update"
) {
    $imgHtml = '';
    if ($img) {
        $imgHtml = "<img 
            class='btn-icon' 
            src='$img' 
        />";
    }

    // Output using Heredoc syntax
    echo <<<HTML
<button 
    type="$type" 
    function="$function" 
    class="$class" 
    id="$id" 
    name="$name"
>
    $imgHtml
    $text
</button>
HTML;
}


// Renders the upload button
function renderUploadButton($text, $function, $class = "", $id = "", $img = "", $type="button")
{
    $imgHtml = '';
    if ($img) {
        $imgHtml = "<img 
            class='btn-icon' 
            src='$img' 
        />";
    }

    // Output using Heredoc syntax
    echo <<<HTML
<button 
    type="$type" 
    function="$function" 
    class="$class" 
    id="$id"
>
    $imgHtml
    $text
</button>
HTML;
}


// Renders the sort button
function renderSortButton($text, $function, $class = "", $id = "", $type="button")
{
    
    // Output using Heredoc syntax
    echo <<<HTML
<button 
    type="$type" 
    function="$function" 
    class="$class" 
    id="$id"
>
    $text
</button>
HTML;
}
