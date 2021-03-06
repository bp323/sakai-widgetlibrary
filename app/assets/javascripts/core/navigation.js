$(function() {

    ///////////////
    // VARIABLES //
    ///////////////

    // Containers
    var searchInput = "#search_widgets";
    var searchResults = "#search_widgets_results";

    // App variables
    var lastSearchVal = "";
    var searchTimeout = false;
    var searchOpen = false;


    ///////////////
    // UTILITIES //
    ///////////////

    /**
     * Handles up and down arrow keydown event
     * @param {Boolean} up True when up arrow is pressed, false when down arrow is pressed
     * @return {Boolean} Returns false
     */
    var handleArrowKeyInSearch = function(up) {
        if ($(searchResults).find("li").length) {
            var currentIndex = 0,
                next = 0;
            if ($(searchResults).find("li.selected").length) {
                currentIndex = $(searchResults).find("li").index($(searchResults).find("li.selected")[0]);
                next = up ? (currentIndex - 1 >= 0 ? currentIndex-1 : $(searchResults).find("li").length - 1) : (currentIndex + 1 >= $(searchResults).find("li").length ? 0 : currentIndex +1);
                $(searchResults).find("li.selected").removeClass("selected");
            }
            if (next !== -1) {
                $(searchResults).find("li:eq(" + next + ")").addClass("selected");
            }
            return false;
        }
    };

    /**
     * Handles keydown event for 'enter' key pressed while search input field has focus
     */
    var handleEnterKeyInSearch = function() {
        if ($(searchResults).find("li.selected").length) {
            document.location = $(searchResults).find("li.selected a").attr("href");
        } else {
            document.location = "/browse?q=" + $.trim($(searchInput).val());
        }
    };

    /**
     * Search for widgets and show the results
     * @param {String} val Search value from input field
     */
    var doSearch = function(val){
        $.ajax({
            type: 'POST',
            url: "/search",
            data: {
                "q": $("#search_widgets").val()
            },
            success: function(data, success) {
                if (success) {
                    searchOpen = true;
                    $("#search_widgets_results").html(data);
                    $(searchResults).show();
                }
                return false;
            }
        });
    };


    ////////////////////
    // INITIALIZATION //
    ////////////////////

    /**
     * Add binding to various elements
     */
    var addBinding = function(){
        $(searchInput).on("keyup", function(ev){
            var val = $.trim($(this).val());
            if (val !== "" && ev.which !== $.ui.keyCode.SHIFT && val !== lastSearchVal) {
                if (searchTimeout) {
                    clearTimeout(searchTimeout);
                }
                searchTimeout = setTimeout(function() {
                    doSearch(val);
                    lastSearchVal = val;
                }, 200);
            } else if (val === "") {
                lastSearchVal = val;
                $(searchResults).hide();
                searchOpen = false;
            }
        });

        $(searchInput).on("keydown", function(ev){
            var val = $.trim($(this).val());
            // 40 is down, 38 is up, 13 is enter
            if (ev.which === $.ui.keyCode.DOWN || ev.which === $.ui.keyCode.UP) {
                handleArrowKeyInSearch(ev.which === $.ui.keyCode.UP);
                ev.preventDefault();
            } else if (ev.which === $.ui.keyCode.ENTER) {
                handleEnterKeyInSearch();
                ev.preventDefault();
            }
        });

        $(document).on("click", function(e) {
            if ( searchOpen && $( e.target ).parents( searchInput + ", " + searchResults ).length === 0 && !$( e.target ).is( searchInput + ", " + searchResults ) ) {
                $(searchResults).hide();
                searchOpen = false;
            }
        });
    };

    addBinding();
});
