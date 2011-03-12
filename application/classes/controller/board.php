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
		$this->template->content = View::factory('templates/board', $params);
	}
	
	public function action_move_task($id, $state)
	{
		$task = ORM::factory("task", $id);
		$task->status = Controller_Board::$states[$state];
		$task->save();
		echo 1;
	}

} // End Welcome
