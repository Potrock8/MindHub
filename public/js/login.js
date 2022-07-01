function checkLength(field) {
    if(field.length < 8)
        return false;
    else
        return true;
};

$(document).ready(() => {
    $('#userLog').keyup(() => {
        var username = $('#userLog').val();
        var validLength = false;

        validLength = checkLength(username);

        if(!validLength) {
            $('#message').text('Usernames are between 8-16 characters.');
            $('#userLabel').css('color', 'red');
            $('#userLog').css('border-color', 'red');
        }
        else {
            $('#message').text('');
            $('#userLabel').css('color', 'black');
            $('#userLog').css('border-color', 'black');
        }
    });

    $('#password').keyup(() => {
        var password = $('#password').val();
        var validLength = false;

        validLength = checkLength(password);

        if(!validLength) {
            $('#message').text('Passwords are between 8-16 characters.');
            $('#passLabel').css('color', 'red');
            $('#password').css('border-color', 'red');
        }
        else {
            $('#message').text('');
            $('#passLabel').css('color', 'black');
            $('#password').css('border-color', 'black');
        }
    });
});