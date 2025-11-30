<?php
// includes the head
require_once __DIR__ . '/../includes/head.php';

// 2. INITIALIZE VARIABLES
$row = null;
$moment_id = 0;

// --- STEP 1: CAPTURE ID AND FETCH DATA ---
if (isset($_GET['id'])) {
    $moment_id = (int) $_GET['id'];
    
    // Select all fields for the specific ID
    $sql = "SELECT id, title, description, image_url, seal, open FROM moments WHERE id = ?";
    
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

// --- STEP 2: HANDLE NOT FOUND ---
if (!$row) {
    exit("<h1>Moment Not Found</h1><p>The moment ID was missing or invalid. Please return to the home page.</p>");
}

// --- STEP 3: PREPARE DISPLAY VARIABLES ---
$sealDateDisplay = date("F j, Y", strtotime($row['seal']));
$openDateDisplay = date("F j, Y", strtotime($row['open']));
$image_src = htmlspecialchars($row['image_url']);
$title_display = htmlspecialchars($row['title']);
$description_display = htmlspecialchars($row['description']);
$edit_url = "edit_moment.php?id=" . $moment_id;

// --- STEP 4: DEFINE DYNAMIC HEADER OVERRIDES ---
// This makes the header look like your image: "Moments Last June 18, 2024"
$pageTitleOverride = "Moments Last " . $sealDateDisplay;
$pageDescriptionOverride = "Look back on the memories you’ve held close.";

// Include other components
require_once __DIR__ . '/../components/button.php';
require_once __DIR__ . '/../components/calendar.php';
require_once __DIR__ . '/../components/moment.php';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Moment - Ember</title>
</head>

<body>
    <div class="left">
        <?php require_once __DIR__ . '/../components/nav.php';?>
    </div>
    <main>

        <div class="right">
            <div class="top">
                <?php require_once __DIR__ . '/../components/header.php'; ?>
            </div>

            <div class="bottom">
                <div class="bottom_left">
                    <div class="read_header">
                        <h2><?= $title_display ?></h2>
                        <a href="javascript:history.back()"> <img src="/Ember/assets/icons/icon-cancel-white.svg" />
                        </a>
                    </div>

                    <div class="read_img">
                        <div class="img_container">
                            <img src="<?= $image_src ?>"
                                style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; display: block;" />
                        </div>
                    </div>
                    <div class="read_desc">
                        <p><?= nl2br($description_display) ?></p>
                    </div>

                </div>

                <div class="bottom_right">
                    <?php renderCalendar($row['seal']); ?>
                    <?php renderLinkButton('Preserve More Moments', 'preserve_moment.php', 'button', '', '/Ember/assets/icons/icon-preserve-white.svg'); ?>
                </div>

            </div>
        </div>


    </main>
</body>

</html>