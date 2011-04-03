<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Deliverable extends Controller_DefaultTemplate {

	public function action_index()
	{
	}
	
	public function action_description($id) {
		$deliverable = ORM::factory("deliverable", $id);
		$this->auto_render = FALSE;
		echo $deliverable->description;
	}

}
