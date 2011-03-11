<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Welcome extends Controller_DefaultTemplate {

	public function action_index()
	{
		$project = ORM::factory('project', 1);
		$this->template->content = $project->name . ': ' . $project->description;
	}

} // End Welcome
