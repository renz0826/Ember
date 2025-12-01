<?php

// Include the database connection file
require_once __DIR__ . '/../includes/db_connect.php';

// Check if the 'id' parameter is set in the URL
if (isset($_GET["id"])) {

    // Sanitize and validate the ID securely by casting to an integer
    $id = (int) $_GET["id"];

    // Prepare statement to safely get the image path associated with the ID
    $query = "SELECT image_url FROM moments WHERE id = ?";
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->bind_result($imagePathFromDb);
        $stmt->fetch();
        $stmt->close();

        // Check if an image path was successfully retrieved
        if ($imagePathFromDb) {
            
            // Use DOCUMENT_ROOT to ensure the path is correct relative to the server's root
            $fullFilePath = $_SERVER['DOCUMENT_ROOT'] . $imagePathFromDb;

            // Verify the file exists before attempting to delete it
            if (file_exists($fullFilePath)) {
                unlink($fullFilePath); // Deletes the physical file
            }
        }
    }

    // Prepare statement to safely delete the row from the database
    $sql = "DELETE FROM moments WHERE id = ?";
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->close();
    }
}

// Redirects back to the list page after the process is complete
// This prevents accidental re-deletion upon browser refresh (Post/Redirect/Get pattern)
header("Location: my_moments.php?success=deleted");
exit();