<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Task extends Controller_DefaultTemplate {

	public function action_index()
	{
	}
	
	public function action_description($id) {
		$task = ORM::factory("task", $id);
		$this->auto_render = FALSE;
		echo $task->description;
	}

}
