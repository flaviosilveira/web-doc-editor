var phpDoc = function()
{
    Ext.QuickTips.init();

    return {
        // Variable
        userLogin  : null,
        userLang   : null,
        appName    : 'PhpDocumentation Online Editor',
        appVer     : '0.2',
        uiRevision : '$Revision$',

        userConf : '',

        project : '',

        filePendingOpen : '',

        init : function()
        {
            // We load the configuration for this user
            new ui.task.LoadConfigTask();
        },

        notify : function (type, title, message) {

            var _notify, iconCls;

            if( type == 'info' ) {
                iconCls = 'iconInfo';
            }

            if( type == 'error' ) {
                iconCls = 'iconError';
            }

            _notify = new Ext.ux.Notification({
                iconCls     : iconCls,
                title       : title,
                html        : message,
                autoDestroy : true,
                hideDelay   :  5000
            });

            _notify.show(document); 

        },

        winForbidden : function(type)
        {

            var title = _('Forbidden'),
                mess  = _('You can\'t do this action as anonymous user.');

            switch (type) {
                case 'fs_error' :
                    title = _('Error');
                    mess  = _('File system error. Check read/write permission under data folder.');
                    break;
            }

            Ext.MessageBox.alert(
                title,
                mess
            );
        },

        // All we want to do after all dataStore are loaded
        afterLoadAllStore: function() {

            //Load external data
            // Mails ?
            if( this.userConf['mainAppLoadMailsAtStartUp'] ) {
                ui.component.PortletLocalMail.getInstance().reloadData();
            }
            // Bugs ?
            if( this.userConf['mainAppLoadBugsAtStartUp'] ) {
                ui.component.PortletBugs.getInstance().reloadData();
            }

        },

        loadAllStore: function() {

            var progressBar = new Ext.ProgressBar({
                    width:300,
                    renderTo:'loading-progressBar'
                });
            progressBar.show();;

            // Store to load for LANG project
            if (phpDoc.userLang !== 'en') {

                // We load all stores, one after the others
                document.getElementById("loading-msg").innerHTML = "Loading data...";
                progressBar.updateProgress(1/12, '1 of 12...');
                ui.component._MainMenu.store.load({
                    callback: function() {
                        progressBar.updateProgress(2/12, '2 of 12...');
                        ui.component.StaleFileGrid.getInstance().store.load({
                            callback: function() {
                                progressBar.updateProgress(3/12, '3 of 12...');
                                ui.component.ErrorFileGrid.getInstance().store.load({
                                    callback: function() {
                                        progressBar.updateProgress(4/12, '4 of 12...');
                                        ui.component.PendingReviewGrid.getInstance().store.load({
                                            callback: function() {
                                                progressBar.updateProgress(5/12, '5 of 12...');
                                                ui.component.NotInENGrid.getInstance().store.load({
                                                    callback: function() {
                                                        progressBar.updateProgress(6/12, '6 of 12...');
                                                        ui.component.PendingCommitGrid.getInstance().store.load({
                                                            callback: function() {
                                                                progressBar.updateProgress(7/12, '7 of 12...');
                                                                ui.component.PendingPatchGrid.getInstance().store.load({
                                                                    callback: function() {
                                                                        progressBar.updateProgress(8/12, '8 of 12...');
                                                                        ui.component.PortletSummary.getInstance().store.load({
                                                                            callback: function() {
                                                                                progressBar.updateProgress(9/12, '9 of 12...');
                                                                                ui.component.PortletTranslationGraph.getInstance().store.load({
                                                                                    callback: function() {
                                                                                        progressBar.updateProgress(10/12, '10 of 12...');
                                                                                        ui.component.PortletTranslationsGraph.getInstance().store.load({
                                                                                            callback: function() {
                                                                                                progressBar.updateProgress(11/12, '11 of 12...');
                                                                                                ui.component.PortletTranslator.getInstance().store.load({
                                                                                                    callback: function() {
                                                                                                        progressBar.updateProgress(12/12, '12 of 12...');
                                                                                                        ui.component.PendingTranslateGrid.getInstance().store.load({
                                                                                                            callback: function() {
                                                                                                                // Now, we can to remove the global mask
                                                                                                                Ext.get('loading').remove();
                                                                                                                Ext.fly('loading-mask').fadeOut({ remove : true });
                                                                                                                progressBar.destroy();
                                                                                                                phpDoc.afterLoadAllStore();
                                                                                                            }
                                                                                                        });
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                // Store to load only for EN project
                document.getElementById("loading-msg").innerHTML = "Loading data...";
                progressBar.updateProgress(1/4, '1 of 4...');
                ui.component._MainMenu.store.load({
                    callback: function() {
                        progressBar.updateProgress(2/4, '2 of 4...');
                        ui.component.PendingPatchGrid.getInstance().store.load({
                            callback: function() {
                                progressBar.updateProgress(3/4, '3 of 4...');
                                ui.component.PortletTranslationsGraph.getInstance().store.load({
                                    callback: function() {
                                        progressBar.updateProgress(4/4, '4 of 4...');
                                        ui.component.PendingCommitGrid.getInstance().store.load({
                                            callback: function() {
                                                // Now, we can to remove the global mask
                                                Ext.get('loading').remove();
                                                Ext.fly('loading-mask').fadeOut({ remove : true });
                                                progressBar.destroy();
                                                phpDoc.afterLoadAllStore();
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        },

        reloadAllStore: function() {

            // Store to reload for LANG project
            if (phpDoc.userLang !== 'en') {
                // We reload all stores, one after the others
                ui.component.PendingTranslateGrid.getInstance().store.reload({
                    callback: function() {
                        ui.component.StaleFileGrid.getInstance().store.reload({
                            callback: function() {
                                ui.component.ErrorFileGrid.getInstance().store.reload({
                                    callback: function() {
                                        ui.component.PendingReviewGrid.getInstance().store.reload({
                                            callback: function() {
                                                ui.component.NotInENGrid.getInstance().store.reload({
                                                    callback: function() {
                                                        ui.component.PendingCommitGrid.getInstance().store.reload({
                                                            callback: function() {
                                                                ui.component.PendingPatchGrid.getInstance().store.reload({
                                                                    callback: function() {
                                                                        ui.component.PortletSummary.getInstance().store.reload({
                                                                            callback: function() {
                                                                                ui.component.PortletTranslator.getInstance().store.reload({
                                                                                    callback: function() {
                                                                                        ui.component.PortletTranslationGraph.getInstance().store.reload({
                                                                                            callback: function() {
                                                                                                ui.component.PortletTranslationsGraph.getInstance().store.reload();
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                // Store to reload only for EN project
                ui.component.PendingCommitGrid.getInstance().store.reload({
                    callback: function() {
                        ui.component.PendingPatchGrid.getInstance().store.reload();
                    }
                });
            }
        },

        // Need confirm if we want to close a tab and the content have been modified.
        removeTabEvent : function(tabpanel, tab)
        {
            var stateLang, stateEn, state, PanType = tab.id.split('-');

            if ((PanType[0] === 'FE' || PanType[0] === 'FNU' || PanType[0] === 'FNR' || PanType[0] === 'PP' || PanType[0] === 'AF' || PanType[0] === 'FNT') && PanType[1] !== 'help') {

                if (PanType[0] === 'FE') {
                    stateLang = Ext.getCmp('FE-LANG-FILE-' + PanType[1]).isModified;
                }
                if (PanType[0] === 'FNU') {
                    stateLang = Ext.getCmp('FNU-LANG-FILE-' + PanType[1]).isModified;
                }
                if (PanType[0] === 'FNR') {
                    stateLang = Ext.getCmp('FNR-LANG-FILE-' + PanType[1]).isModified;
                }

                if (PanType[0] === 'FE') {
                    stateEn = Ext.getCmp('FE-EN-FILE-' + PanType[1]).isModified;
                }
                if (PanType[0] === 'FNU') {
                    stateEn = Ext.getCmp('FNU-EN-FILE-' + PanType[1]).isModified;
                }
                if (PanType[0] === 'FNR') {
                    stateEn = Ext.getCmp('FNR-EN-FILE-' + PanType[1]).isModified;
                }

                if (PanType[0] === 'PP') {
                    state = Ext.getCmp('PP-PATCH-FILE-' + PanType[1]).isModified;
                }

                if (PanType[0] === 'AF') {
                    state = Ext.getCmp('AF-ALL-FILE-' + PanType[1]).isModified;
                }

                if (PanType[0] === 'FNT') {
                    state = Ext.getCmp('FNT-TRANS-FILE-' + PanType[1]).isModified;
                }

                if (stateEn || stateLang || state) {
                    Ext.Msg.show({
                        scope   : this,
                        title   : _('Confirm'),
                        msg     : _('This file has been modified without being saved.<br/>' +
                                    'Do you really want to close?'),
                        buttons : Ext.Msg.YESNO,
                        icon    : Ext.Msg.QUESTION,
                        fn : function(btn, text)
                        {
                            if (btn === 'yes') {
                                tabpanel.un('beforeremove', this.removeTabEvent, this);
                                tabpanel.remove(tab);
                                tabpanel.addListener('beforeremove', this.removeTabEvent, this);
                            }
                        }
                    });
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }

        },

        drawInterface: function()
        {
            // We keel alive our session by sending a ping every minute
            ui.task.PingTask.getInstance().delay(30000); // start after 1 minute.

                mainContentLeft = (this.userLang === 'en') ? [
                    ui.component.PortletLocalMail.getInstance({lang: this.userLang}),
                    ui.component.PortletBugs.getInstance({lang: this.userLang})
                ] : [
                    ui.component.PortletSummary.getInstance({lang: this.userLang}),
                    ui.component.PortletTranslator.getInstance({lang: this.userLang}),
                    ui.component.PortletLocalMail.getInstance({lang: this.userLang})
                ];

                mainContentRight = (this.userLang === 'en') ? [
                    ui.component.PortletTranslationsGraph.getInstance()
                ] : [
                    ui.component.PortletTranslationGraph.getInstance() ,
                    ui.component.PortletTranslationsGraph.getInstance(),
                    ui.component.PortletBugs.getInstance({lang: this.userLang})
                ];

            new Ext.Viewport({
                layout : 'border',
                items : [{
                    // logo
                    region     : 'north',
                    html       : '<h1 class="x-panel-header">' +
                                    '<img src="themes/img/mini_php.png" ' +
                                        'style="vertical-align: middle;" />&nbsp;&nbsp;' +
                                    this.appName +
                                 '</h1>',
                    autoHeight : true,
                    border     : false,
                    margins    : '0 0 5 0'
                }, {
                    // accordion
                    region       : 'west',
                    layout       : 'accordion',

                    collapsible  : true,
                    collapseMode : 'mini',
                    animate      : true,
                    split        : true,
                    width        : 300,
                    header       : false,
                    tbar : [{
                        text    : _('Main Menu'),
                        iconCls : 'MainMenu',
                        menu    : new ui.component.MainMenu()
                    }],
                    items : [{
                        id        : 'acc-need-translate',
                        title     : _('Files Need Translate') + ' (<em id="acc-need-translate-nb">0</em>)',
                        layout    : 'fit',
                        border    : false,
                        iconCls   : 'iconFilesNeedTranslate',
                        hidden    : (this.userLang === 'en'),
                        items     : [ ui.component.PendingTranslateGrid.getInstance() ],
                        collapsed : true
                    },{
                        id        : 'acc-need-update',
                        title     : _('Files Need Update') + ' (<em id="acc-need-update-nb">0</em>)',
                        layout    : 'fit',
                        border    : false,
                        iconCls   : 'iconFilesNeedUpdate',
                        hidden    : (this.userLang === 'en'),
                        items     : [ ui.component.StaleFileGrid.getInstance() ],
                        collapsed : true
                    }, {
                        id        : 'acc-error',
                        title     : _('Error in current translation') + ' (<em id="acc-error-nb">0</em>)',
                        layout    : 'fit',
                        border    : false,
                        iconCls   : 'iconFilesError',
                        hidden    : (this.userLang === 'en'),
                        items     : [ ui.component.ErrorFileGrid.getInstance() ],
                        collapsed : true
                    }, {
                        id        : 'acc-need-reviewed',
                        title     : _('Files Need Reviewed') + ' (<em id="acc-need-reviewed-nb">0</em>)',
                        layout    : 'fit',
                        border    : false,
                        iconCls   : 'iconFilesNeedReviewed',
                        hidden    : (this.userLang === 'en'),
                        items     : [ ui.component.PendingReviewGrid.getInstance() ],
                        collapsed : true
                    }, {
                        id        : 'acc-notInEn',
                        title     : _('Not in EN tree') + ' (<em id="acc-notInEn-nb">0</em>)',
                        layout    : 'fit',
                        border    : false,
                        iconCls   : 'iconNotInEn',
                        hidden    : (this.userLang === 'en'),
                        items     : [ ui.component.NotInENGrid.getInstance() ],
                        collapsed : true
                    }, {
                        id        : 'acc-all-files',
                        title     : _('All files'),
                        layout    : 'fit',
                        border    : false,
                        iconCls   : 'iconAllFiles',
                        items     : [ ui.component.RepositoryTree.getInstance() ],
                        collapsed : true
                    }, {
                        id        : 'acc-need-pendingCommit',
                        tools     : [{
                            id      : 'gear',
                            hidden  : (this.userLogin == 'anonymous' ),
                            qtip    : _('Open the Log Message Manager'),
                            handler : function() {
                                if( ! Ext.getCmp('commit-log-win') )
                                {
                                    var win = new ui.component.CommitLogManager();
                                }
                                Ext.getCmp('commit-log-win').show('acc-need-pendingCommit');
                            }
                        }],
                        title     : _('Pending for commit') + ' (<em id="acc-pendingCommit-nb">0</em>)',
                        layout    : 'fit',
                        border    : false,
                        iconCls   : 'iconPendingCommit',
                        items     : [ ui.component.PendingCommitGrid.getInstance() ],
                        collapsed : true
                    }, {
                        id        : 'acc-need-pendingPatch',
                        title     : _('Pending Patch') + ' (<em id="acc-pendingPatch-nb">0</em>)',
                        layout    : 'fit',
                        border    : false,
                        iconCls   : 'iconPendingPatch',
                        items     : [ ui.component.PendingPatchGrid.getInstance() ],
                        collapsed : true
                    }]
                }, {
                    // main panel
                    xtype             : 'tabpanel',
                    id                : 'main-panel',
                    region            : 'center',
                    activeTab         : 0,
                    enableTabScroll   : true,
                    plugins           : new Ext.ux.TabCloseMenu(),
                    listeners : {
                        scope        : this,
                        beforeremove : this.removeTabEvent,
                        tabchange    : function(panel, tab) {

                            // We do somethings only if this panel contiens a tab's navigation button
                            if ( Ext.getCmp(tab.id + '-btn-tabRight-LANG')    ||
                                 Ext.getCmp(tab.id + '-btn-tabRight-EN')      ||
                                 Ext.getCmp(tab.id + '-btn-tabRight-ALL')     ||
                                 Ext.getCmp(tab.id + '-btn-tabRight-NotInEN') ||
                                 Ext.getCmp(tab.id + '-btn-tabRight-PATCH')   ||
                                 Ext.getCmp(tab.id + '-btn-tabRight-TRANS')  ) {

                                var currentTabId = tab.id,
                                    tabs         = Ext.getCmp('main-panel').layout.container.items.items,
                                    nextTabId    = false,
                                    currentTabIndex,
                                    i;

                                for( i=0; i < tabs.length; i++ ) {
                                    if( tabs[i].id === currentTabId ) {
                                        currentTabIndex = i;
                                    }
                                }

                                // Do we need to activate some button ?
                                if( tabs[currentTabIndex + 1] ) {
                                    if ( Ext.getCmp(tab.id + '-btn-tabRight-LANG'    ) ) { Ext.getCmp(tab.id + '-btn-tabRight-LANG'    ).enable(); }
                                    if ( Ext.getCmp(tab.id + '-btn-tabRight-EN'      ) ) { Ext.getCmp(tab.id + '-btn-tabRight-EN'      ).enable(); }
                                    if ( Ext.getCmp(tab.id + '-btn-tabRight-ALL'     ) ) { Ext.getCmp(tab.id + '-btn-tabRight-ALL'     ).enable(); }
                                    if ( Ext.getCmp(tab.id + '-btn-tabRight-NotInEN' ) ) { Ext.getCmp(tab.id + '-btn-tabRight-NotInEN' ).enable(); }
                                    if ( Ext.getCmp(tab.id + '-btn-tabRight-PATCH'   ) ) { Ext.getCmp(tab.id + '-btn-tabRight-PATCH'   ).enable(); }
                                    if ( Ext.getCmp(tab.id + '-btn-tabRight-TRANS'   ) ) { Ext.getCmp(tab.id + '-btn-tabRight-TRANS'   ).enable(); }
                                }

                            }
                        }
                    },
                    items : [{
                        xtype      : 'panel',
                        id         : 'MainInfoTabPanel',
                        title      : _('Home'),
                        baseCls    : 'MainInfoTabPanel',
                        autoScroll : true,
                        plain      : true,
                        items : [{
                            xtype  : 'panel',
                            border : false,
                            html   : '<div class="res-block">' +
                                        '<div class="res-block-inner">' +
                                            '<h3>' +
                                                ((this.userLogin != "anonymous") ? String.format(_('Connected as <em>{0}</em>'), this.userLogin) : String.format(_('Connected as <em>{0}</em>'), _('anonymous'))) +
                                                '<br/><br/>' +
                                                _('Project / Language: ') + '<em id="Info-Project">' + this.project + '</em> / <em id="Info-Language">-</em>'+
                                            '</h3>' +
                                        '</div>' +
                                     '</div>' +
                                     '<div class="res-block">' +
                                        '<div class="res-block-inner">' +
                                            '<p>' +
                                            _('Last data update: ') + '<em id="Info-LastUpdateData">-</em>' +
                                            '<br/><br/>' +
                                            _('Last entities check: ') + '<em id="Info-LastCheckEntities">-</em>' +
                                            '</p>' +
                                        '</div>' +
                                     '</div>'


                        }, {
                            xtype      : 'portal',
                            border: false,
                            items:[{
                                columnWidth : .5,
                                style       : 'padding:10px 5px 10px 5px',
                                items       : mainContentLeft
                            },{
                                columnWidth : .5,
                                style       : 'padding:10px 5px 10px 5px',
                                items       : mainContentRight
                            }]
                        }]
                    }]
                }]
            });

            // Load all store & remove the mask after all store are loaded
            this.loadAllStore();

            // Direct access to a file as anonymous user
            if (directAccess) {
                ui.component.RepositoryTree.getInstance().openFile(
                    directAccess.lang + directAccess.path,
                    directAccess.name
                );
            }
        } // drawInterface
    }; // Return
}();
Ext.EventManager.onDocumentReady(phpDoc.init, phpDoc, true);
