<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Project extends Controller_DefaultTemplate {

	public function action_index()
	{
	}

	public function action_description($id) {
		$project = ORM::factory("project", $id);
		$this->auto_render = FALSE;
		echo $project->description;
	}
}
