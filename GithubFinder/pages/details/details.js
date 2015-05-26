// Pour obtenir une présentation du modèle Contrôle de page, consultez la documentation suivante :
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    /**
    Details namespace
    **/
    WinJS.Namespace.define("DetailsNS", {
        //repo default data
        repoSelected: undefined,
        //owner details
        ownerDetails: undefined,
        //repo details
        repoDetails: undefined,
        //fragments of the search
        fragments: new WinJS.Binding.List([]),
        //Date converter (github api send date formatted with T and Z, we just remove it)
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
                //get owner details
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

            //Declare share contract listener
            var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
            dataTransferManager.addEventListener("datarequested", shareRepository);

            //Set page title
            element.querySelector("header[role=banner] .pagetitle").textContent = DetailsNS.repoSelected.name;

            //Binding attributes
            this._data = WinJS.Binding.as({
                repo: DetailsNS.repoSelected,
                ownerDetails: DetailsNS.ownerDetails,
                repoDetails: DetailsNS.repoDetails
            });
            
            //Get fragments
            DetailsNS.fragments = new WinJS.Binding.List([]);
            for (var i = 0, len = DetailsNS.repoSelected.text_matches.length; i < len; i++) {
                DetailsNS.fragments.push(DetailsNS.repoSelected.text_matches[i]);
            }
            var listView = document.getElementById("fragmentsListView").winControl;
            listView.itemDataSource = DetailsNS.fragments.dataSource;

            WinJS.Binding.processAll(element, this._data);
        },

        unload: function () {
            //Free share contract listener
            var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
            dataTransferManager.removeEventListener("datarequested", shareRepository);
        }
    });

    /**
        Share contract : share current repository 
    **/
    function shareRepository(e) {
        var request = e.request;
        request.data.properties.title = "GithubFinder - Share repository - " + DetailsNS.repoSelected.name;
        request.data.properties.description = "Someone wants to share to you a Github repository found with GithubFinder.";
        request.data.setWebLink(new Windows.Foundation.Uri(DetailsNS.repoSelected.html_url));  
    }
})();
