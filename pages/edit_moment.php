<?php

// Include necessary dependencies
require_once __DIR__ . '/../includes/head.php';
require_once __DIR__ . '/../includes/db_connect.php'; // Provides database connection
require_once __DIR__ . '/../components/button.php'; // Provides button render functions
require_once __DIR__ . '/../components/calendar.php'; // Provides renderCalendar

// Initialize default moment data to prevent "undefined variable" errors 
$row = ['id' => '', 'open' => ''];
$message = ''; // Message for displaying errors or status

// Handle GET REQUEST for filling up the form
if (isset($_GET['id'])) {
    $id_edit = (int) $_GET['id']; // Securely cast ID to integer

    // Handle cases where the ID is 0 or negative
    if ($id_edit <= 0) {
        exit("Invalid Moment ID provided.");
    }

    // Use prepared statement to securely fetch the current moment's data
    $stmt = $conn->prepare("SELECT id, open FROM moments WHERE id = ?");
    
    $stmt->bind_param('i', $id_edit);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
        } else {
            exit("Moment not found.");
        }
    } else {
        $message = "Database Fetch Error: " . $stmt->error;
    }
    $stmt->close();
}

// Handle POST REQUEST to process form submission and update date
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $id = (int) ($_POST['id'] ?? 0); 
    
    // Use 'endDate' to match the calendar input name; sanitize the date input
    $openDate = filter_input(INPUT_POST, 'endDate', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    
    // Fallback if the input is empty or invalid
    if (empty($openDate)) {
        $openDate = date('Y-m-d');
    }

    // Prepared statement for secure UPDATE operation
    $stmt = $conn->prepare("UPDATE moments SET open = ? WHERE id = ?");
    
    // 's' for string (date), 'i' for integer (ID)
    $stmt->bind_param('si', $openDate, $id);

    if ($stmt->execute()) {
        // Success: Use JavaScript to display alert and redirect
        echo "<script> 
                alert(\"Your moment has been successfully updated.\"); 
                window.location.href = 'home.php?success=updated';
              </script>";
        exit();
    } else {
        $message = "Database Update Error: " . $stmt->error;
    }
    $stmt->close();
}
?>

<!DOCTYPE html>
<html lang="en" data-title="Edit Your Moment">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> Edit Moment - Ember </title>
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
            
            <?php if (!empty($message)): ?>
                <div class="message-box error"><?= htmlspecialchars($message) ?></div>
            <?php endif; ?>
            
            <!-- Form for editing openDate -->
            <form class="edit_bottom" action="" method="POST">
                
                <input 
                    type="hidden" 
                    name="id"
                    value="<?= htmlspecialchars($row['id']) ?>"
                >
                
                <div class="edit_bottom_left">
                    <!-- Renders interactive calendar to set new openDate -->
                    <?php renderCalendar($row['open']); ?>
                </div>

                <div class="edit_bottom_right">
                    <!-- Submit Button -->
                    <?php 
                        renderSubmitButton(
                            'Update Seal Time', 
                            '', 
                            'button', 
                            'update', 
                            '/Ember/assets/icons/icon-lock.svg'
                        ); 
                    ?>

                    <!-- Cancel Button -->
                    <?php 
                        renderReferenceButton(
                            'Cancel', 
                            'javascript:history.back()', 
                            'button_no_fill', 
                            '', 
                            '/Ember/assets/icons/icon-cancel.svg'
                        ); 
                    ?>
                </div>

            </form>
        </section>
    </main>
</body>

</html>