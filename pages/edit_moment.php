<?php
// 1. Include DB Connect (Crucial for $conn access)
// Assuming this file includes your db_connect.php:
require_once __DIR__ . '/../includes/head.php';
require_once __DIR__ . '/../includes/db_connect.php';
require_once __DIR__ . '/../components/button.php';
require_once __DIR__ . '/../components/calendar.php'; // Includes renderCalendar

// Initialize default moment data to prevent "undefined variable" errors during initial load
$row = ['id' => '', 'open' => ''];

// --- HANDLE GET REQUEST (Fetch Data for pre-filling the form) ---
if (isset($_GET['id'])) {
    $id_edit = (int) $_GET['id'];

    if ($id_edit <= 0) {
        exit("Invalid Moment ID");
    }

    // Fix: Corrected SQL syntax (removed trailing comma)
    $stmt = $conn->prepare("SELECT id, open FROM moments WHERE id = ?");
    $stmt->bind_param('i', $id_edit);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc(); // Fetches the data into $row
        } else {
            exit("Moment not found.");
        }
    } else {
        echo "Error: " . $stmt->error;
    }
    $stmt->close();
}

// --- HANDLE POST REQUEST (Update Data) ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Get ID from hidden input
    $id = $_POST['id'];
    
    // 2. Fix: Use 'endDate' to match the calendar input name
    // If the input is empty (shouldn't happen), default to today.
    $openDate = $_POST['endDate'] ?? date('Y-m-d');

    $stmt = $conn->prepare("UPDATE moments SET open = ? WHERE id = ?");
    $stmt->bind_param('si', $openDate, $id);

    if ($stmt->execute()) {
        // Success: Use JS for alert before redirect
        echo "<script> 
                alert(\"Your moment has been successfully updated.\"); 
                window.location.href = 'home.php?success=updated';
              </script>";
        exit();
    } else {
        $message = "Database Error: " . $stmt->error;
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
    <div class="left">
        <?php require_once __DIR__ . '/../components/nav.php'; ?>
    </div>
    <main>
        <div class="right">
            <div class="top">
                <?php require_once __DIR__ . '/../components/header.php'; ?>
            </div>
            <form class="edit_bottom" action="" method="POST">

                <input type="hidden" name="id"
                    value="<?= htmlspecialchars($row['id']) ?>">
                <div class="edit_bottom_left">
                    <?php renderCalendar($row['open']); ?>
                </div>

                <div class="edit_bottom_right">
                    <?php renderSubmitButton('Update Seal Time', '', 'button', 'update', '/Ember/assets/icons/icon-lock.svg'); ?>

                    <?php renderReferenceButton('Cancel', 'javascript:history.back()', 'button_no_fill', '', '/Ember/assets/icons/icon-cancel.svg'); ?>
                </div>

            </form>
        </div>


    </main>
</body>

</html>