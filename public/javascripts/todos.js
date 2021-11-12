// Check Off Specific Todos By Clicking
$("ul").on("click", "li", function(){
	$(this).toggleClass("completed");
});

//Click on X to delete Todo
$("ul").on("click", "span", function(event){
	
	// let clickedElement = event.target;
	// let item = clickedElement.parentElement.textContent;
  
	//the spaces are replaced with not spaces
  
	$(this).parent().fadeOut(500,function(){
		$(this).remove();
		window.location.reload();
	});
	

	// fetch('/todo/' + item, {
	// 	method: 'DELETE',
	// 	headers: {
	// 	  'Content-Type': 'application/json',
	// 	}
	//   });
	//.then(response => response.json()
	// 	  .then(data => {
	// 		return data;
	// 	  })
	// 	);
	
});

$("input[type='text']").keypress(function(event){
	if(event.which === 13){
		//grabbing new todo text from input
		var todoText = $(this).val();
		// $(this).val("");
		//create a new li and add to ul
		document.getElementById("form-todo").submit();
	}
});

$(".fa-plus").click(function(){
	$("input[type='text']").fadeToggle();
});

var col= document.getElementsByClassName("a2-todo");
var c=0;

function changeColor(){
	var ch='#3ba8a5';
	if(c){
		ch='lightpink';
	}
     c=!c;
	col[0].style.backgroundColor= ch;
  }
  
  setInterval(changeColor,1000);