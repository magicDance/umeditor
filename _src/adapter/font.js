/**
 * font相关组件
 */


UE.registerUI('fontfamily', function( name ) {

    var me = this,
        options = {
            label: '字体',
            title: me.getLang("labelMap")[name],
            items: me.options.fontfamily,
            recordStack: []
        },
        fontFamily = options.items,
        $fontFamilyCombobox = null,
        temp = null,
        tempItems = [];

    /* 参数转化 */

    options.itemStyles = [];
    options.value = [];

    options.autowidthitem = [];

    for( var i = 0, len = fontFamily.length; i < len; i++ ) {

        temp = fontFamily[ i ].val;
        tempItems.push( temp.split(/\s*,\s*/)[0] );
        options.itemStyles.push('font-family: ' + temp);
        options.value.push( temp );
        options.autowidthitem.push( wordCountAdaptive( tempItems[ i ] ) );

    }

    options.items = tempItems;


    $fontFamilyCombobox = $.eduibuttoncombobox( options ).edui().on( 'comboboxselect', function( evt, res ){
        me.execCommand( name, res.value );
    });

    //querycommand
    this.addListener('selectionchange',function(){

        //设置按钮状态
        var state = this.queryCommandState( name );
        $fontFamilyCombobox.button().edui().disabled( state == -1 ).active( state == 1 );

        //设置当前字体
        var fontFamily = this.queryCommandValue( name );

        fontFamily = fontFamily.replace(/^\s*['|"]|['|"]\s*$/g, '');

        $fontFamilyCombobox.selectItemByLabel( fontFamily.split(/['|"]?\s*,\s*[\1]?/) );

    });


    return $fontFamilyCombobox.button().addClass('edui-combobox');

    /**
     * 执行宽度自适应
     */
    function wordCountAdaptive( word, hasSuffix ) {

        var tmpNode = document.createElement('span');

        tmpNode.innerHTML = word;

        tmpNode.style.cssText = 'display: inline; position: absolute; top: -10000000px; left: -100000px;';

        document.body.appendChild( tmpNode );

        var width = tmpNode.offsetWidth;

        document.body.removeChild( tmpNode );

        tmpNode = null;

        if( width < 50 ) {

            return word;

        } else {

            word = word.slice( 0, hasSuffix ? -4 : -1 );

            if( word.length ===  0 ) {
                return '...';
            }

            return wordCountAdaptive( word + '...', true );

        }

    }

});


UE.registerUI('fontsize', function( name ) {

    var me = this,
        options = {
            label: '16',
            title: me.getLang("labelMap")[name],
            autorecord: false,
            items: me.options.fontsize
        },
        $fontSizeCombobox = null;

    options = parseOption( options );

    $fontSizeCombobox = $.eduibuttoncombobox( options );

    $btn = $fontSizeCombobox.edui().button();
    $btn.on( 'comboboxselect', function(evt, res) {

        me.execCommand( name, res.value + 'px' );

    });

    $btn.addClass('edui-combobox');

    //querycommand
    this.addListener('selectionchange',function(){

        var state = this.queryCommandState( name );
        $btn.edui().disabled( state == -1 ).active( state == 1 );

        //值反射
        var fontSize = this.queryCommandValue( name );

        $fontSizeCombobox.eduicombobox( 'selectItemByLabel', fontSize.replace('px', '') );

    });

    return $btn;

    /**
     * font-size参数解析
     * @param options 原始参数
     * @returns 解析后的参数
     */
    function parseOption( options ) {

        var fontSize = options.items,
            temp = null,
            tempItems = [];

        options.itemStyles = [];
        options.value = [];

        for( var i = 0, len = fontSize.length; i < len; i++ ) {

            temp = fontSize[ i ];
            tempItems.push( temp );
            options.itemStyles.push('font-size: ' + temp +'px');

        }

        options.value = options.items;
        options.items = tempItems;

        return options;

    }

});


UE.registerUI('forecolor', function( name ) {

    var me = this,
        colorPickerWidget = null,
        fontIcon = null,
        $btn = null;

    //querycommand
    this.addListener('selectionchange', function(){

        var state = this.queryCommandState( name );
        $btn.edui().disabled( state == -1 ).active( state == 1 );

    });

    $btn = $.eduisplitbutton({
        icon: 'font',
        caret: true,
        title: me.getLang("labelMap")[name],
        click: function() {
            me.execCommand( name, getCurrentColor() );
        }
    });

    fontIcon = $btn.find(".icon-font");

    colorPickerWidget = $.eduicolorpicker({
        lang_clearColor: me.getLang('clearColor') || '',
        lang_themeColor: me.getLang('themeColor') || '',
        lang_standardColor: me.getLang('standardColor') || ''
    }).eduitablepicker( "attachTo", $btn ).edui().on('pickcolor', function( evt, color ){
            window.setTimeout( function(){
                fontIcon.css("color", color);
                me.execCommand( name, color );
            }, 0 );
        });
    colorPickerWidget.on('show',function(){
        UE.setActiveWidget(colorPickerWidget.root())
    });
    $btn.edui().mergeWith( colorPickerWidget.root() );

    return $btn;

    function getCurrentColor() {
        return domUtils.getComputedStyle( fontIcon[0], 'color' );
    }

});


UE.registerUI('backcolor', function( name ) {

        var me = this,
            colorPickerWidget = null,
            fontIcon = null,
            $btn = null;

        //querycommand
        this.addListener('selectionchange', function(){
            var state = this.queryCommandState( name );
            $btn.edui().disabled( state == -1 ).active( state == 1 );
        });

        $btn = $.eduisplitbutton({
            icon: 'font',
            title: me.getLang("labelMap")[name],
            caret: true,
            click: function() {
                me.execCommand( name, getCurrentColor() );
            }
        });

        fontIcon = $btn.find(".icon-font");

        colorPickerWidget = $.eduicolorpicker({
            lang_clearColor: me.getLang('clearColor') || '',
            lang_themeColor: me.getLang('themeColor') || '',
            lang_standardColor: me.getLang('standardColor') || ''
        }).eduitablepicker( "attachTo", $btn ).edui().on('pickcolor', function( evt, color ){
                me.execCommand( name, color );
        });

        $btn.edui().mergeWith( colorPickerWidget.root() );
        colorPickerWidget.on('show',function(){
            UE.setActiveWidget(colorPickerWidget.root())
        });
        return $btn;

        function getCurrentColor() {
            return domUtils.getComputedStyle( fontIcon[0], 'color' );
        }

    });