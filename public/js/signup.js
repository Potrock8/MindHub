function checkLength(field) {
    if(field.length < 8)
        return false;
    else
        return true;
};

function checkEmail(email) {
    var emailFormat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if(!email.match(emailFormat)) {
        $('#message').text('Invalid email address.');
        $('#emailLabel').css('color', 'red');
        $('#emailAddress').css('border-color', 'red');

        return false;
    }
    else {
        $('#message').text('');
        $('#emailLabel').css('color', 'black');
        $('#emailAddress').css('border-color', 'black');

        return true;
    }
};

function checkAlphanumeric(pass) {
    var lowercase = /[a-z]/;
    var uppercase = /[A-Z]/;
    var numbers = /[0-9]/;

    if(pass.match(lowercase) && pass.match(uppercase) && pass.match(numbers)) {
        $('#message').text('');
        $('#passLabel').css('color', 'black');
        $('#pass').css('border-color', 'black');
    }
    else {
        $('#message').text('Password must contain a mixture of uppercase characters, lowercase characters, and numbers.');
        $('#passLabel').css('color', 'red');
        $('#pass').css('border-color', 'red');
    }
};

$(document).ready(() => {
    $('#user').keyup(() => {
        var user = $('#user').val();
        var query = {username: user};
        var validLength = false;

        validLength = checkLength(user);

        if(!validLength) {
            $('#message').text('Username must be between 8-16 characters.');
            $('#userLabel').css('color', 'red');
            $('#user').css('border-color', 'red');
        }
        else {
            $.get('/findDuplicate', query, (found) => {
                if(found instanceof Object) {
                    $('#message').text('Username is already in use.');
                    $('#userLabel').css('color', 'red');
                    $('#user').css('border-color', 'red');
                }
                else {
                    $('#message').text('')
                    $('#userLabel').css('color', 'black');
                    $('#user').css('border-color', 'black');
                }
            });
        }
    });

    $('#emailAddress').keyup(() => {
        var email = $('#emailAddress').val();
        var query = {emailAddress: email};
        var validEmail = false;

        validEmail = checkEmail(email);

        if(validEmail) {
            $.get('/findDuplicate', query, (found) => {
                if(found instanceof Object) {
                    $('#message').text('Email Address is already in use.')
                    $('#emailLabel').css('color', 'red');
                    $('#emailAddress').css('border-color', 'red');
                }
                else {
                    $('#message').text('')
                    $('#emailLabel').css('color', 'black');
                    $('#emailAddress').css('border-color', 'black');
                }
            });
        }
    });

    $('#pass').keyup(() => {
        var pass = $('#pass').val();
        var validLength = false;

        validLength = checkLength(pass);

        if(!validLength) {
            $('#message').text('Password must be between 8-16 characters.');
            $('#passLabel').css('color', 'red');
            $('#pass').css('border-color', 'red');
        }
        else {
            $('#message').text('');
            $('#passLabel').css('color', 'black');
            $('#pass').css('border-color', 'black');
            checkAlphanumeric(pass);
        }
    });

    $('#confirmPass').keyup(() => {
        var pass = $('#pass').val();
        var confirmPass = $('#confirmPass').val();
    
        if(pass !== confirmPass) {
            $('#message').text('Passwords do not match.');
            $('#confirmLabel').css('color', 'red');
            $('#confirmPass').css('border-color', 'red');
        }
        else {
            $('#message').text('');
            $('#confirmLabel').css('color', 'black');
            $('#confirmPass').css('border-color', 'black');
        }
    });
});