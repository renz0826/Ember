<?php

// Include necessary dependencies
require_once __DIR__ . '/../includes/head.php';
require_once __DIR__ . '/../components/button.php';   // Provides button render functions
require_once __DIR__ . '/../components/calendar.php'; // Provides renderCalendar
require_once __DIR__ . '/../components/moment.php';   // Provides renderAllMoments and renderRecentlySealed

?>

<!DOCTYPE html>
<html lang="en" data-title="My Moments">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Moments - Ember</title>
</head>

<body>
    <section class="left">
        <?php 
            // Include main site navigation component
            require_once __DIR__ . '/../components/nav.php';
        ?>
    </section>
    
    <main>
        <section class="right">
            
            <section class="top">
                <?php 
                    // Include page header component
                    require_once __DIR__ . '/../components/header.php'; 
                ?>
            </section>
            
            <section class="bottom">

                <section class="bottom_left">
                    <div class="moment_top">
                        <h3> Soon to Unseal</h3>
                        <div class="actions">

                            <!-- Renders sort buttons -->
                            <?= renderSortButton('Sealed', 'javascript:void(0)', 'button_small', 'filter-sealed'); ?>
                            <?= renderSortButton('Unsealed', 'javascript:void(0)', 'button_no_fill_small', 'filter-unsealed'); ?>
                        </div>
                    </div>

                    <!-- Connects to the database and render moment cards -->
                    <?= renderAllMoments($conn) ?>
                </section>

                <section class="bottom_right">
                    <?php renderCalendar(); ?>
                    
                    <?php 
                        renderReferenceButton(
                            'Preserve a Moment', 
                            'preserve_moment.php', 
                            'button', 
                            '', 
                            '/Ember/assets/icons/icon-preserve-white.svg'
                        ); 
                    ?>
                    
                    <!-- Connects to the database and render recently sealed moment cards -->
                    <?php renderRecentlySealed($conn); ?>
                </section>

            </section>
        </section>
    </main>
</body>

</html>