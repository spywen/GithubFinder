(function () {
    "use strict";

    var list = new WinJS.Binding.List();

    WinJS.Namespace.define("GithubApiService", {
        items: list,
        search: search,
        getRepoById: getRepoById
    });

    function search(keywords) {
        this.items = new WinJS.Binding.List();
        return new WinJS.Promise(function (complete) {
            WinJS.xhr({
                url: 'https://api.github.com/search/repositories?q=' + keywords + '&page=1&per_page=200',
                type: 'GET',
                headers: { 'Accept': 'application/vnd.github.v3.text-match+json' }
            }).done(
                function (result) {
                    if (result.status === 200) {
                        var feed = JSON.parse(result.responseText);
                        for (var i = 0, len = feed.items.length; i < len; i++) {
                            var item = feed.items[i];
                            GithubApiService.items.push(item);
                        }
                        complete({
                            count: feed.total_count,
                            items: GithubApiService.items
                        });
                    } else {
                        //output("Error obtaining feed. XHR status code: " + status);
                        console.log('error');
                    }
                },
                function (result) {
                    //callback(null, result.status);
                    console.log('error');
                }
            );
        });
    }

    function getRepoById(id) {
        for (var i = 0; i < GithubApiService.items.length; i++) {
            var item = GithubApiService.items.getAt(i);
            if (item.id === id) {
                return item;
            }
        }
    }

})();
