var tags = ["Maven", "Test", "Java", "Spring", "MyBatis", "Vim", "HTTP", "Web", "Heritrix"];

// add tags
$.each(tags, function (index, tag) {
    var tag_content = "<span class=\"tag\">" + tag + "</span>";
    $(tag_content).hide().appendTo("#blog_tags").fadeIn(1500);
});

//bind click event onto tags
$("#blog_tags .tag").each(function () {
    var tag = $(this).text();
    $(this).bind("click", function () {
        window.location = "https://www.google.com/search?q=site:faolou.me" + encodeURIComponent(" " + tag);
    });
});