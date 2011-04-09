<?php defined('SYSPATH') or die('No direct script access.');

class Controller_DefaultTemplate extends Controller_Template
{
	public $template = 'templates/default';

	/**
	* Initialize properties before running the controller methods (actions),
	* so they are available to our action.
	*/
	public function before()
	{
		// Run anything that need ot run before this.
		parent::before();

		if($this->auto_render)
		{
			// Initialize empty values
			$this->template->title            = '';
			$this->template->meta_keywords    = '';
			$this->template->meta_description = '';
			$this->template->meta_copywrite   = '';
			$this->template->header           = '';
			$this->template->content          = '';
			$this->template->footer           = '';
			$this->template->styles           = array(
												//'media/css/print.css' => 'print',
												'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.10/themes/base/jquery-ui.css' => 'screen',
												//'media/css/fonts.css' => 'screen',
												'media/css/colors-light.css' => 'screen',
												'media/css/layout.css' => 'screen'
												);
			$this->template->scripts          = array(
												'media/scripts/scripts.js',
												'media/scripts/jjquery.cookie-modified.js'
												//'media/js/jquery.inlineEdit.js',
												//'media/js/jquery.jeditable.js',
												);
		}
	}

	/**
	* Fill in default values for our properties before rendering the output.
	*/
	public function after()
	{
		if($this->auto_render)
		{
			// Define defaults
			$styles                  = array();
			$scripts                 = array(
										'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.10/jquery-ui.min.js',
										'http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js'
										);

			// Add defaults to template variables.
			$this->template->styles  = array_reverse(array_merge($this->template->styles, $styles));
			$this->template->scripts = array_reverse(array_merge($this->template->scripts, $scripts));
		}

		// Run anything that needs to run after this.
		parent::after();
	}
}
