/*var big_bar_color = ['7B3CBD','8E0FF4','9B43F4','AA7BF0'];

$(function(){
	$("#posts>.big_bar").each(function(index){
		console.log(index);
		$(this).css({"background-color":"#"+big_bar_color[index]});
	});
});*/

var width = $("#posts").width();

var chart = d3.select("#posts svg")
	.attr("width",width)
	.attr("height",500);

var bar = chart.selectAll("g")
	.data(blogData)
	.enter().append("g")
	.attr("transform", function(data,i) { return "translate("+ i * 30 +",0)"; });

bar.append("rect")
    .attr("width", 3)
    .attr("height", 40);