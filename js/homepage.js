$.get( "/tags.json", function( data ) {
    // add tags
    $.each(data, function (index,tag) {
        $("#blog_tags").append("<span class=\"tag\">" + tag + "</span>");
    });

    //bind click event onto tags
    $("#blog_tags .tag").each(function(){
        var tag = $(this).text();
        $(this).bind("click", function () {
            window.location = "https://www.google.com/search?q=site:faolou.me" + encodeURIComponent(" "+tag);
        });
    });
});