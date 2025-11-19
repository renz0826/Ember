<?php

function renderCapsule($openDate, $status, $countdown)
{
    echo "
    <div class=\"capsule_container\">
        <h4> The seal breaks on $openDate </h4>
        <p> The moment is $status to be unsealed.</p>
        
        <div class=\"main_capsule\">
            <img src=\"/Ember/assets/images/capsule.png\" />
            
            <div class=\"timer\">
                <h5>$countdown</h5>
                <small class=\"caption\">
                    Time before capsule unseals.
                </small>
            </div>
        </div>
    </div>
";

}
