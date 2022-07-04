function checkLength(field, length) {
    if(field.length < length)
        return false;
    else
        return true;
};

function clearText() {
    $('#threadTitle').val('');
    $('#threadContent').val('');
};
$(document).ready(() => {
    $('#threadTitle').keyup(() => {
        var title = $('#threadTitle').val();
        var query = {title: title};
        var validLength = false;

        validLength = checkLength(title, 3);

        if(!validLength) {
            $('#threadTitle').css('border-color', 'red');
            $('#message').text('Title must be at least 3 characters long');
        }
        else {
            $.get('/findDuplicateTitle', query, (found) => {
                if(found instanceof Object) {
                    $('#threadTitle').css('border-color', 'red');
                    $('#message').text('Title is already in use. Please try a different title.');
                }
                else {
                    $('#message').text('')
                    $('#threadTitle').css('border-color', '#ddd');
                }
            });
        }
    });

    $('#threadContent').keyup(() => {
        var content = $('#threadContent').val();
        var validLength = false;

        validLength = checkLength(content, 1);

        if(!validLength) {
            $('#threadContent').css('border-color', 'red');
            $('#message').text('Thread content must be at least 1 character long');
        }
        else {
            $('#message').text('')
            $('#threadContent').css('border-color', '#ddd');
        }
    });

    $('#cancelBtn').click(() => {
        clearText();
    })
});