$(document).ready(function(){
	$('.group').each(function(){
		if ( !$(this).hasClass('odd') && !$(this).hasClass('even')) {
			$(this).addClass('odd');
		} 
	});
	$('.nested-group').each(function(){
		var oddOrEven = $(this).parent().hasClass('odd') ? 'even': 'odd';
		var nestedGroup = $(this).attr('data-nested-group');
		var targetGroup = $("#"+nestedGroup);
		targetGroup.addClass(oddOrEven);
		$(this).append(targetGroup);
	});


	// $('.graph-group:even').addClass('even');

	// $('.graph-group:odd').addClass('odd');

});