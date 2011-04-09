<?php defined('SYSPATH') or die('No direct script access.');

class Model_Project extends ORM {
	public static function max_position() {
		return DB::query(Database::SELECT, "SELECT MAX(position) FROM projects")->execute()->get("MAX(position)");
	}
}
