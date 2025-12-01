<?php

// Connects to the database before rendering
require_once __DIR__ . '/../includes/db_connect.php';

/*
  Renders a single "Moment" card, dynamically switching between <a> and <div> tags 
  based on the moment's sealed or unsealed status
*/
function renderMomentCard(
    $momentNumber, 
    $sealDate, 
    $openDate, 
    $status, 
    $imgSrc, 
    $sealImgSrc, 
    $editAction, 
    $deleteAction)
{
    $viewURL = "view_moment.php?id=" . $momentNumber;
    $status_lower = strtolower($status);

    // Determine tag and attribute
    if ($status === 'Sealed') {
        // If Sealed: Use a div (not clickable)
        $tag = 'div';
        $attr = 'class="capsule-link-container"'; 
    } else {
        // If Unsealed: Use an anchor (clickable) with href
        $tag = 'a';
        $attr = "href=\"$viewURL\" class=\"capsule-link-container\"";
    }

    // Render moment card structure

    // Start of the main moment container
    echo "<div class=\"moment_container\" data-status=\"$status_lower\">";

    // Moment top with containing header and actions
    echo "<div class=\"moment_top\">";

    // Dynamic tag for moment interactivity
    echo <<<MOMENT_ID
    <$tag $attr>
        <h4> $status Moment #$momentNumber </h4>
    </$tag>
MOMENT_ID;

    // Action block containing the edit, delete, and delete modal popup function
    echo <<<ACTIONS_BLOCK

    <div class="actions">
        <a $editAction id="edit" class="action">
            <img src="/Ember/assets/icons/icon-edit.svg" alt="Edit Moment Icon" />
            <p> Edit </p>
        </a>
        
        <button class="action" data-moment-id="$momentNumber">
            <img src="/Ember/assets/icons/icon-delete.svg" alt="Delete Moment Icon" />
            <p> Delete </p>
        </button>
        
        <div class="delete-modal" id="modal-$momentNumber" style="display: none;">
            <div class="pop_up_content">
                <img class="graphic-size" src="/Ember/assets/icons/icon-delete-confirmation.svg" alt="Delete Confirmation Graphic" />
                <h4> Delete Moment? </h4>
                <p> Your moment will be permanently deleted. Please proceed with caution. </p>
                <a $deleteAction class="button-delete">
                    <img src="/Ember/assets/icons/icon-delete-white.svg" alt="Confirm Delete Icon" />
                    <h5> Delete Moment </h5>
                </a>
                <a href="#" class="button_no_fill_cancel close-modal-btn">
                    <img src="/Ember/assets/icons/icon-cancel-white.svg" alt="Cancel Icon" />
                    <h5> Cancel </h5>
                </a>    
            </div>
        </div>
    </div>
</div>
ACTIONS_BLOCK;

    // Render moment thumbnal and information
    // Dynamic tag for moment interactivity
    echo "<$tag $attr>";
    
    echo <<<INFO_BLOCK
    <div class="moment_bottom">
        <div class="thumbnail_container">
            <img id="thumbnail" src="$imgSrc" alt="Moment Thumbnail Image" />
            <img class="$status" src="/Ember/assets/images/sealed.png" alt="Sealed Image Overlay">
        </div>
        <div class="info">
            <div class="seal_info">
                <p class="info_title"> Sealed On </p>
                <p class="info_main"> $sealDate </p>
            </div>
            <div class="seal_info">
                <p class="info_title"> Seal Breaks On </p>
                <p class="info_main"> $openDate </p>
            </div>
            <div class="seal_info">
                <p class="info_title"> Status </p>
                <div class="seal_status">
                    <img src="$sealImgSrc" alt="Status Icon: $status" >
                    <p class="moment_status"> 
                        $status
                    </p>    
                </div>
            </div>
        </div>
    </div>
INFO_BLOCK;

    echo "</$tag>"; // Closes the dynamic tag (a or div)
    echo "</div>"; // Close the main moment_container
}


