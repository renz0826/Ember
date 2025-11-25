<?php

require_once __DIR__ . '/../includes/db_connect.php';

function displayMoment($momentNumber, $sealDate, $openDate, $status, $imgSrc, $sealImgSrc)
{
    echo "<div class = \"moment_container\">
        <div class = \" moment_top\">
            <h4> $status Moment #$momentNumber </h4>
            <div class = \"actions\">
                <a href=\"edit_moment.php\" class = \"action\">
                    <img src = \"/Ember/assets/icons/icon-edit.svg\" />
                    <p> Edit </p>
                </a>
                <button class = \"action\">
                    <img src = \"/Ember/assets/icons/icon-delete.svg\" />
                    <p> Delete </p>
                </button>
            </div>
        </div>

        <div class = \"moment_bottom\">
            <div class = \"thumbnail_container\">
                <img id=\"thumbnail\" src=$imgSrc />
                <img class=$status src=\"/Ember/assets/images/sealed.png\">
            </div>
            <div class=\"info\">
                <div class =\"seal_info\">
                    <p class =\"info_title\"> Sealed On </p>
                    <p class =\"info_main\"> $sealDate </p>
                </div>
                <div class =\"seal_info\">
                    <p class =\"info_title\"> Seal Breaks On </p>
                    <p class =\"info_main\"> $openDate </p>
                </div>
                <div class =\"seal_info\">
                    <p class =\"info_title\"> Status </p>
                    <div class =\"seal_status\">
                        <img src =$sealImgSrc>
                        <p class =\"moment_status\"> $status </p>       
                    </div>
                </div>
            </div>
        </div>
    </div>";
}

function renderRecentMoment($momentNumber, $sealDate, $openDate, $status, $imgSrc, $sealImgSrc)
{
    echo "<div class = \"recent_moment_container\">
        <div class = \" moment_top\">
            <h5> $status Moment #$momentNumber </h5>
        </div>

        <div class = \"recent_moment_bottom\">
            <div class = \"thumbnail_container\">
                <img id=\"thumbnail\" src=$imgSrc />
                <img class=$status src=\"/Ember/assets/images/sealed.png\">
            </div>
            <div class=\"info\">
                <div class =\"seal_info\">
                    <small class =\"info_title\"> Sealed On </small>
                    <small class =\"info_main\"> $sealDate </small>
                </div>
                <div class =\"seal_info\">
                    <small class =\"info_title\"> Seal Breaks On </small>
                    <small class =\"info_main\"> $openDate </small>
                </div>
                <div class =\"seal_info\">
                    <small class =\"info_title\"> Status </small>
                    <div class =\"seal_status\">
                        <img src =$sealImgSrc>
                        <small class =\"moment_status\"> $status </small>       
                    </div>
                </div>
            </div>
        </div>
    </div>";
}
function renderAllMoments($conn)
{
    
    $sql = "SELECT * FROM moments ORDER BY open ASC";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Loop through every row in the database
        while ($row = $result->fetch_assoc()) {
        
            $id = $row['id'];

            $today = new DateTime('today');
            $openDateObj = new DateTime($row['open']);
        
            // Check if today is equal to or past the open date
            if ($today >= $openDateObj) {
                $statusText = "Unsealed";
                $sealImgSrc = "/Ember/assets/icons/icon-unsealed.svg";
            } else {
                $statusText = "Sealed";
                $sealImgSrc = "/Ember/assets/icons/icon-sealed.svg";
            }

            $sealDateDisplay = date("F j, Y", strtotime($row['seal']));
            $openDateDisplay = date("F j, Y", strtotime($row['open']));

            $img = $row['image_url'];

            displayMoment($id, $sealDateDisplay, $openDateDisplay, $statusText, $img, $sealImgSrc);
        }
    } else {
        echo "<p style='padding: 20px; color: #666;'>No moments found.</p>";
    }
}

function renderRecentlySealed($conn, $limit = 3)
{
    echo "<div class=\"recently_sealed\">
            <h3> Recently Sealed </h3>";

    $sql = "SELECT * FROM moments ORDER BY open ASC LIMIT ?";
    
    if ($stmt = $conn->prepare($sql)) {
        
        $stmt->bind_param("i", $limit);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                
                $id = $row['id'];
                $img = $row['image_url'];

                $today = new DateTime('today');
                $openDateObj = new DateTime($row['open']);
                
                if ($today >= $openDateObj) {
                    $statusText = "Unsealed";
                    $sealImgSrc = "/Ember/assets/icons/icon-unsealed.svg";
                } else {
                    $statusText = "Sealed";
                    $sealImgSrc = "/Ember/assets/icons/icon-sealed.svg";
                }

                $sealDateDisplay = date("F j, Y", strtotime($row['seal']));
                $openDateDisplay = date("F j, Y", strtotime($row['open']));

                renderRecentMoment($id, $sealDateDisplay, $openDateDisplay, $statusText, $img, $sealImgSrc);
            }
        } else {
            echo "<p style='padding: 20px; color: #666;'>No moments found.</p>";
        }
        $stmt->close();
    }
    
    echo "</div>";
}
