// Pour obtenir une présentation du modèle Navigation, consultez la documentation suivante :
// http://go.microsoft.com/fwlink/?LinkId=232506
(function () {
    "use strict";

    var activation = Windows.ApplicationModel.Activation;
    var app = WinJS.Application;
    var nav = WinJS.Navigation;
    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;

    WinJS.Namespace.define("AppBar", {
        appBarCommand: WinJS.UI.eventHandler(function (ev) {
            var command = ev.currentTarget;
            if (command.winControl) {
                var label = command.winControl.label;
                if (label === "Exit") {
                    var msg = Windows.UI.Popups.MessageDialog("Are you sure ?");
                    msg.commands.append(new Windows.UI.Popups.UICommand("Exit", AppBar.exit));
                    msg.commands.append(new Windows.UI.Popups.UICommand("Cancel", AppBar.closeFlyOutWithoutAction));
                    msg.showAsync();
                } else if(label === 'Help') {
                    document.getElementById("helpFlyout").winControl.show(command);
                } else if (label === 'App info') {
                    document.getElementById("appInfoFlyout").winControl.show(command);
                }
            }
        }),
        exit: function () {
            app.stop();
            window.close();
        },
        closeFlyOutWithoutAction: function () { },
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
        }
    });

    app.onready = function (arg) {

    };

    app.oncheckpoint = function (args) {
        app.sessionState.history = nav.history;
    };

    app.start();
})();
