<?php

$parser = new Helper_Formatter();
$assignee_filter = isset($_COOKIE['cardboard-filter']) ? $_COOKIE['cardboard-filter'] : "";

echo "<div style='display:none'>";

echo "<div id='assign_dialog'>Assign to: <select name='assignee_dialog_select' id='assign_dialog_assignee'>";
foreach ($assignees as $i => $a) {
	echo "<option value='$i'>" . $a->name . "</option>";
}
echo "</select></div>";

echo "<div id='new_task_dialog'>Description:
<textarea id='new_task_description' cols=32 rows=8></textarea>
</div>";

echo "<div id='new_deliverable_dialog'>Description:
<textarea id='new_deliverable_description' cols=32 rows=8></textarea>
</div>";

echo "<div id='edit_task_dialog'>Description:
<textarea id='edit_task_description' cols=32 rows=8></textarea>
</div>";

echo "<div id='edit_deliverable_dialog'>Description:
<textarea id='edit_deliverable_description' cols=32 rows=8></textarea>
<br/>
<select id='edit_deliverable_status'>
<option id='edit_deliverable_status_green' value='0'>Green</option>
<option id='edit_deliverable_status_yellow' value='1'>Yellow</option>
<option id='edit_deliverable_status_red' value='2'>Red</option>
</select>
</div>";

echo "<div id='edit_project_dialog'>
Title:
<input id='edit_project_name'>
Description:
<textarea id='edit_project_description' cols=32 rows=8></textarea>
</div>";

echo "<div id='add_project_dialog'>
Title:
<input id='edit_project_name'>
Description:
<textarea id='edit_project_description' cols=32 rows=8></textarea>
</div>";

echo "<div id='task_template' style='display:none'><span class='description'></span>" .
	"<div class='task_decorator'>" .
		"<span class='assignee'>...</span>" .
		"<span class='task_actions'><img class='task_back_action' src='media/images/back.png'/><img class='task_forward_action' src='media/images/forward.png'/></span>" .
	"</div></div>";

echo "<div id='deliverable_template' style='display:none'><span class='deliverable_description'></span></div>";

echo "</div>";

$states = array("backlog", "assigned", "in_progress", "done");
$deliverables_states = array("green", "yellow", "red");

echo "<div class='board_actions'><img class='add_project' src='media/images/add_project.png'/></div>".
	"<table class='taskboard'>";

foreach ($projects as $p) {
   	echo "<tr><td colspan='6' class='project_separator'></td></tr>" .
   		"<tr class='project_row' id='project-$p->id'>" .
       	"<td class='box project' rowspan='2'><div class='project_name'>$p->name</div>".
		"<div class='project_description'>" .
		$parser->transform($p->description) .
		"</div></td>";
	
	for ($state = 0; $state < 4; $state++) {
		echo "<td class='task_box box' id='project-$p->id-" . $states[$state] . "'>";
		foreach ($tasks as $t) {
			if ($t->project_id == $p->id && $t->status == $state &&
				($assignee_filter == $t->assignee_id || !$t->assignee_id || $assignee_filter == "")) {
				echo "<div id='task-$t->id' class='task " . $states[$state] .
					"'><span class='description'>" .
					$parser->transform($t->description) .
					"</span>" .
					"<div class='task_decorator'>" .
					"<span class='assignee'>";
				if ($t->assignee_id) {
					echo $assignees[$t->assignee_id]->name;
				} else {
					echo "...";
				}
				echo "</span>" .
					"<span class='task_actions'><img class='task_back_action' src='media/images/back.png'/><img class='task_forward_action' src='media/images/forward.png'/></span>" .
					"</div></div>";
			}
		}
		echo "</td>";
	}
	echo "<td class='box last_box'><div class='project_actions'>" . 
		"<img class='new_task_action' src='media/images/add.png'/>" .
		"<img class='clear_project_action' src='media/images/ok.png'/>" . 
		"</div></td></tr>";

	echo "<tr class='project_deliverables_row'><td class='deliverables_box' id='project-$p->id-deliverables' colspan='4'>";
	
	foreach ($deliverables as $d) {
		if ($d->project_id == $p->id) {
			echo "<div id='deliverable-$d->id' class='deliverable " .
				$deliverables_states[$d->status] ."'><span class='deliverable_description'>" .
				$parser->transform($d->description) . "</span>" .
				"<div class='deliverable_decorator'>" .
				"</div></div>";
		}
	}
	
	
	echo "</td><td class='deliverables_actions_box'><div class='project_deliverables_actions'>" . 
		"<img class='new_deliverable_action' src='media/images/add.png'/>" .
		"</div></td></tr>";
}

echo "<tr><td colspan='6' class='project_separator'></td></tr></table>";

echo "<div id='assignee_selection'><select id='assignee_selection_option'>";
echo "<option value='-1'>All</option>";
foreach ($assignees as $a) {
	echo "<option value='$a->id' ";
	if ($a->id == $assignee_filter) { echo "selected"; }
	echo ">$a->name</option>";
}
echo "</select></div>";

