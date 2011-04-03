var task_states = {
  "backlog": {"next": "assigned", "previous": null},  
  "assigned": {"next": "in_progress", "previous": "backlog"},  
  "in_progress": {"next": "done", "previous": "assigned"},
  "done": {"next": null, "previous": "in_progress"}
};

var deliverable_states = ["green", "yellow", "red"];

function get_sync(model, field, id) {
    var r = "";

    jQuery.ajax({
        url: "/CardBoard/" + model + "/"  + field +  "/" + id,
        async: false,
        success:function(html) { r = html; }
    });
    return r;
}

function format(text) {
    var r = "";

    jQuery.ajax({
        url: "/CardBoard/board/format",
        type: 'POST',
        data: {text: text},
        async: false,
        success:function(html) { r = html; }
    });
    return r;
}

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
    dialog.find("#edit_task_description").val(get_sync("task", "description", task.parent().attr("id").substr(5)));
    dialog.data("source", task);
    dialog.dialog('open');
}

function open_edit_deliverable_dialog(deliverable) {
    var dialog = $("#edit_deliverable_dialog");
    dialog.find("#edit_deliverable_description").val(get_sync("deliverable", "description", deliverable.attr("id").substr(12)));
    dialog.find("option").removeAttr('selected');
    if (deliverable.hasClass("green")) {
        dialog.find("#edit_deliverable_status_green").attr('selected', 1);
    } else if (deliverable.hasClass("yellow")) {
        dialog.find("#edit_deliverable_status_yellow").attr('selected', 1);
    } else if (deliverable.hasClass("red")) {
        dialog.find("#edit_deliverable_status_red").attr('selected', 1);
    }
    dialog.data("source", deliverable);
    dialog.dialog('open');
}

function open_edit_project_dialog(project_field) {
    var dialog = $("#edit_project_dialog");
    var project = project_field.parent();
    dialog.find("#edit_project_name").val(project.find(".project_name").text());
    dialog.find("#edit_project_description").val(get_sync("project", "description", project.parent().attr("id").substr(8)));
    dialog.data("source", project);
    dialog.dialog('open');
}

