<?php
// 1. Include Database Connection and Components
require_once __DIR__ . '/../includes/head.php';
require_once __DIR__ . '/../components/button.php';
require_once __DIR__ . '/../components/calendar.php';

// 2. Handle Form Submission
$message = ""; // To store success/error messages

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // A. Sanitize Text Inputs
    $title = htmlspecialchars($_POST['moment_title'] ?? '');
    $description = htmlspecialchars($_POST['moment_description'] ?? '');
    
    $sealDate = date('Y-m-d');
    $openDate = $_POST['endDate'] ?? date('');

    // B. Handle Image Upload
    $imagePath = ""; // Default if no image
    
    if (isset($_FILES['moment_media']) && $_FILES['moment_media']['error'] === 0) {
        $uploadDir = __DIR__ . '/../uploads/'; // Points to Ember/uploads/
    

        // Generate unique name to prevent overwriting
        $fileExtension = pathinfo($_FILES['moment_media']['name'], PATHINFO_EXTENSION);
        $uniqueName = uniqid('moment_', true) . '.' . $fileExtension;
        $targetFile = $uploadDir . $uniqueName;
        
        // Validate it is an image
        $check = getimagesize($_FILES['moment_media']['tmp_name']);
        if ($check !== false) {
            if (move_uploaded_file($_FILES['moment_media']['tmp_name'], $targetFile)) {
                // Store this path in the DB (Relative path for the browser)
                $imagePath = '/Ember/uploads/' . $uniqueName;
            } else {
                $message = "Error uploading file.";
            }
        } else {
            $message = "File is not an image.";
        }
    }

    // C. Insert into Database
    if (empty($message)) {
        // Assuming your table is named 'capsules' or 'moments'
        // Adjust column names to match your actual database: title, description, image_url, seal, open
        $sql = "INSERT INTO moments (title, description, image_url, seal, open) VALUES (?, ?, ?, ?, ?)";
        
        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("sssss", $title, $description, $imagePath, $sealDate, $openDate);
            
            if ($stmt->execute()) {
                // Success! Redirect to home or show success
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
            $message = "Query Error: " . $conn->error;
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
    <div class="left">
        <?php require_once __DIR__ . '/../components/nav.php';?>
    </div>
    <main>
        <div class="right">
            <div class="top">
                <?php require_once __DIR__ . '/../components/header.php'; ?>
            </div>

            <?php if ($message): ?>
            <div style="background: #ffdddd; padding: 10px; margin: 10px; border-radius: 5px; color: red;">
                <?php echo $message; ?>
            </div>
            <?php endif; ?>

            <form id="moment_form" class="bottom" action="" method="POST" enctype="multipart/form-data">

                <div class="bottom_left">
                    <div class="input_group">
                        <label for="moment_title"> Name this Moment </label>
                        <input type="text" id="moment_title" name="moment_title" placeholder="Name this moment..."
                            required>
                    </div>

                    <div class="input_group">
                        <label for="moment_description"> Frame the Feeling </label>
                        <input type="file" id="moment_media" name="moment_media" accept="image/*"
                            style="display: none;">

                        <div class="media_preview">
                            <div class="canvas_container">
                                <canvas id="canvas"></canvas>
                            </div>
                            <span id="file_status" style="display: block; margin-top: 10px; color: #888;">No file
                                chosen.</span>
                        </div>

                        <?php renderUploadButton('Add Media', '', 'button_no_fill', 'upload_media', '/Ember/assets/icons/icon-media.svg'); ?>
                    </div>

                    <div class="input_group">
                        <label for="moment_description"> Tell the Story </label>
                        <textarea id="moment_description" name="moment_description" placeholder="Tell the story..."
                            required></textarea>
                    </div>

                </div>

                <div class="bottom_right">
                    <?php renderCalendar(); ?>

                    <?php renderSubmitButton('Seal Moment', 'submitMoment(event)', 'button', 'seal_moment', '/Ember/assets/icons/icon-lock.svg', 'button'); ?>

                    <?php renderLinkButton('Cancel', 'home.php', 'button_no_fill', 'cancel', '/Ember/assets/icons/icon-cancel.svg'); ?>
                </div>

            </form>
        </div>

    </main>
</body>

</html>