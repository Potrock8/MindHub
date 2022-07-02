$(document).ready(() => {
//Write Comment
$('#replyBtn').click(() => {
    if ($('#write-comment').css('display') === 'block') {
        // Comment is visible. hide it
        $('#write-comment').css('display','none');
        // erase text area
        $('#comment-text1').val('');
      }
      else{
        // Comment is hidden. show it
        $('#write-comment').css('display','block');
      }
});

//Cancel Writing Comment
$('#cancelBtn').click(() => {
    if ($('#write-comment').css('display') === 'block') {
        // Comment is visible. hide it
        $('#write-comment').css('display','none');
        // erase text area
        $('#comment-text').val('');
      }
});

//Edit
$('#editBtn').click(() => {
    $('#thread-edit').attr('contenteditable','true');
    $('#thread-edit').css('backgroundcolor','white');
    $('#thread-edit').css('color','black');
    $('#doneBtn').css('display','block');
});

//Done
$('#doneBtn').click(() => {
    $('#thread-edit').attr('contenteditable','false');
    $('#thread-edit').css('backgroundcolor','white');
    $('#doneBtn').css('display','none');
  });

//Delete 
/* CHANGE
  $('#deleteBtn').click(() => {
    var thread = document.getElementById("sub-container");
    var main = document.getElementById("main-container")
    thread.remove();
    var p = document.createElement("p");
    var text = document.createTextNode("This thread has been deleted.");
    p.appendChild(text);
    main.appendChild(p);
  });
  */

$('#submitBtn').click(() => {
    if($('#comment-text').val() === '')
        $('#message').text('Comment field must not be empty if you wish to post a comment.');
    else
        $('#comment-text').val('');
});
});