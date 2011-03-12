<div id='assign_dialog' style='display:none'>
	Assign to: <span id='assign_dialog_assignee'>...</span>
</div>
<table class='taskboard'>

<?php

$states = array("backlog", "assigned", "in_progress", "done");

foreach ($projects as $p) {
   	echo "<tr><td colspan='5' class='project_separator'></td></tr>" .
   		"<tr class='project_row' id='project-$p->id'>" .
       	"<td class='box project'><div class='project_actions'>Actions</div>" .
		"<div class='project_name'>$p->name</div><div class='project_description'>$p->description</div>" .
		"</td>";
	
	for ($state = 0; $state < 4; $state++) {
		echo "<td class='box' id='project-$p->id-" . $states[$state] . "'>";
		foreach ($tasks as $t) {
			if ($t->project_id == $p->id && $t->status == $state) {
				echo "<div id='task-$t->id' class='task " . $states[$state] . "'>$t->description" .
					"<div class='task_decorator'>" .
					"<span class='assignee'>...</span>" .
					"<span class='task_actions'><img class='task_back_action' src='media/images/back.svg'/><img class='task_forward_action' src='media/images/forward.svg'/></span>" .
					"</div></div>";
			}
		}
		echo "</td>";
	}

   	echo "</tr>";
}

?>

</table>

