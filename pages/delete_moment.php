<?php

require_once __DIR__ . '/../includes/db_connect.php';

// HANDLE DELETE REQUEST
if (isset($_GET["id"])) {
    // Sanitize and validate the ID securely
    $id = (int) $_GET["id"];

    $query = "SELECT image_url FROM moments WHERE id = ?";
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->bind_result($imagePathFromDb);
        $stmt->fetch();
        $stmt->close();

        // 2. Delete the physical file if it exists
        if ($imagePathFromDb) {
            
            $fullFilePath = $_SERVER['DOCUMENT_ROOT'] . $imagePathFromDb;

            if (file_exists($fullFilePath)) {
                unlink($fullFilePath); // This deletes the file
            }
        }
    }

    // 3. NOW: Delete the record from the database
    $sql = "DELETE FROM moments WHERE id = ?";
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->close();
    }
}

header("Location: my_moments.php?success=deleted");
exit();
