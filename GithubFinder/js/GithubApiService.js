(function () {
    "use strict";

    /**
    Github API service namespace
    **/
    WinJS.Namespace.define("GithubApiService", {
        items: new WinJS.Binding.List(),
        search: search,
        getRepoById: getRepoById
    });

    /**
    Search repository
    **/
    function search(keywords) {
        this.items = new WinJS.Binding.List();
        return new WinJS.Promise(function (complete, error) {
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
                        error("Githup api not available");
                    }
                },
                function (result) {
                    error("An unexpected error occured. Please Try again, if the problem persists contact the administrator.");
                }
            );
        });
    }

    /**
    Find repo by id
    **/
    function getRepoById(id) {
        for (var i = 0; i < GithubApiService.items.length; i++) {
            var item = GithubApiService.items.getAt(i);
            if (item.id === id) {
                return item;
            }
        }
    }

    /**
    Find additionnal repository data
    **/
    function findRepository(id) {

    }

    /**
    Find additionnal owner data
    **/
    function findUser(id) {

    }

})();
