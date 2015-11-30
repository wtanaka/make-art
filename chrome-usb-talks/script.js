  setTimeout(function () {
  	document.getElementById("message").innerHTML = "Wait please...";
  	
  }, 2000);


chrome.runtime.onMessageExternal.addListener(
	  	function(request, sender, sendResponse) {
	  		document.getElementById("message").innerHTML = "Ricevuto";
	  		console.log("Message received");
	  		console.log(request);
	  		console.log(sender);
	  		sendResponse({result:"OK"});
	  	});