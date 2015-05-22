// Pour obtenir une présentation du modèle Contrôle de page, consultez la documentation suivante :
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/details/details.html", {

        _repoSelected: null,

        
        ready: function (element, options) {
            this._repoSelected = GithubApiService.getRepoById(options.repoId);
            element.querySelector("header[role=banner] .pagetitle").textContent = this._repoSelected.name;

            this._data = WinJS.Binding.as({
                repo: this._repoSelected
            });

            WinJS.Binding.processAll(element, this._data);
        },

        unload: function () {

        },

        updateLayout: function (element) {

        }
    });
})();
