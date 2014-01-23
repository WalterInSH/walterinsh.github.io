var big_bar_color = ['AA7BF0','9B43F4','8E0FF4','7B3CBD'];

$(function(){
	$("#posts>.big_bar").each(function(index){
		console.log(index);
		$(this).css({"background-color":"#"+big_bar_color[index]});
	});
});