(function () {
    "use strict";

    var ui = WinJS.UI;

    /**
        Home namespace
    **/
    WinJS.Namespace.define("HomeNS", {
        //Repositories found list
        repositories: new WinJS.Binding.List([]),
        //Method called when search
        querySubmittedHandler: WinJS.UI.eventHandler(querySubmittedHandler)
    });

    /**
        When search for something...
    **/
    function querySubmittedHandler(args) {
        //Reset list view 
        resetListView();
        //Start loader
        startOrStopLoader(true);
        var result = GithubApiService.search(args.detail.queryText).then(function (result) {
            //Toast number of results found
            toastNumberOfResult(result.count);
            //Get and set results found
            HomeNS.repositories = result.items;
            //Filled list view with results
            var listView = document.getElementById("repositoriesListView").winControl;
            listView.itemDataSource = HomeNS.repositories.dataSource;
            //Stop loader
            startOrStopLoader(false);
        });
    }

    /**
        Reset list view
    **/
    function resetListView() {
        var listView = document.getElementById("repositoriesListView").winControl;
        listView.itemDataSource = undefined;
    }

    /**
        Toast number of results found
    **/
    function toastNumberOfResult(count){
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
        var GfLoader = document.querySelector(".win-ring");
        if (shouldStart) {
            GfLoader.style.visibility = 'visible';
        } else {
            GfLoader.style.visibility = 'hidden';
        }
    }

    var ControlConstructor = WinJS.UI.Pages.define("/pages/home/home.html", {

        /**
        Page init method
        **/
        init: function (element, options) {
            this.itemInvoked = ui.eventHandler(this._itemInvoked.bind(this));
        },

        /**
        Page ready method
        **/
        ready: function (element, options) {
        },

        /**
        Invoke particular item to see details
        **/
        _itemInvoked: function (args) {
            var repoId = HomeNS.repositories.getAt(args.detail.itemIndex).id;
            WinJS.Navigation.navigate("/pages/details/details.html", { repoId: repoId });
        },
    });

})();
