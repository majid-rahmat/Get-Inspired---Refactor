$(document).ready( function() {
	$('.unanswered-getter').submit(function(e){
		e.preventDefault();
		$('.results').html('');
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});

    $('.inspiration-getter').submit(function(e){
    	e.preventDefault();
        $('.results').html('');
        var tag = $(this).find("input[name='answerers']").val();
        getInspiration(tag);
    });
});

	var getUnanswered = function(tags) {
		var request = {
		tagged: tags,
		site: 'stackoverflow',
		order: 'desc',
		sort: 'creation'};
	
	$.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET"
		})
	
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);
		$('.search-results').html(searchResults);
		
		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

var showQuestion = function(question) {
	var result = $('.templates .question').clone();
	
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" '+
		'href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
		question.owner.display_name +
		'</a></p>' +
		'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};

var getInspiration = function(tag) {
		var request = {
		tagged: tag,
		site: 'stackoverflow',
		order: 'desc',
		sort: 'creation'};
	
	$.ajax({
		url: "http://api.stackexchange.com/2.2/tags/" + tag + "/top-answerers/all_time",
		data: request,
		dataType: "jsonp",
		type: "GET"
		})
	
	.done(function(result){
		var searchResults = showSearchResults(tag, result.items.length);
		$('.search-results').html(searchResults);
		
		$.each(result.items, function(i, item) {
			var inspiration = showInspiration(item);
			$('.results').append(inspiration);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

var showInspiration = function(item){
	var result = $('.templates .inspiration').clone();
	var user = result.find('.user a')
	.attr('href', item.user.link)
		.text(item.user.display_name);
    var image = "<img src='" + item.user.profile_image + "' alt='" + item.user.display_name + "'>";
    $(user).append(image);
	result.find('.post-count').text(item.post_count);
	result.find('.score').text(item.score);

	return result;
};
