(function () {
    "use strict";

    var appModel = Windows.ApplicationModel;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var searchPageURI = "/pages/results/searchResults.html";

    ui.Pages.define(searchPageURI, {

        lastSearch: "",

        /**
            Method launch when results come back from Github api
        **/
        onQueryResults: function (data) {
            if (data.count !== 0) {
                //Filled listview
                var listView = document.querySelector(".reposlist").winControl;
                listView.itemDataSource = data.repositories.dataSource;
            }
            //Display no repo found if no results
            if (data.count === 0) {
                noReposFoundActivation(true);
            }
            //Toastr number of results
            toastNumberOfResult(data.count);
            //Stop loader
            startOrStopLoader(false);
        },

        /**
            Method wich uses GithubApiService to found repositories
        **/
        searchRepos: function () {
            this.initializeLayout(document.querySelector(".reposlist").winControl, Windows.UI.ViewManagement.ApplicationView.value);
            if (this.lastSearch && this.lastSearch != "") {
                GithubApiService.search(this.lastSearch).then(this.onQueryResults);
            } else {
                this.onQueryResults({count : 0});
            }
        },

        /**
            This function executes each step required to perform a search.
        **/
        handleQuery: function (element, args) {
            this.lastSearch = args.queryText;
            this.searchRepos();
        },

        /**
            This function updates the ListView with new layouts
        **/
        initializeLayout: function (listView, viewState) {
            //Start loader
            startOrStopLoader(true);
            var modernQuotationMark = "”";
            listView.layout = new ui.GridLayout();
            document.querySelector(".titlearea .pagetitle").innerHTML = "Search";
            document.querySelector(".titlearea .pagesubtitle").innerHTML = "Results for " + modernQuotationMark + toStaticHTML(this.lastSearch) + modernQuotationMark;
        },



        /**
            Ready method
        **/
        ready: function (element, options) {
            //Bind itemInvoked method
            this.itemInvoked = ui.eventHandler(this._itemInvoked.bind(this));
            var listView = element.querySelector(".reposlist").winControl;
            listView.oniteminvoked = this.itemInvoked;
            this.handleQuery(element, options);
            listView.element.focus();
        },

        /**
            Update layout method
        **/
        updateLayout: function (element, viewState, lastViewState) {
            //Disabled no results found message 
            noReposFoundActivation(false);
            var listView = element.querySelector(".reposlist").winControl;
            if (lastViewState !== viewState) {
                if (lastViewState === appViewState.snapped || viewState === appViewState.snapped) {
                    var handler = function (e) {
                        listView.removeEventListener("contentanimating", handler, false);
                        e.preventDefault();
                    }
                    listView.addEventListener("contentanimating", handler, false);
                    var firstVisible = listView.indexOfFirstVisible;
                    this.initializeLayout(listView, viewState);
                    listView.indexOfFirstVisible = firstVisible;
                }
            }
        },

        /**
            Method which redirect to the repository page when user click on a specific repo
        **/
        _itemInvoked: function (args) {
            var arg = { 
                repoId: GithubApiService.getRepoByIndex(args.detail.itemIndex).id
            };
            WinJS.Navigation.navigate("/pages/details/details.html", arg);
        }
    });

    /*Search contract implementation*/
    WinJS.Application.addEventListener("activated", function (args) {
        if (args.detail.kind === appModel.Activation.ActivationKind.search) {
            args.setPromise(ui.processAll().then(function () {
                if (!nav.location) {
                    nav.history.current = { location: Application.navigator.home, initialState: {} };
                }

                return nav.navigate(searchPageURI, { queryText: args.detail.queryText });
            }));
        }
    });

    appModel.Search.SearchPane.getForCurrentView().onquerysubmitted = function (args) { nav.navigate(searchPageURI, args); };
    /*Search contract implementation*/

    /**
     Toast number of results found
    **/
    function toastNumberOfResult(count) {
        var template = Windows.UI.Notifications.ToastTemplateType.toastImageAndText02;
        var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);

        //Text
        var toastTextElements = toastXml.getElementsByTagName("text");
        toastTextElements[0].appendChild(toastXml.createTextNode("Search result:"));
        if (count > 200) {
            toastTextElements[1].appendChild(toastXml.createTextNode("More than 200 repositories have been found"));
        } else {
            toastTextElements[1].appendChild(toastXml.createTextNode(count + " repositories have been found"));
        }
        //Image
        var images = toastXml.getElementsByTagName("image");
        images[0].setAttribute("src", "images/found.png");

        var toast = new Windows.UI.Notifications.ToastNotification(toastXml);

        var toastNotifier = Windows.UI.Notifications.ToastNotificationManager.createToastNotifier();
        toastNotifier.show(toast);
    }

    /**
        Manage loader
        shouldStart <=> true : loader should be visible
        else shoul be hidden
    **/
    function startOrStopLoader(shouldStart) {
        var gfLoader = document.querySelector(".win-ring");
        if (shouldStart) {
            gfLoader.style.visibility = 'visible';
        } else {
            gfLoader.style.visibility = 'hidden';
        }
    }

    /**
        Enabled or disabled 'no repository found' message
    **/
    function noReposFoundActivation(shouldBeEnabled) {
        var noRepoMessage = document.querySelector(".resultsmessage");
        if (shouldBeEnabled) {
            noRepoMessage.style.visibility = 'visible';
        } else {
            noRepoMessage.style.visibility = 'hidden';
        }
    }
})();