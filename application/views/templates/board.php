<?php
echo "<div id='assign_dialog'>Assign to: <select name='assignee_dialog_select' id='assign_dialog_assignee'>";
foreach ($assignees as $i => $a) {
	echo "<option value='$i'>" . $a->name . "</option>";
}
echo "</select></div>";

echo "<div id='new_task_dialog'>Description:
<textarea id='new_task_description' cols=32 rows=8></textarea>
</div>";

echo "<div id='edit_task_dialog'>Description:
<textarea id='edit_task_description' cols=32 rows=8></textarea>
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

$states = array("backlog", "assigned", "in_progress", "done");

echo "<div class='board_actions'><img class='add_project' src='media/images/add_project.png'/></div><table class='taskboard'>";

foreach ($projects as $p) {
   	echo "<tr><td colspan='6' class='project_separator'></td></tr>" .
   		"<tr class='project_row' id='project-$p->id'>" .
       	"<td class='box project'><div class='project_name'>$p->name</div><div class='project_description'>$p->description</div>" .
		"</td>";
	
	for ($state = 0; $state < 4; $state++) {
		echo "<td class='box' id='project-$p->id-" . $states[$state] . "'>";
		foreach ($tasks as $t) {
			if ($t->project_id == $p->id && $t->status == $state) {
				echo "<div id='task-$t->id' class='task " . $states[$state] . "'><span class='description'>" . $t->description . "</span>" .
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
		"<img class='delete_project_action' src='media/images/delete.png'/>" . 
		"</div></td>";

   	echo "</tr>";
}

echo "</table>";

