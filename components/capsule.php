<?php

// Database connection
$sql = "SELECT * FROM moments ORDER BY open ASC";   // Data is sorted by ascending open date
$result = $conn->query($sql);

?>

<!DOCTYPE html>
<html lang="en">

<body>
    <?php if ($result->num_rows > 0): ?>
        
        <!-- A loop that fetches the result row -->
        <?php while ($row = $result->fetch_assoc()): ?>
            <?php
                
                // Settup moment data 
                $momentID = htmlspecialchars($row['id']);
                
                // Safely build the query string for the view URL
                $viewQuery = http_build_query(['id' => $momentID]);
                $viewURL = "view_moment.php?" . $viewQuery;

                // Setup date variables
                $openDate = new DateTime($row['open']);
                $today = new DateTime('today');

                // Determine moment ready status
                if ($today >= $openDate) {
                    $isReady = true;
                    $daysLeft = 0;
                } else {
                    $isReady = false;
                    $interval = $today->diff($openDate);
                    $daysLeft = $interval->days;
                }

                // Initialize dynamic tags for click interactivity
                $tag = 'div'; // Default to a non-clickable container
                $attr = 'class="capsule_wrapper"'; 

                if ($isReady) {
                    // If Ready (Unsealed): Make it a Link (Anchor tag)
                    $tag = 'a';
                    // Append href to attributes 
                    $attr .= ' href="' . $viewURL . '"'; 
                } else {
                    // If Not Ready (Sealed): Keep it as a div
                    // No extra attributes needed as it defaults to div with $attr
                }

                // Format date output to Date Month Year
                $openDateDisplay = date("F j, Y", strtotime($row['open']));
            ?>

            <!-- Main capsule structure -->
            <div class="capsule_container">
                <h4>
                    The seal breaks on
                    <?= $openDateDisplay; ?>
                </h4>
                <p> The moment is yet to be unsealed.</p>
                
                <!-- Dynamic tag output -->
                <<?= $tag ?> <?= $attr ?>>
                    <div class="main_capsule">
                        <img src="/Ember/assets/images/capsule.png" alt="A sealed time capsule icon" />

                        <div class="timer">
                            <h4 style="margin-bottom: 10px;">
                                <?php
                                    if ($isReady) {
                                        echo "Unseal Your Moment";
                                    } else {
                                        // Plural/Singular Day logic
                                        $daysDisplay = ($daysLeft == 1) ? "Day Left" : "Days Left";
                                        echo $daysLeft . " " . $daysDisplay;
                                    }
                                ?>
                            </h4>
                            <small class="caption">
                                <?php
                                    // Status description logic
                                    if ($isReady) {
                                        echo "The moment is ready to be unsealed";
                                    } else {
                                        echo "The moment is waiting for its perfect day";
                                    }
                                ?>
                            </small>
                        </div>
                    </div>
                </<?= $tag ?>>
            </div>


        <?php endwhile; ?>

    <?php else: ?>
        <!-- Displays if there are no moment capsules present -->
        <div class="empty_state_container">
            <h3>No Moments Yet</h3>
            <p style="color: var(--color-gray);">It seems that you haven't preserved any memories yet.</p>
        </div>
    <?php endif; ?>
</body>

</html>