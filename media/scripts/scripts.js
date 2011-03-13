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

function open_assignee_dialog(button) {
    var dialog = $("#assign_dialog");
    dialog.data("source", button);
    dialog.dialog('open');
}

function open_edit_task_dialog(task) {
    var dialog = $("#edit_task_dialog");
    dialog.find("#edit_task_description").val(task.text());
    dialog.data("source", task);
    dialog.dialog('open');
}

$(document).ready(function() {
    $("img.task_forward_action").click(function(event) {
        change_state($(this), true);
    });

    $("img.task_back_action").click(function(event) {
        change_state($(this), false);
    });
    
    $(".assignee").click(function(event) {
        open_assignee_dialog($(this));
    });
    
    $(".description").click(function(event) {
        open_edit_task_dialog($(this));
    });
    
    $("img.new_task_action").click(function(event) {
        var dialog = $("#new_task_dialog");
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
                var task = source.closest(".task");
                var tid = task.attr("id").substr(5);
                
                $.get("/CardBoard/board/set_assignee/" + tid + "/" + $("#assign_dialog_assignee").attr("value"));
                task.find(".assignee").text($("#assign_dialog_assignee option:selected").text());
                dialog.dialog("close");
                if (task.hasClass("backlog")) {
                    change_state(source, true);
                }
            }
        }
    });

    $("#new_task_dialog").dialog({
        title: "New Task",
        autoOpen: false,
        width: 400,
        buttons: {
            "Ok": function() {
                var dialog = $(this);
                var source = dialog.data("source");
                var pid = source.closest(".project_row").attr("id").substr(8);
                var description = dialog.find("#new_task_description").val();
                var task = $("#task_template").clone();
                
                task.find("img.task_forward_action").click(function(event) {
                    change_state($(this), true);
                });

                task.find("img.task_back_action").click(function(event) {
                    change_state($(this), false);
                });

                task.find(".assignee").click(function(event) {
                    open_assignee_dialog($(this));
                });
                
                task.find(".description").click(function(event) {
                    open_edit_task_dialog($(this));
                });
                
                task.find(".description").text(description);

                $.ajax({
                    url: "/CardBoard/board/new_task/" + pid,
                    type: 'POST',
                    data: {description: description},
                    success: function(data, status, query) {
                        var tid = data;
                        task.attr({id: 'task-' + tid, 'class': 'task backlog'});
                        task.removeAttr('style');

                        dialog.dialog("close");
                        $("#project-" + pid + "-backlog").append(task);
                    }
                });
            }
        }
    });

    $("#edit_task_dialog").dialog({
        title: "Edit Task",
        autoOpen: false,
        width: 400,
        buttons: {
            "Ok": function() {
                var dialog = $(this);
                var source = dialog.data("source");
                var task = source.closest(".task");
                var tid = task.attr("id").substr(5);
                var description = dialog.find("#edit_task_description").val();
                
                task.find(".description").text(description);

                $.ajax({
                    url: "/CardBoard/board/set_description/" + tid,
                    type: 'POST',
                    data: {description: description},
                    success: function(data, status, query) {
                        dialog.dialog("close");
                    }
                });
            }
        }
    });
});