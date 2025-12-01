<?php

// Include necessary dependencies
require_once __DIR__ . '/../includes/head.php';
require_once __DIR__ . '/../components/button.php';   // Provides renderReferenceButton and renderSortButton
require_once __DIR__ . '/../components/calendar.php'; // Provides renderCalendar

// Initialize message variable
$message = ""; 

// Hand POST REQUEST for form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Sanitize text & date inputs
    $title = htmlspecialchars($_POST['moment_title'] ?? '');
    $description = htmlspecialchars($_POST['moment_description'] ?? '');
    
    $sealDate = date('Y-m-d'); 
    $openDate = $_POST['endDate'] ?? date('Y-m-d'); 

    $imagePath = ""; 
    
    if (isset($_FILES['moment_media']) && $_FILES['moment_media']['error'] === 0) {

        // Sets upload directory to "uploads" folder
        $uploadDir = __DIR__ . '/../uploads/'; 
        
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Sets uploaded image to have a unique name
        $fileExtension = pathinfo($_FILES['moment_media']['name'], PATHINFO_EXTENSION);
        $uniqueName = uniqid('moment_', true) . '.' . $fileExtension;
        $targetFile = $uploadDir . $uniqueName;
        
        // Handles image upload
        $check = getimagesize($_FILES['moment_media']['tmp_name']);
        if ($check !== false) {
            if (move_uploaded_file($_FILES['moment_media']['tmp_name'], $targetFile)) {
                $imagePath = '/Ember/uploads/' . $uniqueName;
            } else {
                $message = "Error uploading file. Check directory permissions.";
            }
        } else {
            $message = "File is not a valid image.";
        }
    }

    // If no errors persist, this handles moment information insert to the database
    if (empty($message)) {
        $sql = "INSERT INTO moments (title, description, image_url, seal, open) VALUES (?, ?, ?, ?, ?)";
        
        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("sssss", $title, $description, $imagePath, $sealDate, $openDate);
            
            // If successful, alert shows
            if ($stmt->execute()) {
                echo "<script> 
                    alert(\"Your moment has been successfully sealed.\"); 
                    window.location.href = 'home.php?success=created';
                </script>";
                exit();
            } else {
                $message = "Database Error: " . $stmt->error;
            }
            $stmt->close();
        } else {
            $message = "Query Preparation Error: " . $conn->error;
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preserve a Moment - Ember</title>
</head>

<body>
    <section class="left" aria-label="Site Navigation">
        <?php 
            // Include main site navigation
            require_once __DIR__ . '/../components/nav.php';
        ?>
    </section>
    <main role="main">
        <section class="right" aria-label="Moment Preservation Form">
            
            <section class="top">
                <?php 
                    // Include page header component
                    require_once __DIR__ . '/../components/header.php'; 
                ?>
            </section>
            <?php if ($message): ?>
            <div role="alert" style="background: #ffdddd; padding: 10px; margin: 10px; border-radius: 5px; color: red;">
                <?php echo htmlspecialchars($message); ?>
            </div>
            <?php endif; ?>

            <!-- Form that handles moment creation -->
            <form id="moment_form" class="bottom" action="" method="POST" enctype="multipart/form-data">

                <section class="bottom_left">
                    
                    <div class="input_group">
                        <label for="moment_title"> Name this Moment </label>
                        <input type="text" id="moment_title" name="moment_title" placeholder="Name this moment..." required>
                    </div>

                    <div class="input_group">
                        <label for="moment_media"> Frame the Feeling </label>
                        <input 
                            type="file" 
                            id="moment_media" 
                            name="moment_media" 
                            accept="image/*"
                            style="display: none;"
                        >

                        <div class="media_preview">
                            <div class="canvas_container">
                                <canvas id="canvas"></canvas>
                            </div>
                            <span id="file_status" style="display: block; margin-top: 10px; color: #888;">No file chosen.</span>
                        </div>

                        <?php renderUploadButton('Add Media', '', 'button_no_fill', 'upload_media', '/Ember/assets/icons/icon-media.svg'); ?>
                    </div>

                    <div class="input_group">
                        <label for="moment_description"> Tell the Story </label>
                        <textarea id="moment_description" name="moment_description" placeholder="Tell the story..." required></textarea>
                    </div>

                </section>
                <section class="bottom_right">
                    
                    <?php renderCalendar(); ?>

                    <?php 
                        renderSubmitButton(
                            'Seal Moment', 
                            'submitMoment(event)', 
                            'button', 
                            'seal_moment', 
                            '/Ember/assets/icons/icon-lock.svg', 
                            'button'
                        ); 
                    ?>

                    <?php renderReferenceButton('Cancel', 'javascript:history.back()', 'button_no_fill', 'cancel', '/Ember/assets/icons/icon-cancel.svg'); ?>
                
                </section>
                </form>
            </section>
        </main>
</body>

</html>