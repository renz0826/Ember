<?php

$sql = "SELECT * FROM moments ORDER BY open ASC";
$result = $conn -> query($sql);

?>

<!DOCTYPE html>
<html lang="en">

<body>
    <?php while ($row = $result -> fetch_assoc()): ?>
    <?php
        $momentID = htmlspecialchars($row['id']);
        $viewURL = "view_moment.php?id=" . $momentID;

        $openDate = new DateTime($row['open']);
        $today = new DateTime('today');

        if ($today >= $openDate) {
            $isReady = true;
            $daysLeft = 0;
        } else {
            $isReady = false;
            $interval = $today -> diff($openDate);
            $daysLeft = $interval -> days;
        }

        ?>
    <a href="<?= $viewURL ?>"
        style="text-decoration: none; color: inherit">
        <div class=" capsule_container">
            <h4> The seal breaks on
                <?= $row['open']; ?>
            </h4>
            <p> The moment is waiting to be unsealed.</p>

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
        </div>
    </a>
    <?php endwhile; ?>
</body>

</html>