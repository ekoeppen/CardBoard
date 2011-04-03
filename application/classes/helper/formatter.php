<?php defined('SYSPATH') or die('No direct script access.');

require MODPATH . "/userguide/vendor/markdown/markdown.php";

class Helper_Formatter extends MarkdownExtra_Parser {
	
	public function __construct()
	{
       	parent::__construct();
	}
	
	public function transform($text)
	{
		$html = parent::transform($text);
		return $html;
	}
}