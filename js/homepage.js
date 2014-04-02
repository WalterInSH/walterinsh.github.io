$.get( "/tags.json", function( data ) {
    // add tags
    $.each(data, function (index,tag) {
        var tag_content = "<span class=\"tag\">" + tag + "</span>";
        $(tag_content).hide().appendTo("#blog_tags").fadeIn(1500);
    });

    //bind click event onto tags
    $("#blog_tags .tag").each(function(){
        var tag = $(this).text();
        $(this).bind("click", function () {
            window.location = "https://www.google.com/search?q=site:faolou.me" + encodeURIComponent(" "+tag);
        });
    });
});