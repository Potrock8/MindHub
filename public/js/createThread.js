function checkLength(field) {
    if(field.length < 3)
        return false;
    else
        return true;
};

function onDisplay(link){
    var area;

    if(link === "text") {
      area = $('#contentArea');
      $('#imageVideoArea').css('display', 'none');
      
    } 
    else if(link === "imageVideo") {
      area = $('#imageVideoArea');
      $('#contentArea').css('display', 'none');
    } 
    if(area.css('display') === "none")
      area.css('display', 'block');
    else 
      area.css('display', 'none');
};

function clearText() {
    $('threadTitle').val('');
    $('threadContent').val('');
};

function clearImageVideo() {
    $('imageVideoArea').val('');
  }

$(document).ready(() => {
    $('#threadTitle').keyup(() => {
        var title = $('#threadTitle').val();
        var query = {title: title};
        var validLength = false;

        validLength = checkLength(title);

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

        validLength = checkLength(content);

        if(!validLength) {
            $('#threadContent').css('border-color', 'red');
            $('#message').text('Thread content must be at least 3 characters long');
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