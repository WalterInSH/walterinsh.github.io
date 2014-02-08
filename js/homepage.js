var width = $("#posts_stat").width();

var chart = d3.select("#posts_stat svg")
	.attr("width",width)
	.attr("height",500);

var bar = chart.selectAll("g")
	.data(blogData)
	.enter().append("g")
	.attr("transform", function(data,i) { return "translate("+ i * 30 +",0)"; });

bar.append("rect")
    .attr("width", 3)
    .attr("height", 40);
});*/

