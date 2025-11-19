<?php

// includes the head
require_once __DIR__ . '/../includes/head.php';

// includes the button component
require_once __DIR__ . '/../components/button.php';

// includes the capsule component
require_once __DIR__ . '/../components/capsule.php';

// include the calendar component
require_once __DIR__ . '/../components/calendar.php';

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> Home - Ember </title>
</head>

<body>
    <main>
        <div class="left">
            <?php require_once __DIR__ . '/../components/nav.php';?>

        </div>
        <div class="right">
            <div class="top">
                <div class="top">
                    <?php require_once __DIR__ . '/../components/header.php'; ?>
                </div>
                <div class="edit_bottom">
                    <div class="edit_bottom_left">
                        <?php renderCalendar(); ?>
                    </div>

                    <div class="bottom_right">
                        <?php renderSubmitButton('Update Seal Time', '', 'button', '', '/Ember/assets/icons/icon-lock.svg'); ?>
                        <?php renderLinkButton('Cancel', 'my_moments.php', 'button_no_fill', '', '/Ember/assets/icons/icon-cancel.svg'); ?>
                    </div>

                </div>
            </div>

    </main>
</body>

</html>