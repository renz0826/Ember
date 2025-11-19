<?php

// includes the head
require_once __DIR__ . '/../includes/head.php';

// includes the button component
require_once __DIR__ . '/../components/button.php';

// include the calendar component
require_once __DIR__ . '/../components/calendar.php';

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preserve a Moment - Ember</title>
</head>

<body>
    <main>
        <div class="left">
            <?php require_once __DIR__ . '/../components/nav.php';?>

        </div>
        <div class="right">
            <div class="top">
                <?php require_once __DIR__ . '/../components/header.php'; ?>
            </div>
            <div class="bottom">
                <div class="bottom_left">
                    <form class="preserve_moment" action="" method="POST" enctype="multipart/form-data">
                        <div class="input_group">
                            <label for="moment_title"> Name this Moment </label>
                            <input type="text" id="moment_title" name="moment_title" placeholder="Name this moment..."
                                required>
                        </div>
                        <div class="input_group">
                            <label for="moment_desription"> Frame the Feeling </label>
                            <input type="file" id="moment_media" name="moment_media" accept="image/*">
                            <div class="media_preview">
                                <canvas id="canvas" width="300px" height="300px" style="border-radius: 10px;"></canvas>
                                <span id="file_status">No file chosen.</span>
                            </div>

                            <?php renderUploadButton('Add Media', '', 'button_no_fill', 'upload_media', '/Ember/assets/icons/icon-media.svg'); ?>
                        </div>
                        <div class="input_group">
                            <label for="moment_description"> Tell the Story </label>
                            <textarea id="moment_description" name="moment_description" placeholder="Tell the story..."
                                required></textarea>
                        </div>

                    </form>
                </div>
                <div class="bottom_right">
                    <?php renderCalendar(); ?>
                    <?php renderSubmitButton('Seal Moment', '', 'button', 'seal_moment', '/Ember/assets/icons/icon-lock.svg'); ?>
                    <?php renderLinkButton('Cancel', 'home.php', 'button_no_fill', 'cancel', '/Ember/assets/icons/icon-cancel.svg'); ?>
                </div>

            </div>
        </div>

    </main>
</body>

</html>