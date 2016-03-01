define('app/views/team_list', ['app/views/page'],
    //
    //  Team List View
    //
    //  @returns Class
    //
    function(PageView) {

        'use strict';

        return App.TeamListView = PageView.extend({

            templateName: 'team_list',
            controllerName: 'teamsController',

            load: function() {

                // Add event listeners
                Mist.teamsController.on('onSelectedChange', this, 'updateFooter');

                this.updateFooter();

            }.on('didInsertElement'),


            unload: function() {

                // Remove event listeners
                Mist.teamsController.off('onSelectedChange', this, 'updateFooter');

            }.on('willDestroyElement'),

            canRename: function() {
                return Mist.teamsController.get('selectedObjects').length == 1;
            }.property('Mist.teamsController.model.@each.selected'),

            canDelete: function() {
                return Mist.teamsController.get('selectedObjects').length;
            }.property('Mist.teamsController.model.@each.selected'),

            updateFooter: function() {
                if (Mist.teamsController.get('selectedObjects').length) {
                    this.$('.ui-footer').slideDown();
                } else {
                    this.$('.ui-footer').slideUp();
                }
            },


            //
            //  Actions
            //


            actions: {

                selectClicked: function () {
                    $('#select-teams-popup').popup('open');
                },

                selectionModeClicked: function (mode) {
                    $('#select-teams-popup').popup('close');

                    Ember.run(function () {
                        Mist.teamsController.get('filteredTeams').forEach(function (team) {
                            team.set('selected', mode);
                        });
                    });
                },

                deleteClicked: function() {

                    var teams = Mist.teamsController.get('selectedObjects');

                    Mist.dialogController.open({
                        type: DIALOG_TYPES.YES_NO,
                        head: 'Delete teams',
                        body: [{
                            paragraph: 'Are you sure you want to delete ' + (teams.length > 1 ? 'these teams: ' : 'this team: ') + teams.toStringByProperty('name') + ' ?'
                        }],
                        callback: function(didConfirm) {
                            if (!didConfirm) return;
                            teams.forEach(function(team) {
                                Mist.teamsController.deleteScript({
                                    team: team
                                });
                            });
                        }
                    });
                },

                clearClicked: function() {
                    Mist.teamsController.clearSearch();
                },

                sortBy: function(criteria) {
                    Mist.teamsController.set('sortByTerm', criteria);
                }
            }
        });
    }
);