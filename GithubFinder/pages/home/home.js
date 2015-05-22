(function () {
    "use strict";

    var ui = WinJS.UI;

    WinJS.Namespace.define("HomeNS", {
        items: new WinJS.Binding.List([]),
        toastNumberOfResult: toastNumberOfResult
    });

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
            options = options || {};
            this._data = WinJS.Binding.as({
                searchText: ''
            });

            //Binding for search word
            var b = this._data;
            this._bindTextBox("#searchTxtBox", b.searchText, function (value) { b.searchText = value; });

            // Data bind to the child tree to set the control text
            WinJS.Binding.processAll(element, this._data);

            // Hook up the click handler on our button
            WinJS.Utilities.query("button", element).listen("click", this._onclick.bind(this));
        },

        /**
        Search button click event
        **/
        _onclick: function (evt) {
            //var loader = document.querySelector("section[role='main'] .loader");
            //loader.style.visibility = 'visible';
            var result = GithubApiService.search(this._data.searchText).then(function (result) {
                HomeNS.toastNumberOfResult(result.count);
                HomeNS.items = result.items;
                var listView = document.getElementById("itemsListView").winControl;
                listView.itemDataSource = HomeNS.items.dataSource;
                //loader.style.visibility = 'hidden';
            });
        },

        /**
        Bind search text box
        **/
        _bindTextBox: function(selector, initialValue, setterCallback) {
            var textBox = document.querySelector(selector);
            textBox.addEventListener("change", function (evt) {
                setterCallback(evt.target.value);
            }, false);
            textBox.value = initialValue;
        },

        /**
        Invoke particular item to see details
        **/
        _itemInvoked: function (args) {
            var repoId = HomeNS.items.getAt(args.detail.itemIndex).id;
            WinJS.Navigation.navigate("/pages/details/details.html", { repoId: repoId });
        },
    });











    /*
    WinJS.Namespace.define("HomeNS", {
        items : new WinJS.Binding.List([
                { full_name: 'A', description: 'A' },
                { full_name: 'B', description: 'B' },
        ]),
        actionBtn: function(){
            console.log("ee")
        },
        model: WinJS.Binding.as({
            search: ""
        })
    });

    function bindTextBox(selector, initialValue, setterCallback) {
        var textBox = document.querySelector(selector);
        textBox.addEventListener("change", function (evt) {
            setterCallback(evt.target.value);
        }, false);
        textBox.value = initialValue;
    }
    */

    /*
    ui.Pages.define("/pages/home/home.html", {
        // Cette fonction est appelée pour initialiser la page.
        init: function (element, options) {
            this.itemInvoked = ui.eventHandler(this._itemInvoked.bind(this));
        },

        // Cette fonction est appelée chaque fois qu'un utilisateur accède à cette page.
        ready: function (element, options) {

            options = options || {};
            this._data = WinJS.Binding.as({ controlText: options.controlText, message: options.message });

            WinJS.Binding.processAll(element, this._data);

            var button = document.querySelector(".button");
            button.addEventListener("click", this._onclick.bind(this), false);
            /*WinJS.Utilities.query("button").listen("click",
                // JavaScript gotcha - use function.bind to make sure the this reference
                // inside the event callback points to the control object, not to
                // window
                this._onclick.bind(this));*/


            
            /*
            var b = WinJS.Binding.as(HomeNS.model);
            bindTextBox("#searchTxtBox", b.search, function (value) { b.search = value; });
            WinJS.Binding.processAll(document.querySelector(".homepage"), b);


            var button = document.getElementById("button");
            button.addEventListener("click", actionBtn, false);


            b.bind("search", function (newValue) {
                /*var test = new WinJS.Binding.List([
                { full_name: 'A', description: 'A' },
                { full_name: 'B', description: 'B' },
                { full_name: 'C', description: 'C' },
                ]);
                var itemsListView = document.querySelector('#itemsListView');
                var itemTemplate = document.querySelector('#itemTemplate');

                itemsListView.itemDataSource = test.dataSource;
                itemsListView.itemsListView = itemTemplate;
                console.log("Value is " + newValue);
            });
            b.bind
        },


        controlText: {
            get: function () { return this._data.controlText; },
            set: function (value) { this._data.controlText = value; }
        },

        _onclick: function (evt) {
            WinJS.log && WinJS.log(" button was clicked", "sample", "status");
        },

        // Cette fonction met à jour la mise en page en réponse aux modifications de disposition.
        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: répondez aux modifications de la disposition.
        },

        _itemInvoked: function (args) {
            var groupKey = Data.groups.getAt(args.detail.itemIndex).key;
            WinJS.Navigation.navigate("/pages/split/split.html", { groupKey: groupKey });
        }
    });*/

})();
