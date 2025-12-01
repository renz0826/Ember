<?php

// Include necessary dependencies
require_once __DIR__ . '/../includes/head.php';
require_once __DIR__ . '/../components/button.php'; // Provides renderReferenceButton
require_once __DIR__ . '/../components/calendar.php'; // Provides renderCalendar
require_once __DIR__ . '/../components/moment.php'; // Provides renderRecentlySealed

?>

<!DOCTYPE html>
<html lang="en" data-title="Home">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> Home - Ember </title>
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
                    <h2> Upcoming Moments </h2>
                    <?php 
                        // Content for upcoming moments (e.g., list or container)
                        require_once __DIR__ . '/../components/capsule.php'; 
                    ?>
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
                    
                    <?php renderRecentlySealed($conn); ?>
                </section>

            </section>

        </section>

    </main>
</body>

</html>