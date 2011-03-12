var task_states = {
  "backlog": {"next": "assigned", "previous": null},  
  "assigned": {"next": "in_progress", "previous": "backlog"},  
  "in_progress": {"next": "done", "previous": "assigned"},
  "done": {"next": null, "previous": "in_progress"}
};

function change_state(button, forward) {
    var project = button.closest(".project_row"), pid = project.attr("id");
    var task = button.closest(".task"), tid = task.attr("id").substr(5);
    var newState, state;
    
    for (state in task_states) {
        if (task.hasClass(state)) break;
    }
    
    newState = forward ? task_states[state].next : task_states[state].previous;
    if (newState) {
        task.removeClass(state);
        $("#" + pid + "-" + newState).append(task);
        task.addClass(newState);
        $.get("/CardBoard/board/move_task/" + tid + "/" + newState);
    }
}

$(document).ready(function() {
    $("img.task_forward_action").click(function(event) {
        change_state($(this), true);
    });

    $("img.task_back_action").click(function(event) {
        change_state($(this), false);
    });
    
    $(".assignee").click(function(event) {
        var dialog = $("#assign_dialog");
        $("#assign_dialog_assignee").text("Assignee");
        dialog.data("source", $(this));
        dialog.dialog('open');
    });
    
    $("#assign_dialog").dialog({
        title: "Assign",
        autoOpen: false,
        buttons: {
            "Ok": function() {
                var dialog = $(this);
                var source = dialog.data("source");
                dialog.dialog("close");
                if (source.closest(".task").hasClass("backlog")) change_state(source, true);
            }
        }
    });
});