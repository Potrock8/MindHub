$(document).ready(() => {
  //Write Comment
  $('#replyBtn').click(() => {
      if ($('#write-comment').css('display') === 'block') {
          // Comment is visible. hide it
          $('#write-comment').css('display','none');
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
  
  $('#submitBtn').click(() => {
      if($('#comment-text').val() === '')
          $('#message').text('Comment field must not be empty if you wish to post a comment.');     
  });
});