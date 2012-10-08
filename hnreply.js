/*
* 
* Hacker News Inline Reply
* Samuel Stern / http://samuelstern.wordpress.com/
*
* Thanks to Chris James for some of this code
*
*/

var InlineReply = {
  init: function() {
    $('a[href^="reply?"]').click(function(e) {
      e.preventDefault();

      //make sure there's no stray underlining between Reply and Cancel
      $(this).addClass('underlined');
      $(this).parent('u').replaceWith($(this));

      /*remove the 'reply' link without actually hide()ing it because it
        doesn't work that way with collapsible comments*/
      $(this).addClass('no-font-size');

      domain = window.location.origin;
      link = domain + '/' + $(this).attr('href');

      if ($(this).next().hasClass('replyform')) {
        $(this).next().show();
      }
      else {
        //add buttons and box
        $(this).after(
          '<div class="reply_form"> \
          <textarea rows="4" cols="60"/> \
          <input type="submit" value="Reply" class="rbutton"/> \
          <input type="submit" value="Cancel" class="cbutton"/> \
          </div>'
        );
        $(this).parent().find('.rbutton').attr('data', link);
      }
    });

    $('.rbutton').live('click', function(e) {
      e.preventDefault();
      link = $(this).attr('data');
      text = $(this).prev().val();
      InlineReply.postCommentTo(link, domain, text, $(this));
    });
    
    $('.cbutton').live('click', function(e) {
      InlineReply.hideButtonAndBox($(this).prev());
    });
  },

  postCommentTo: function(link, domain, text, button) {
    InlineReply.disableButtonAndBox(button);
    $.ajax({
      accepts: "text/html",
      url: link
    }).success(function(html) {
      input = $(html).find('input');
      fnid = input.attr('value');
      InlineReply.sendComment(domain, fnid, text);
    }).error(function(xhr, status, error) {
      InlineReply.enableButtonAndBox(button);
    });
  },

  sendComment: function(domain, fnidarg, textarg) {
    $.post(
      domain + "/r", 
      {fnid : fnidarg, text: textarg }
    ).complete(function(a) {
      window.location.reload(true);
    }); 
  },

  disableButtonAndBox: function(button) {
    button.attr('disabled', 'disabled');
    button.next().attr('disabled', 'disabled');
    button.prev().attr('disabled', 'disabled');
  },

  enableButtonAndBox: function(button) {
    button.removeAttr('disabled');
    button.next().removeAttr('disabled');
    button.prev().removeAttr('disabled');
  },
  
  hideButtonAndBox: function(button) {
    button.parent().prev().removeClass('no-font-size');
    button.parent().hide();
  }
}

InlineReply.init();
