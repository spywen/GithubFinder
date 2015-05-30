(function () {
    "use strict";

    /**
        Github API service namespace
    **/
    WinJS.Namespace.define("GithubApiService", {
        repositories: new WinJS.Binding.List(),
        search: search,
        getRepoById: getRepoById,
        getRepoByIndex: getRepoByIndex,
        findRepository: findRepository,
        findUser: findUser
    });

    /**
        Search repository
    **/
    function search(keywords) {
        this.repositories = new WinJS.Binding.List();
        //By default request for repository info (title, description, ...)
        var apiUrlToRequest = 'https://api.github.com/search/repositories?q=';

        return new WinJS.Promise(function (complete, error) {
            WinJS.xhr({
                url: apiUrlToRequest + keywords + '&page=1&per_page=200',
                type: 'GET',
                headers: { 'Accept': 'application/vnd.github.v3.text-match+json' }
            }).done(
                function (result) {
                    if (result.status === 200) {
                        var feed = JSON.parse(result.responseText);
                        for (var i = 0, len = feed.items.length; i < len; i++) {
                            var item = feed.items[i];
                            GithubApiService.repositories.push(item);
                        }
                        complete({
                            count: feed.total_count,
                            repositories: GithubApiService.repositories
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
        for (var i = 0; i < GithubApiService.repositories.length; i++) {
            var item = GithubApiService.repositories.getAt(i);
            if (item.id === id) {
                return item;
            }
        }
    }

    /**
        Find repo by index
    **/
    function getRepoByIndex(index) {
        return GithubApiService.repositories.getAt(index);
    }

    /**
        Find additionnal repository data
    **/
    function findRepository(id) {
        return new WinJS.Promise(function (complete, error) {
            WinJS.xhr({
                url: 'https://api.github.com/repositories/' + id,
                type: 'GET'
            }).done(
                function (result) {
                    if (result.status === 200) {
                        var user = JSON.parse(result.responseText);
                        complete(user);
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
        Find additionnal owner data
    **/
    function findUser(userName) {
        return new WinJS.Promise(function (complete, error) {
            WinJS.xhr({
                url: 'https://api.github.com/users/' + userName,
                type: 'GET'
            }).done(
                function (result) {
                    if (result.status === 200) {
                        var user = JSON.parse(result.responseText);
                        complete(user);
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

})();
