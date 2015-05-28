// Pour obtenir une présentation du modèle Navigation, consultez la documentation suivante :
// http://go.microsoft.com/fwlink/?LinkId=232506
(function () {
    "use strict";

    var activation = Windows.ApplicationModel.Activation;
    var app = WinJS.Application;
    var nav = WinJS.Navigation;
    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;

    /**
    App bar namespace
    **/
    WinJS.Namespace.define("AppBar", {
        //Appbar buttons actions
        appBarCommand: WinJS.UI.eventHandler(function (ev) {
            var command = ev.currentTarget;
            if (command.winControl) {
                var label = command.winControl.label;
                if (label === "Exit") {
                    var msg = Windows.UI.Popups.MessageDialog("Are you sure ?");
                    msg.commands.append(new Windows.UI.Popups.UICommand("Exit", AppBar.exit));
                    msg.commands.append(new Windows.UI.Popups.UICommand("Cancel", function(){}));
                    msg.showAsync();
                } else if(label === 'Help') {
                    document.getElementById("helpFlyout").winControl.show(command);
                } else if (label === 'App info') {
                    document.getElementById("appInfoFlyout").winControl.show(command);
                }
            }
        }),
        //Exit app
        exit: function () {
            app.stop();
            window.close();
        },
    });

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            nav.history = app.sessionState.history || {};
            nav.history.current.initialPlaceholder = true;

            ui.disableAnimations();
            var p = ui.processAll().then(function () {
                return nav.navigate(nav.location || Application.navigator.home, nav.state);
            }).then(function () {
                return sched.requestDrain(sched.Priority.aboveNormal + 1);
            }).then(function () {
                ui.enableAnimations();
            });

            //Display app bar by default when app start
            document.getElementById("appBar").winControl.show();

            args.setPromise(p);
        } else if (args.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.search) {
            // Use setPromise to indicate to the system that the splash screen must not be torn down
            // until after processAll and navigate complete asynchronously.
            args.setPromise(WinJS.UI.processAll().then(function () {
                if (args.detail.queryText === "") {
                    // Navigate to your landing page since the user is pre-scoping to your app.
                } else {
                    // Display results in UI for eventObject.detail.queryText and eventObject.detail.language.
                    // eventObject.detail.language represents user's locale.
                }

                // Navigate to the first scenario since it handles search activation.
                return WinJS.Navigation.navigate("/pages/home/home.html", { searchDetails: args.detail });
            }));
        }
    }, false);

    /*Windows.ApplicationModel.Search.SearchPane.getForCurrentView().onquerysubmitted = function (eventObject) {
        WinJS.log && WinJS.log("User submitted the search query: " + eventObject.queryText, "sample", "status");
        console.log("test1");
};*/

    app.onready = function (arg) {

    };

    app.oncheckpoint = function (args) {
        app.sessionState.history = nav.history;
    };

    app.start();
})();
