<?php

// includes the head
require_once __DIR__ . '/../includes/head.php';

// includes button component
require_once __DIR__ .'/../components/button.php';

// includes moment component
require_once __DIR__ .'/../components/moment.php';

// include the calendar component
require_once __DIR__ . '/../components/calendar.php';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Moments - Ember</title>
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
                    <h3> Soon to Unseal</h3>
                    <?php renderMoment('1', '2', '3', 'Sealed'); ?>
                </div>
                <div class="bottom_right">
                    <?php renderCalendar(); ?>
                    <?php renderLinkButton('Preserve a Moment', 'preserve_moment.php', 'button', '', '/Ember/assets/icons/icon-preserve-white.svg'); ?>
                </div>

            </div>
        </div>

    </main>
</body>

</html>