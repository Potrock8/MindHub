function checkLength(field) {
    if(field.length < 8)
        return false;
    else
        return true;
};

$(document).ready(() => {
    $('#currPass').keyup(() => {
        var password = $('#currPass').val();
        var validLength = false;

        validLength = checkLength(password);

        if(!validLength) {
            $('#message').text('Please enter your current password.');
            $('#currPassLabel').css('color', 'red');
            $('#currPass').css('border-color', 'red');
        }
        else {
            $('#message').text('');
            $('#currPassLabel').css('color', 'black');
            $('#currPass').css('border-color', '#ddd');
        }
    });
});