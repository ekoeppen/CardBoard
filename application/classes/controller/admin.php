<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Admin extends Controller {

	public static function check_credentials() {
		return ($_COOKIE['cardboard_login'] == file_get_contents(DOCROOT . "credentials"));
	}

	public function action_login($password)
	{
		setcookie('cardboard_login', $password, time() + 24 * 60 * 60 * 1000, "/CardBoard/");
		print "Login set: $password";
	}
}
