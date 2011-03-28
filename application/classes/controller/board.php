<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Board extends Controller_DefaultTemplate {

	static $states = array(
		"backlog" => 0,
		"assigned" => 1,
		"in_progress" => 2,
		"done" => 3
	);
	
	public function action_index()
	{
	    $this->template->title = 'CardBoard';
		$param =  array();
		$params['projects'] = ORM::factory("project")->find_all();
		$params['tasks'] = ORM::factory("task")->find_all();
		$params['deliverables'] = ORM::factory("deliverable")->find_all();
		$assignees = ORM::factory("person")->find_all();
		$params['assignees'] = array();
		foreach ($assignees as $a) {
			$params['assignees'][$a->id] = $a;
		}
		$this->template->content = View::factory('templates/board', $params);
	}
	
	public function action_move_task($id, $state)
	{
		$task = ORM::factory("task", $id);
		$task->status = Controller_Board::$states[$state];
		$task->save();
		$this->auto_render = FALSE;
		echo 1;
	}
	
	public function action_set_task_assignee($id, $assignee)
	{
		$task = ORM::factory("task", $id);
		$task->assignee_id = $assignee;
		$task->save();
		$this->auto_render = FALSE;
		echo 1;
	}

	public function action_set_task_description($id)
	{
		$task = ORM::factory("task", $id);
		$task->description = $_POST['description'];
		$task->save();
		$this->auto_render = FALSE;
		echo $task->id;
	}

	public function action_new_task($project)
	{
		$task = ORM::factory("task");
		$task->description = "";
		$task->project_id = $project;
		$task->description = $_POST['description'];
		$task->save();
		$this->auto_render = FALSE;
		echo $task->id;
	}

	public function action_set_deliverable_description($id)
	{
		$deliverable = ORM::factory("deliverable", $id);
		$deliverable->description = $_POST['description'];
		$deliverable->save();
		$this->auto_render = FALSE;
		echo $deliverable->id;
	}

	public function action_new_deliverable($project)
	{
		$deliverable = ORM::factory("deliverable");
		$deliverable->description = "";
		$deliverable->project_id = $project;
		$deliverable->status = 1;
		$deliverable->description = $_POST['description'];
		$deliverable->save();
		$this->auto_render = FALSE;
		echo $deliverable->id;
	}

	public function action_set_project_data($id)
	{
		$project = ORM::factory("project", $id);
		$project->description = $_POST['description'];
		$project->name = $_POST['name'];
		$project->save();
		$this->auto_render = FALSE;
		echo $project->id;
	}

	public function action_new_project()
	{
		$project = ORM::factory("project");
		$project->description = $_POST['description'];
		$project->name = $_POST['name'];
		$project->save();
		$this->auto_render = FALSE;
		echo $project->id;
	}

	public function action_delete_project($id)
	{
		$project = ORM::factory("project", $id);
		$project->delete();
		$this->auto_render = FALSE;
		echo $project->id;
	}

	public function action_clear_project($id)
	{
		DB::update('tasks')->where('project_id', '=', $id)->and_where('status', '=', 3)->set(array('status' => 4))->execute();
		$this->auto_render = FALSE;
		echo $id;
	}

}
