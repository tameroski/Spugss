(function() {
	'use strict';

	document.addEventListener('DOMContentLoaded', function() {

		// IE Hack
		if (navigator.userAgent.indexOf("MSIE") > -1) {
			document.body.classList.add("ie");
		}

	});
}());