/*
  Renders a compact view of a single recently sealed moment
*/
function renderRecentMomentCard(
    $momentNumber, 
    $sealDate, 
    $openDate, 
    $status, 
    $imgSrc, 
    $sealImgSrc)
{
    // Output using Heredoc syntax
    echo <<<HTML
<div class="recent_moment_container">
    <div class="moment_top">
        <h5> $status Moment #$momentNumber </h5>
    </div>

    <!-- Contains the recent moment thumbnail and information -->
    <div class="recent_moment_bottom">
        <div class="thumbnail_container">
            <img id="thumbnail" src="$imgSrc" alt="Moment Thumbnail Image" />
            <img class="$status" src="/Ember/assets/images/sealed.png" alt="Sealed Image Overlay">
        </div>
        <div class="info">
            <div class="seal_info">
                <small class="info_title"> Sealed On </small>
                <small class="info_main"> $sealDate </small>
            </div>
            <div class="seal_info">
                <small class="info_title"> Seal Breaks On </small>
                <small class="info_main"> $openDate </small>
            </div>
            <div class="seal_info">
                <small class="info_title"> Status </small>
                <div class="seal_status">
                    <img src="$sealImgSrc" alt="Status Icon: $status">
                    <small class="moment_status"> $status </small>    
                </div>
            </div>
        </div>
    </div>
</div>
HTML;
}


/*
  Fetches all moments from the database and calls displayMoment for each one
*/
function renderAllMoments($conn)
{   
    // Database connection
    $sql = "SELECT * FROM moments ORDER BY open ASC";   // Data is sorted by ascending open date
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {

            // Initialize attributes
            $id = $row['id'];
            $editAction = 'href="edit_moment.php?id=' . $id . '"';
            $deleteAction = 'href="delete_moment.php?id=' . $id . '"';

            // Setup date variables
            $today = new DateTime('today');
            $openDateObj = new DateTime($row['open']);
            
            // Dynamic seal status image 
            if ($today >= $openDateObj) {
                $statusText = "Unsealed";
                $sealImgSrc = "/Ember/assets/icons/icon-unsealed.svg";  // Unsealed: Unlocked Icon
            } else {
                $statusText = "Sealed";
                $sealImgSrc = "/Ember/assets/icons/icon-sealed.svg";   // Sealed: Locked Icon
            }

            // Format date output to Date Month Yearo
            $sealDateDisplay = date("F j, Y", strtotime($row['seal']));
            $openDateDisplay = date("F j, Y", strtotime($row['open']));

            $img = $row['image_url'];

            // Pass the data to the renderer function
            renderMomentCard($id, $sealDateDisplay, $openDateDisplay, $statusText, $img, $sealImgSrc, $editAction, $deleteAction);
        }
    } else {
    // Empty moment statement
    echo <<<EMPTY_MOMENT
<div class="empty_state_container">
    <h4>No Moments Yet</h4>
    <p style="color: var(--color-gray);">It seems that you haven't preserved any memories yet.</p>
</div>
EMPTY_MOMENT; 
}
}


/*
  Fetches and renders the most recent sealed moments
*/
function renderRecentlySealed(
    $conn, 
    $limit = 3) // Limits recently sealed moments display to 3
{
    echo "<div class=\"recently_sealed\">
            <h3> Recently Sealed </h3>";

    // Use prepared statements for safe SQL execution
    $sql = "SELECT * FROM moments WHERE open > CURRENT_DATE ORDER BY open ASC LIMIT ?";
    
    if ($stmt = $conn->prepare($sql)) {
        
        $stmt->bind_param("i", $limit); 
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                
                $id = $row['id'];
                $img = $row['image_url'];

                $statusText = "Sealed";
                $sealImgSrc = "/Ember/assets/icons/icon-sealed.svg";

                $sealDateDisplay = date("F j, Y", strtotime($row['seal']));
                $openDateDisplay = date("F j, Y", strtotime($row['open']));

                // Pass the data to the renderer function
                renderRecentMomentCard($id, $sealDateDisplay, $openDateDisplay, $statusText, $img, $sealImgSrc);
            }
        } else {
            echo "<p style='padding: 20px; color: #666;'>No recently sealed moments yet.</p>";
        }
        $stmt->close();
    }
    
    echo "</div>";
}