function open_add_project_dialog(project) {
    var dialog = $("#add_project_dialog");
    dialog.data("source", project);
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
    
    $(".deliverable_description").click(function(event) {
        open_edit_deliverable_dialog($(this).parent());
    });

    $(".project_name").click(function(event) {
       open_edit_project_dialog($(this));
    });
    
    $(".project_description").click(function(event) {
       open_edit_project_dialog($(this));
    });
    
    $("img.new_task_action").click(function(event) {
        var dialog = $("#new_task_dialog");
        dialog.data("source", $(this));
        dialog.find("#new_task_description").val("");
        dialog.dialog('open');
    });
    
    $("img.new_deliverable_action").click(function(event) {
        var dialog = $("#new_deliverable_dialog");
        dialog.find("#new_deliverable_description").val("");
        dialog.data("source", $(this));
        dialog.dialog('open');
    });
    
    $("img.delete_project_action").click(function(event) {
        if (confirm("Delete project?")) {
            var pid = $(this).closest(".project_row").attr("id").substr(8);
            $.get("/CardBoard/board/delete_project/" + pid);
            var project = $("#project-" + pid);
            project.prev().remove();
            project.remove();
        }
    });
    
    $("img.clear_project_action").click(function(event) {
        if (confirm("Clear done tasks?")) {
            var pid = $(this).closest(".project_row").attr("id").substr(8);
            $.get("/CardBoard/board/clear_project/" + pid);
            $("#project-" + pid + "-done div.task.done").remove();
        }
    });
    
    $("img.add_project").click(function(event) {
        open_add_project_dialog($(this));
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
                
                $.get("/CardBoard/board/set_task_assignee/" + tid + "/" + $("#assign_dialog_assignee").attr("value"));
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
                
                task.find(".description").html(format(description));

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
            "Delete": function() {
                var dialog = $(this);
                var source = dialog.data("source");
                var task = source.closest(".task");
                var tid = task.attr("id").substr(5);
                
                $.ajax({
                    url: "/CardBoard/board/delete_task/" + tid,
                    type: 'POST',
                    success: function(data, status, query) {
                        dialog.dialog("close");
                        task.remove();
                    }
                });
            },
            "Ok": function() {
                var dialog = $(this);
                var source = dialog.data("source");
                var task = source.closest(".task");
                var tid = task.attr("id").substr(5);
                var description = dialog.find("#edit_task_description").val();
                
                task.find(".description").html(format(description));

                $.ajax({
                    url: "/CardBoard/board/set_task_description/" + tid,
                    type: 'POST',
                    data: {description: description},
                    success: function(data, status, query) {
                        dialog.dialog("close");
                    }
                });
            }
        }
    });
    
    $("#new_deliverable_dialog").dialog({
        title: "New Deliverable",
        autoOpen: false,
        width: 400,
        buttons: {
            "Ok": function() {
                var dialog = $(this);
                var source = dialog.data("source");
                var pid = source.closest("tr").prev(".project_row").attr("id").substr(8);
                var description = dialog.find("#new_deliverable_description").val();
                var deliverable = $("#deliverable_template").clone();
                
                deliverable.find(".deliverable_description").click(function(event) {
                    open_edit_deliverable_dialog($(this));
                });
                
                deliverable.find(".deliverable_description").html(format(description));

                $.ajax({
                    url: "/CardBoard/board/new_deliverable/" + pid,
                    type: 'POST',
                    data: {description: description},
                    success: function(data, status, query) {
                        var did = data;
                        deliverable.attr({id: 'deliverable-' + did, 'class': 'deliverable yellow'});
                        deliverable.removeAttr('style');

                        dialog.dialog("close");
                        $("#project-" + pid + "-deliverables").append(deliverable);
                    }
                });
            }
        }
    });

    $("#edit_deliverable_dialog").dialog({
        title: "Edit Deliverable",
        autoOpen: false,
        width: 400,
        buttons: {
            "Delete": function() {
                var dialog = $(this);
                var deliverable = dialog.data("source");
                var did = deliverable.attr("id").substr(12);
                
                $.ajax({
                    url: "/CardBoard/board/delete_deliverable/" + did,
                    type: 'POST',
                    success: function(data, status, query) {
                        dialog.dialog("close");
                        deliverable.remove();
                    }
                });
            },
            "Ok": function() {
                var dialog = $(this);
                var deliverable = dialog.data("source");
                var did = deliverable.attr("id").substr(12);
                var description = dialog.find("#edit_deliverable_description").val();
                var status = dialog.find("#edit_deliverable_status :selected").attr('value');
                
                deliverable.find(".deliverable_description").html(format(description));
                deliverable.removeClass('yellow');
                deliverable.removeClass('green');
                deliverable.removeClass('red');
                deliverable.addClass(deliverable_states[status]);

                $.ajax({
                    url: "/CardBoard/board/set_deliverable_values/" + did,
                    type: 'POST',
                    data: {description: description, status: status},
                    success: function(data, status, query) {
                        dialog.dialog("close");
                    }
                });
            }
        }
    });
    
    $("#edit_project_dialog").dialog({
        title: "Edit Project",
        autoOpen: false,
        width: 400,
        buttons: {
            "Delete": function() {
                var dialog = $(this);
                if (confirm("Delete project?")) {
                    var project = dialog.data("source");
                    var pid = project.closest(".project_row").attr('id').substr(8);

                    $.get("/CardBoard/board/delete_project/" + pid);

                    project = $("#project-" + pid);
                    project.prev().remove();
                    project.next().remove();
                    project.remove();
                }
                dialog.dialog("close");
            },
            "Ok": function() {
                var dialog = $(this);
                var project = dialog.data("source");
                var name = dialog.find("#edit_project_name").val();
                var description = dialog.find("#edit_project_description").val();
                var pid = project.closest(".project_row").attr('id').substr(8);
                
                project.find(".project_name").text(name);
                project.find(".project_description").html(format(description));

                $.ajax({
                    url: "/CardBoard/board/set_project_data/" + pid,
                    type: 'POST',
                    data: {description: description, name: name},
                    success: function(data, status, query) {
                        dialog.dialog("close");
                    }
                });
            }
        }
    });

    $("#add_project_dialog").dialog({
        title: "Add Project",
        autoOpen: false,
        width: 400,
        buttons: {
            "Ok": function() {
                var dialog = $(this);
                var project = dialog.data("source");
                var name = dialog.find("#edit_project_name").val();
                var description = dialog.find("#edit_project_description").val();
                
                $.ajax({
                    url: "/CardBoard/board/new_project",
                    type: 'POST',
                    data: {description: description, name: name},
                    success: function(data, status, query) {
                        dialog.dialog("close");
                        window.location.reload();
                    }
                });
            }
        }
    });
});
