Ext.define('PostgrestTest.view.main.Main', {
    extend:   'Ext.grid.Panel',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.grid.column.Action'
    ],

    // panel config
    title: 'Edit Speakers',

    tbar: [{
        text: 'Add Speaker',
        action: 'add',
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
    store: 'Speakers',

    columns:  [{
        header: 'ID',
        dataIndex: 'id',
        width: 50,
        renderer: function(v) {
            return v > 0 ? v : '';
        }
    },{
        header: 'Name',
        dataIndex: 'name',
        flex: 2,
        editor: 'textfield'
    },{
        header: 'Twitter',
        dataIndex: 'twitter',
        flex: 1,
        editor: {
            xtype: 'textfield',
            regex: /^@?(\w){1,15}$/
        },
        renderer: function(v) {
            if (!v) {
                return '';
            }

            if (v[0] != '@') {
                v = '@' + v;
            }

            return '<a href="https://twitter.com/'+v.substr(1)+'">'+v+'</a>';
        }
    },{
        xtype: 'templatecolumn',
        header: 'Avatar',
        width: 75,
        tpl: [
            '<tpl if="avatar_url">',
                '<img src="{avatar_url}" width="50">',
            '<tpl else>',
                '&mdash;',
            '</tpl>'
        ]
    },{
        header: 'Avatar URL',
        dataIndex: 'avatar_url',
        flex: 3,
        editor: {
            xtype: 'textfield',
            vtype: 'url'
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