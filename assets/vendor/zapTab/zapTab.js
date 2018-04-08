// Zap Tabs - Based on the Easy Responsive Tabs Plugin
// http://www.jqueryscript.net/accordion/Easy-Responsive-Tab-Accordion-Control-Plugin-For-jQuery.html

(function($) {
	$.fn.extend({
		zapTab: function(options) {
			//Set the default values, use comma to separate the settings, example:
			var defaults = {
				type: 'default', //default, vertical, accordion;
				width: 'auto',
				fit: true,
				closed: false,
				activate: function() {}
			}
			// Variables
			var options = $.extend(defaults, options);
			var opt = options,
				jtype = opt.type,
				jfit = opt.fit,
				jwidth = opt.width,
				vtabs = 'vertical',
				accord = 'accordion';

			// Events
			$(this).bind('tabactivate', function(e, currentTab) {
				if (typeof options.activate === 'function') {
					options.activate.call(currentTab, e)
				}
			});

			// Main function
			this.each(function() {
				var $respTabs = $(this);
				var $respTabsList = $respTabs.find('ul.m-tab-list');
				$respTabs.find('ul.m-tab-list li').addClass('m-tab-list__item');
				$respTabs.css({
					'display': 'block',
					'width': jwidth
				});

				$respTabs.find('.m-tab-container > div').addClass('m-tab-content');
				jtab_options();
				// Properties Function
				function jtab_options() {
					if (jtype == vtabs) {
						$respTabs.addClass('-side');
					}
					if (jfit == true) {
						$respTabs.css({
							width: '100%',
							margin: '0px'
						});
					}
					if (jtype == accord) {
						$respTabs.addClass('-accordion');
						$respTabs.find('.m-tab-list').css('display', 'none');
					}
				}

				// Assigning the h2 markup to accordion title
				var $tabItemh2;
				$respTabs.find('.m-tab-content').before("<div class='m-tab-container__tab' role='tab'><span class='m-tab-arrow'></span></div>");

				var itemCount = 0;
				$respTabs.find('.m-tab-container__tab').each(function() {
					$tabItemh2 = $(this);
					var innertext = $respTabs.find('.m-tab-list__item:eq(' + itemCount + ')').html();
					$respTabs.find('.m-tab-container__tab:eq(' + itemCount + ')').append(innertext);
					$tabItemh2.attr('aria-controls', 'tab_item-' + (itemCount));
					itemCount++;
				});

				// Assigning the 'aria-controls' to Tab items
				var count = 0,
					$tabContent;
				$respTabs.find('.m-tab-list__item').each(function() {
					$tabItem = $(this);
					$tabItem.attr('aria-controls', 'tab_item-' + (count));
					$tabItem.attr('role', 'tab');

					// First active tab, keep closed if option = 'closed' or option is 'accordion' and the element is in accordion mode 
					if (options.closed !== true && !(options.closed === 'accordion' && !$respTabsList.is(':visible')) && !(options.closed === 'tabs' && $respTabsList.is(':visible'))) {
						$respTabs.find('.m-tab-list__item').first().addClass('is-active');
						$respTabs.find('.m-tab-container__tab').first().addClass('is-active');
						$respTabs.find('.m-tab-content').first().addClass('is-active').attr('style', 'display:block');
					}

					// Assigning the 'aria-labelledby' attr to tab-content
					var tabcount = 0;
					$respTabs.find('.m-tab-content').each(function() {
						$tabContent = $(this);
						$tabContent.attr('aria-labelledby', 'tab_item-' + (tabcount));
						tabcount++;
					});
					count++;
				});

				// Tab Click action function
				$respTabs.find("[role=tab]").each(function() {
					var $currentTab = $(this);
					$currentTab.click(function() {

						var $tabAria = $currentTab.attr('aria-controls');

						// If whatever you're clicking on has the classes .m-accordian-tab && .is-active
						if ($currentTab.hasClass('m-tab-container__tab') && $currentTab.hasClass('is-active')) {
							$respTabs.find('.m-tab-content.is-active').slideUp('', function() {
								$(this).addClass('is-closed');
							});
							$currentTab.removeClass('is-active');
							return false;
						}
						// If whatever you're clicking on has the class .m-accordian-tab but NOT .is-active
						if ($currentTab.hasClass('m-tab-container__tab') && !$currentTab.hasClass('is-active')) {
							$respTabs.find('.m-tab-list__item.is-active').removeClass('is-active');
							$respTabs.find('.m-tab-container__tab.is-active').removeClass('is-active');
							$respTabs.find('.is-active').slideUp().removeClass('is-active is-closed');
							$respTabs.find("[aria-controls=" + $tabAria + "]").addClass('is-active');
							$respTabs.find('.m-tab-content[aria-labelledby = ' + $tabAria + ']').slideDown().addClass('is-active');
						} else {
							$respTabs.find('.is-active').removeClass('is-active');
							$respTabs.find('.m-tab-content').removeAttr('style').removeClass('is-active').removeClass('is-closed');
							$respTabs.find("[aria-controls=" + $tabAria + "]").addClass('is-active');
							$respTabs.find('.m-tab-content[aria-labelledby = ' + $tabAria + ']').addClass('is-active').attr('style', 'display:block');
						}
						//Trigger tab activation event
						$currentTab.trigger('tabactivate', $currentTab);
					});
					//Window resize function                   
					$(window).resize(function() {
						$respTabs.find('.is-closed').removeAttr('style');
					});
				});
			});
		}
	});
})(jQuery);