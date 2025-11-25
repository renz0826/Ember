<?php

// includes the head
require_once __DIR__ . '/../includes/head.php';

// includes button component
require_once __DIR__ .'/../components/button.php';

// includes moment component
require_once __DIR__ .'/../components/moment.php';

// include the calendar component
require_once __DIR__ . '/../components/calendar.php';

// include the moment component
require_once __DIR__ . '/../components/moment.php';



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
                    <div class="moment_top">
                        <h3> Soon to Unseal</h3>
                        <div class="actions">
                            <?=  renderSortButton('Sealed', '', 'button_small', 'sealed-button'); ?>
                            <?=  renderSortButton('Unsealed', '', 'button_no_fill_small', 'unsealed-button)'); ?>
                        </div>
                    </div>
                    <?= renderAllMoments($conn) ?>
                </div>
                <div class="bottom_right">
                    <?php renderCalendar(); ?>
                    <?php renderLinkButton('Preserve a Moment', 'preserve_moment.php', 'button', '', '/Ember/assets/icons/icon-preserve-white.svg'); ?>
                    <?php renderRecentlySealed($conn); ?>
                </div>

            </div>
        </div>

    </main>
</body>

</html>