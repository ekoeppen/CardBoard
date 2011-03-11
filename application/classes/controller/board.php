<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Board extends Controller_DefaultTemplate {

	public function action_index()
	{
		$param =  array();
		$params['projects'] = ORM::factory("project")->find_all();
		$this->template->content = View::factory('templates/board', $params);
	}

} // End Welcome
