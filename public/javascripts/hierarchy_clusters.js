$(document).ready(function(){
	$('.nested-group').each(function(){
		var nestedGroup = $(this).attr('data-nested-group');
		var targetGroup = $("#"+nestedGroup);
		$(this).append(targetGroup);
	});

	// $('.graph-group:even').addClass('even');

	// $('.graph-group:odd').addClass('odd');

});