function checkLength(field) {
    if((field.length > 0) && (field.length < 8))
        return false;
    else
        return true;
};

function checkAlphanumeric(pass) {
    var lowercase = /[a-z]/;
    var uppercase = /[A-Z]/;
    var numbers = /[0-9]/;

    if((pass.match(lowercase) && pass.match(uppercase) && pass.match(numbers)) || (pass.length === 0)) {
        $('#message').text('');
        $('#newPassLabel').css('color', 'black');
        $('#newPass').css('border-color', '#ddd');
    }
    else {
        $('#message').text('Password must contain a mixture of uppercase characters, lowercase characters, and numbers.');
        $('#newPassLabel').css('color', 'red');
        $('#newPass').css('border-color', 'red');
    }
};

$(document).ready(() => {
    $('#userEdit').keyup(() => {
        var username = $('#userEdit').val();
        var query = {username: username};
        var validLength = false;

        validLength = checkLength(username);

        if(!validLength) {
            $('#message').text('New username must be at least 8 characters long.');
            $('#userEditLabel').css('color', 'red');
            $('#userEdit').css('border-color', 'red');
        }
        else {
            $.get('/findDuplicate', query, (found) => {
                if(found instanceof Object) {
                    $('#message').text('Username is already in use.');
                    $('#userEditLabel').css('color', 'red');
                    $('#userEdit').css('border-color', 'red');
                }
                else {
                    $('#message').text('')
                    $('#userEditLabel').css('color', 'black');
                    $('#userEdit').css('border-color', '#ddd');
                }
            });
        }
    });
    
    $('#newPass').keyup(() => {
        var currPass = $('#currPass').val();
        var newPass = $('#newPass').val();
        var validLength = false;

        validLength = checkLength(newPass);

        if(!validLength){
            $('#message').text('New password must be at least 8 characters long.');
            $('#newPassLabel').css('color', 'red');
            $('#newPass').css('border-color', 'red');
        }
        else {
            if((currPass === newPass) && (currPass !== '')) {
                $('#message').text('New password must not match the current password.');
                $('#newPassLabel').css('color', 'red');
                $('#newPass').css('border-color', 'red');
            }
            else {
                $('#message').text('');
                $('#newPassLabel').css('color', 'black');
                $('#newPass').css('border-color', '#ddd');
                checkAlphanumeric(newPass);
            }
        }

    });

    $('#confirmNewPass').keyup(() => {
        var pass = $('#newPass').val();
        var confirmPass = $('#confirmNewPass').val();
    
        if(pass !== confirmPass) {
            $('#message').text('New passwords must match.');
            $('#confirmNewPassLabel').css('color', 'red');
            $('#confirmNewPass').css('border-color', 'red');
        }
        else {
            $('#message').text('');
            $('#confirmNewPassLabel').css('color', 'black');
            $('#confirmNewPass').css('border-color', '#ddd');
        }
    });
});