Ext.define('PostgrestTest.view.main.Main', {
    extend:   'Ext.grid.Panel',

    requires: [
        'Ext.selection.CellModel',
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.util.*',
        'Ext.form.*',

        'PostgrestTest.view.main.MainController',
        'PostgrestTest.view.main.MainModel',
        'PostgrestTest.model.Jurisdiction',
        'PostgrestTest.store.Jurisdictions'
    ],

    xtype: 'cell-editing',


    title: 'Edit Jurisdictions',
    frame: true,

    initComponent: function () {

        this.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1
        });

        Ext.apply(this, {
            width:    680,
            height:   350,
            plugins:  [this.cellEditing],
            store: PostgrestTest.store.Jurisdictions,

            columns:  [{
                header:    'ID',
                dataIndex: 'id',
                flex:      1
            }, {
                header:    'Title',
                dataIndex: 'title',
                flex:     3
            }, {
                header:    'Type',
                dataIndex: 'type',
                flex: 1
            }, {
                header:    'Document',
                dataIndex: 'document'
            }],
            selModel: {
                selType: 'cellmodel'
            },
            tbar:     [{
                text:    'Add Jurisdiction',
                scope:   this,
                handler: this.onAddClick
            }]
        });

        this.callParent();

        if (Ext.supports.Touch) {
            this.addDocked({
                xtype: 'header',
                title: '<b>Note that cell editing is not recommeded on keyboardless touch devices.</b>'
            });
        }

        this.on('afterlayout', this.loadStore, this, {
            delay:  1,
            single: true
        });
    },

    loadStore: function () {
        this.getStore().load();
    },

    onAddClick: function () {
        var rec = new PostgrestTest.model.Jurisdiction({});

        this.getStore().insert(0, rec);

        this.cellEditing.startEditByPosition({
            row:    0,
            column: 0
        });
    },

    onRemoveClick: function (grid, rowIndex) {
        this.getStore().removeAt(rowIndex);
    }
});