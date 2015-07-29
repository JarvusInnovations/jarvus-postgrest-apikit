Ext.define('PostgrestTest.view.main.Main', {
    extend:   'Ext.grid.Panel',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.grid.column.Action'
    ],

    // panel config
    title: 'Edit Jurisdictions',

    tbar: [{
        text: 'Add Jurisdiction',
        action: 'jurisdiction-add',
        handler: function() {
            var gridPanel = this.up('gridpanel');
            gridPanel.getStore().insert(0, {});
            gridPanel.getPlugin('cellediting').startEditByPosition({
                row: 0,
                column: 1
            });
        }
    }],

    // gridpanel config
    store: 'Jurisdictions',

    columns:  [{
        header: 'ID',
        dataIndex: 'id',
        flex: 1,
        renderer: function(v) {
            return v > 0 ? v : '';
        }
    },{
        header: 'Title',
        dataIndex: 'title',
        flex: 3,
        editor: 'textfield'
    },{
        header: 'Type',
        dataIndex: 'type',
        flex: 1
    },{
        header: 'Document',
        dataIndex: 'document'
    },{
        header: 'Document Keys',
        dataIndex: 'documentKeys',
        renderer: function(v) {
            return v.join(', ');
        }
    },{
        xtype: 'actioncolumn',
        // width: 50,
        items: [{
            icon: 'http://i.imgur.com/wb1NW8I.png',  // Use a URL in the icon config
            tooltip: 'Edit',
            handler: function(gridView, rowIndex, colIndex) {
                gridView.grid.getPlugin('cellediting').startEditByPosition({
                    row: rowIndex,
                    column: 1
                });
            }
        },{
            icon: 'http://i.imgur.com/wb1NW8I.png',
            tooltip: 'Delete',
            handler: function(grid, rowIndex, colIndex) {
                grid.getStore().removeAt(rowIndex);
            }
        }]
    }],

    selModel: {
        selType: 'cellmodel'
    },

    plugins: [{
        pluginId: 'cellediting',
        ptype: 'cellediting',
        clicksToEdit: 1
    }],

    // temporary inline listeners
    listeners: {
        boxready: function() {
            this.getStore().load();
        }
    }
});