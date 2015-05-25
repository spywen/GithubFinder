// Pour obtenir une présentation du modèle Contrôle de page, consultez la documentation suivante :
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.Namespace.define("DetailsNS", {
        repoSelected: undefined,
        ownerDetails: undefined,
        repoDetails: undefined,
        fragments: new WinJS.Binding.List([]),
        convertDate: WinJS.Binding.converter(function (date) {
            date = date.replace("T", " ");
            date = date.replace("Z", "");
            return date;
        })
    });

    WinJS.UI.Pages.define("/pages/details/details.html", {

        _repoSelected: null,

        init: function(element, options){
            DetailsNS.repoSelected = GithubApiService.getRepoById(options.repoId);
            
            //get owner details
            return this.loadDetails();
        },

        /**
        Load required details (repo and owner)
        Set DetailsNS namespace
        **/
        loadDetails: function(){
            return new WinJS.Promise(function (complete, error) {
                GithubApiService.findUser(DetailsNS.repoSelected.owner.login).then(function (owner) {
                    DetailsNS.ownerDetails = owner;
                }).then(function () {
                    //get repo details
                    GithubApiService.findRepository(DetailsNS.repoSelected.id).then(function (repo) {
                        DetailsNS.repoDetails = repo;
                        complete();
                    });
                }).done();
            });
        },
        
        /**
        Ready method
        **/
        ready: function (element, options) {
            element.querySelector("header[role=banner] .pagetitle").textContent = DetailsNS.repoSelected.name;

            this._data = WinJS.Binding.as({
                repo: DetailsNS.repoSelected,
                ownerDetails: DetailsNS.ownerDetails,
                repoDetails: DetailsNS.repoDetails
            });
            
            DetailsNS.fragments = new WinJS.Binding.List([]);
            for (var i = 0, len = DetailsNS.repoSelected.text_matches.length; i < len; i++) {
                DetailsNS.fragments.push(DetailsNS.repoSelected.text_matches[i]);
            }
            var listView = document.getElementById("fragmentsListView").winControl;
            listView.itemDataSource = DetailsNS.fragments.dataSource;

            WinJS.Binding.processAll(element, this._data);
        }
    });
})();
