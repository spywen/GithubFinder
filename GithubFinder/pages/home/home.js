(function () {
    "use strict";

    var ui = WinJS.UI;
    

    ui.Pages.define("/pages/home/home.html", {

        /**
            Page ready method
        **/
        ready: function (element, options) {
            document.querySelector(".searchForm").addEventListener("submit", this.appSearchSubmit);
        },

        /**
            Method called when user submit form
        **/
        appSearchSubmit: function (e) {
            e.preventDefault();
            var searchText = document.getElementById("searchInput").value;
            var args = {
                detail: {
                    queryText: searchText
                }
            };
            WinJS.Navigation.navigate('/pages/results/searchResults.html', args.detail);
        }
    });

})();
