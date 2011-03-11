<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Welcome extends Controller {

	public function action_index()
	{
		$project = ORM::factory('project', 1);
		echo $project->name . ' ' . $project->description;
	}

} // End Welcome
