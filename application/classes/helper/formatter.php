<?php defined('SYSPATH') or die('No direct script access.');

require MODPATH . "/userguide/vendor/markdown/markdown.php";

class Helper_Formatter extends MarkdownExtra_Parser {
	
	public function __construct()
	{
       	parent::__construct();
	}
	
	public function transform($text)
	{
		$text = preg_replace_callback('/{{include:\s*([^}]*)}}/', 
			create_function('$matches', 'return Curl::get($matches[1]);'),	$text);

		$html = parent::transform($text);
		return $html;
	}
}