function checkCommentLength(comment) {
    if(comment.length < 1)
        return false;
    else
        return true;    
};

$(document).ready(() => { 
    $('#commentContent').keyup(() => {
        var content = $('#commentContent').val();
        var validLength = false;

        validLength = checkCommentLength(content);

        if(!validLength) {
            $('#commentContent').css('border-color', 'red');
            $('#message').text('Comment content must be at least 1 character long');
        }
        else {
            $('#message').text('')
            $('#commentContent').css('border-color', '#ddd');
        }
    });
});
