/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function(){// we wait until the client has loaded and contacted us that it is ready to go.

  socket.emit('answer',"Hey, Hello I am Jason, your couples therapy bot!"); //We start with the introduction;
  setTimeout(timedQuestion, 2500, socket,"What is your Name?"); // Wait a moment and respond with a question.

});
  socket.on('message', (data)=>{ // If we get a new message from the client we process it;
        console.log(data);
        questionNum= bot(data,socket,questionNum);	// run the bot function with the new message
      });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data,socket,questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

/// These are the main statments that make up the conversation.
  if (questionNum == 0) {
  answer= 'Hello ' + input + ' :-)';// output response
  waitTime =2000;
  question = 'what is your partner\'s name?';			    	// load next question
  }
  else if (questionNum == 1) {
  answer= input + '?  That\'s a lovely name.' ;// output response
  waitTime =2000;
  question =  'Where did ' + input  + ' and you meet?';			    	// load next question
  }
  else if (questionNum == 2) {
  answer= ' Cool! I have never been to ' + input+'.';
  waitTime =2000;
  question = 'How many years have you been together?';			    	// load next question
  }
  else if (questionNum == 3) {
  answer= input + ' years is longer than any relationship I have had!';
  waitTime = 2000;
  question = 'Do you want to break up with them?';			    	// load next question
  }
  else if (questionNum == 4) {
      if(input.toLowerCase()==='yes'|| input===1) {
          answer = 'I am sorry you two want to split up.  It happens!  Hopefully you can maintain being friends, but I totally get it if not.  I can recommend a good divorce lawyer, if you need.';
          waitTime = 10000;
          question = 'Would you like that?';
      }
      
      else if(input.toLowerCase()==='no'|| input===0) {
          answer = 'That is great! You two should totally get married! I can totally recommend a great wedding planner.  The time is now, do it!';
          waitTime = 10000;
          question = 'Would you like that?';
      }
      
      else {
          answer = 'I did not quite understand that, can say yes or no?';
          question = '';
          waitTime = 0;
          questionNum--;
      }
      
  // load next question
  }
  else{
    answer= 'That is all I can do for you, best of luck!';// output response
    waitTime =0;
    question = '';
  }


/// We take the changed data and distribute it across the required objects.
  socket.emit('answer',answer);
  setTimeout(timedQuestion, waitTime,socket,question);
  return (questionNum+1);
}

function timedQuestion(socket,question) {
  if(question!=''){
  socket.emit('question',question);
}
  else{
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
