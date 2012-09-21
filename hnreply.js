var postLoc = "http://news.ycombinator.com/r"

$('a[href^="reply?"]').click(function(e) {
	e.preventDefault();
	$(this).hide();
	link = 'http://news.ycombinator.com/' + $(this).attr('href');
	$(this).after(
		'<div class="replyform" style="width:300px;height:100px;position:relative;"> \
		<textarea rows="4" cols="60" style="height:60px;" /> \
		<input type ="submit" value="Reply" class="rbutton" \
		 style="position:absolute;bottom:0px;left:0px;" /> \
		</div>'
	);
	$(this).parent().find('.rbutton').attr('data', link);
});

$('.rbutton').live('click', function(e) {
	e.preventDefault();
	link = $(this).attr('data');
	text = $(this).prev().val();
	postCommentTo(link, text);
});

function postCommentTo(link, text) {
	$.ajax({
		accepts: "text/html",
		url : link
	}).success(function(html) {
		input = $(html).find('input');
		fnid = input.attr('value');
		sendComment(fnid, text);
	});
}

function sendComment(fnidarg, textarg) {
	$.post(
		postLoc, 
		{fnid : fnidarg, text: textarg }
	).complete(function(a) {
		window.location.reload(true);
	});
}
