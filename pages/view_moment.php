<?php

// Include necessary dependencies
require_once __DIR__ . '/../includes/head.php';
require_once __DIR__ . '/../components/button.php';   // Provides button render functions
require_once __DIR__ . '/../components/calendar.php'; // Provides renderCalendar

// Initialize variables
$row = null;
$moment_id = 0;

// Handle GET REQUEST
if (isset($_GET['id'])) {
    $moment_id = (int) $_GET['id'];
    
    // Select all necessary fields for display
    $sql = "SELECT id, title, description, image_url, seal, open FROM moments WHERE id = ?";
    
    // Use prepared statement for security
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param('i', $moment_id);

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            if ($result->num_rows === 1) {
                $row = $result->fetch_assoc();
            }
        }
        $stmt->close();
    }
}

// Error check with exit condition
if (!$row) {
    // If moment is not found, exit gracefully with an error message
    exit("<h1>Moment Not Found</h1><p>The moment ID was missing or invalid. Please return to the home page.</p>");
}

// Prepare display variables
$sealDateDisplay = date("F j, Y", strtotime($row['seal']));
$openDateDisplay = date("F j, Y", strtotime($row['open']));
$image_src = htmlspecialchars($row['image_url']);
$title_display = htmlspecialchars($row['title']);
$description_display = htmlspecialchars($row['description']);
$edit_url = "edit_moment.php?id=" . $moment_id;

// Override global metadata variables for the header component
$pageTitleOverride = "Moments Last " . $sealDateDisplay;
$pageDescriptionOverride = "Look back on the memories you’ve held close.";

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Moment - Ember</title>
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
                    
                    <div class="read_header">
                        <h2><?= $title_display ?></h2>
                        <a href="javascript:history.back()"> 
                            <img src="/Ember/assets/icons/icon-cancel-white.svg" alt="Back button" />
                        </a>
                    </div>

                    <div class="read_img">
                        <div class="img_container">
                            <img 
                                src="<?= $image_src ?>"
                                alt="Image for moment titled: <?= $title_display ?>"
                                style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; display: block;" 
                            />
                        </div>
                    </div>
                    
                    <div class="read_desc">
                        <p><?= nl2br($description_display) ?></p>
                    </div>

                </section>
                <section class="bottom_right">
                    <?php renderCalendar($row['seal']); ?> 
                    
                    <?php renderReferenceButton('Preserve More Moments', 'preserve_moment.php', 'button', '', '/Ember/assets/icons/icon-preserve-white.svg'); ?>
                </section>
            </section>
        </section>
    </main>
</body>

</html>