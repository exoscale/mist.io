define('app/views/policy_rule_item', ['ember'],
    //
    //  Policy Item Component
    //
    //  @returns Class
    //
    function() {

        'use strict';

        return App.PolicyRuleItemComponent = Ember.Component.extend({

            //
            //  Properties
            //

            layoutName: 'policy_rule_item',
            tagName: 'tr',
            classNames: ['rule-item'],
            rule: null,
            team: null,
            index: null,

            //
            // Computed Properties
            //

            orderIndex: Ember.computed('index', function() {
                return this.get('index') + 1 + '.';
            }),

            isLast: Ember.computed('rule', 'team.policy.rules.[]', function() {
                var rules = this.get('team.policy.rules'),
                len = rules.length;
                return rules.indexOf(this.get('rule')) == len - 1;
            }),

            isFirst: Ember.computed('rule', 'team.policy.rules.[]', function() {
                var rules = this.get('team.policy.rules');
                return rules.indexOf(this.get('rule')) === 0;
            }),

            identification: Ember.computed('rule.rid', 'rule.rtags', 'rule.identification', function() {
                var rid = this.get('rule.rid'),
                rtags = this.get('rule.rtags');
                if (this.get('rule.identification')) {
                    return this.get('rule.identification');
                }

                if (rid) {
                    return 'id';
                }

                if (rtags) {
                    return 'tags';
                }

                return 'id';
            }),

            isID: Ember.computed('identification', function() {
                return this.get('identification') == 'id';
            }),

            //
            // Initialization
            //

            load: function() {
                this._updateView();
            }.on('didInsertElement'),

            //
            // Private Methods
            //

            _updateView: function() {
                Ember.run.scheduleOnce('afterRender', this, function() {
                    $('body').enhanceWithin();
                });
            },

            //
            // Actions
            //

            actions: {
                openRuleOperatorPopup: function() {
                    Mist.policyRuleEditController.open(this.get('rule'), this.get('team'), 'operator', null, this.elementId);
                },

                openRuleActionPopup: function() {
                    if (this.get('rule.action').toLowerCase() == 'all' && this.get('rule.rtype').toLowerCase() == 'all') {
                        Mist.notificationController.notify('Please select resource type first');
                    } else {
                        Mist.policyRuleEditController.open(this.get('rule'), this.get('team'), 'action', null, this.elementId);
                    }
                },

                openRuleResourcePopup: function() {
                    Mist.policyRuleEditController.open(this.get('rule'), this.get('team'), 'resource', null, this.elementId);
                },

                openRuleResourceIdentificationPopup: function() {
                    Mist.policyRuleEditController.open(this.get('rule'), this.get('team'), 'identification', null, this.elementId);
                },

                moveUpRule: function() {
                    Mist.teamsController.moveUpRule(this.get('rule'), this.get('team'));
                },

                moveDownRule: function() {
                    Mist.teamsController.moveDownRule(this.get('rule'), this.get('team'));
                },

                deleteRule: function() {
                    Mist.teamsController.deleteRule({
                        team: this.get('team'),
                        rule: this.get('rule')
                    });
                },

                //
                // Observers
                //

                identificationObserver: function() {
                    console.log(this.get(123123123));
                    Ember.run.once(this, '_updateView');
                }.observes('identification')
            }
        });
    }
)