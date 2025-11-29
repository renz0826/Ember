<?php
$sql = "SELECT * FROM moments ORDER BY open ASC";
$result = $conn -> query($sql);
?>

<!DOCTYPE html>
<html lang="en">

<body>
    <?php if ($result->num_rows > 0): ?>

    <?php while ($row = $result -> fetch_assoc()): ?>
    <?php
                // 1. Setup Data
                $momentID = htmlspecialchars($row['id']);
        $viewURL = "view_moment.php?id=" . $momentID;

        $openDate = new DateTime($row['open']);
        $today = new DateTime('today');

        // 2. Determine Status
        if ($today >= $openDate) {
            $isReady = true;
            $daysLeft = 0;
        } else {
            $isReady = false;
            $interval = $today -> diff($openDate);
            $daysLeft = $interval -> days;
        }

        // 3. LOGIC: Determine Tag & Attributes based on $isReady
        if ($isReady) {
            // If Ready (Unsealed): Make it a Link
            $tag = 'a';
            $attr = 'href="' . $viewURL . '" style="text-decoration: none; color: inherit; display: block;"';
        } else {
            // If Not Ready (Sealed): Make it a Div (Not clickable)
            $tag = 'div';
            $attr = 'style="display: block; color: inherit; cursor: default;"';
        }
        ?>



    <div class="capsule_container">
        <h4> The seal breaks on
            <?= $row['open']; ?>
        </h4>
        <p> The moment is waiting to be unsealed.</p>
        <<?= $tag ?>
            <?= $attr ?>>
            <div class="main_capsule">
                <img src="/Ember/assets/images/capsule.png" />

                <div class="timer">
                    <h4 style="margin-bottom: 10px;">
                        <?php
                            if ($isReady) {
                                echo "Unseal Your Moment";
                            } else {
                                if ($daysLeft == 1) {
                                    $daysDisplay = "Day Left";
                                } else {
                                    $daysDisplay = "Days Left";
                                }
                                echo $daysLeft . " " . $daysDisplay;
                            }
        ?>
                    </h4>
                    <small class="caption">
                        <?php
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
    <div class='empty_state_container'>
        <h3>No Moments Yet</h3>
        <p style="color: var(--color-gray);">It seems you haven't preserved any memories yet.</p>
    </div>
    <?php endif; ?>
</body>

</html>