var task_states = {
  "backlog": {"next": "assigned", "previous": null},  
  "assigned": {"next": "in_progress", "previous": "backlog"},  
  "in_progress": {"next": "done", "previous": "assigned"},
  "done": {"next": null, "previous": "in_progress"}
};

function change_state(button, forward) {
    var project = button.closest(".project_row"), id = project.attr("id");
    var task = button.parent().parent();
    var newState, state;
    
    for (state in task_states) {
        if (task.hasClass(state)) break;
    }
    
    newState = forward ? task_states[state].next : task_states[state].previous;
    if (newState) {
        task.removeClass(state);
        $("#" + id + "-" + newState).append(task);
        task.addClass(newState);
    }
}

$(document).ready(function() {
    $("img.task_forward_action").click(function(event) {
        change_state($(this), true);
    });

    $("img.task_back_action").click(function(event) {
        change_state($(this), false);
    });
    
    $("img.task_assign_action").click(function(event) {
        $("#assign_dialog").dialog('open');
    });
    
    $("#assign_dialog").dialog({
        autoOpen: false,
        buttons: {
            "Ok": function() { $(this).dialog("close"); }
        }
    });
});