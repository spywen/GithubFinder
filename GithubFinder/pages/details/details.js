// Pour obtenir une présentation du modèle Contrôle de page, consultez la documentation suivante :
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.Namespace.define("DetailsNS", {
        repoSelected: undefined,
        fragments: new WinJS.Binding.List([])
    });

    WinJS.UI.Pages.define("/pages/details/details.html", {

        _repoSelected: null,

        
        ready: function (element, options) {
            DetailsNS.repoSelected = GithubApiService.getRepoById(options.repoId);
            element.querySelector("header[role=banner] .pagetitle").textContent = DetailsNS.repoSelected.name;

            this._data = WinJS.Binding.as({
                repo: DetailsNS.repoSelected
            });

            DetailsNS.fragments = new WinJS.Binding.List([]);
            for (var i = 0, len = DetailsNS.repoSelected.text_matches.length; i < len; i++) {
                DetailsNS.fragments.push(DetailsNS.repoSelected.text_matches[i]);
            }
            var listView = document.getElementById("fragmentsListView").winControl;
            listView.itemDataSource = DetailsNS.fragments.dataSource;

            WinJS.Binding.processAll(element, this._data);
        },

        unload: function () {

        },

        updateLayout: function (element) {

        }
    });
})();
