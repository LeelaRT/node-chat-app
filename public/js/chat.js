var socket = io();

socket.on('connect', function(){
  console.log('Connected to Server');

          // socket.emit('createEmail', {
          //     to: 'bhuvana@example.com',
          //     text: 'Hi am good..hru?'
          //   });

//REMOVE EMIT CALLS FROM BOTH SERVER.JS AND INDEX.JS - index.js - DONE
          // socket.emit('createMessage',{
          //   from:'bhuvana',
          //   text: 'hi..hru?'
          // });
    var params = jQuery.deparam(window.location.search);
    console.log('Client: Params - ', JSON.stringify(params, undefined,2));
    socket.emit('join', params, function(err){
      if(err) {
        alert(err);
        window.location.href= '/';
      }
      else {
        console.log('No Error');
      }
    });
});

socket.on('updateUsersList', function(users){
  var ul = jQuery('<ul></ul>');
  users.forEach(function(user){
    ul.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ul);
});
socket.on('disconnect', function(){
  console.log('Disconnected from server!');
});

// socket.on('newEmail', function(email){
//   console.log(email);
// });

function scrollToBottom(){
  //Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  //Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');

  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}

socket.on('newMessage', function(msg){
  console.log('New Message: ',msg);
  var formattedTime = moment(msg.createdAt).format('h:mm a');

  // var li = jQuery('<li></li>');
  // li.html(`${msg.from} <em>${formattedTime}</em> : ${msg.text}`);
  // jQuery('#messages').append(li);
  var template = jQuery('#message-template').html();
  var html =  Mustache.render(template,{
    text:msg.text,
    from: msg.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function(UserWithLatAndLong){
  console.log(JSON.stringify(UserWithLatAndLong, undefined,2));
  var formattedTime = moment(UserWithLatAndLong.createdAt).format('h:mm a');

  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">My current Location</a>');
  // a.attr('href',UserWithLatAndLong.url);
  // li.text(`${UserWithLatAndLong.from} ${formattedTime} : `).append(a);

  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: UserWithLatAndLong.from,
    url: UserWithLatAndLong.url,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#frmMessage').on('submit', function(e){
  e.preventDefault();

  // var messageTextBox = jQery('[name=message]');
  // console.log(messageTextBox.val());

  socket.emit('createMessage', {
    // from: 'User',
    text: jQuery('[name=message]').val()
  }, function(){
      jQuery('[name=message]').val('');
  });
});

var btnSendLocation = jQuery('#btnSendLocation');
btnSendLocation.on('click', function(){
  if(!navigator.geolocation) {
    return alert('Geo location not supported by your browser');
  }
  btnSendLocation.attr('disabled','disabled').text('Sending location...');
  navigator.geolocation.getCurrentPosition( function(position){
    btnSendLocation.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', { latitude: position.coords.latitude, longitude : position.coords.longitude});
  }, function(){
    btnSendLocation.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location');
  } );

});

// socket.emit('createMessage', { from: 'Frank', text: 'Hi..' }, function(serverResponse){
//   console.log('Got it, ', serverResponse);
// });
