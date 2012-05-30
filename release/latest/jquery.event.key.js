/** 
 * jquery.event.key.js
 * 
 */
(function($){
	var keymap = {},
		reverseKeyMap = {};
		
	/**
	 * @hide
	 * @parent jQuery.Event.prototype.key
	 * 
	 * Allows you to set alternate key maps or overwrite existing key codes.
	 * For example::
	 * 
	 *     $.event.key({"~" : 177});
	 * 
	 * @param {Object} map A map of character - keycode pairs.
	 */
	$.event.key = function(map){
		$.extend(keymap, map);
		for(var name in map){
			reverseKeyMap[map[name]] = name;
		}
	};
	
	$.event.key({
		//backspace
		'\b':'8',
		
		//tab
		'\t':'9',
		
		//enter
		'\r':'13',
		
		//special
		'shift':'16','ctrl':'17','alt':'18',
		
		//weird
		'pause-break':'19',
		'caps':'20',
		'escape':'27',
		'num-lock':'144',
		'scroll-lock':'145',
		'print' : '44',
		
		//navigation
		'page-up':'33','page-down':'34','end':'35','home':'36',
		'left':'37','up':'38','right':'39','down':'40','insert':'45','delete':'46',
		
		//normal characters
		' ':'32',
		'0':'48','1':'49','2':'50','3':'51','4':'52','5':'53','6':'54','7':'55','8':'56','9':'57',
		'a':'65','b':'66','c':'67','d':'68','e':'69','f':'70','g':'71','h':'72','i':'73','j':'74','k':'75','l':'76','m':'77',
		'n':'78','o':'79','p':'80','q':'81','r':'82','s':'83','t':'84','u':'85','v':'86','w':'87','x':'88','y':'89','z':'90',
		//normal-characters, numpad
		'num0':'96','num1':'97','num2':'98','num3':'99','num4':'100','num5':'101','num6':'102','num7':'103','num8':'104','num9':'105',
		'*':'106','+':'107','-':'109','.':'110',
		//normal-characters, others
		'/':'111',
		';':'186',
		'=':'187',
		',':'188',
		'-':'189',
		'.':'190',
		'/':'191',
		'`':'192',
		'[':'219',
		'\\':'220',
		']':'221',
		"'":'222',
		
		//ignore these, you shouldn't use them
		'left window key':'91','right window key':'92','select key':'93',
		
		
		'f1':'112','f2':'113','f3':'114','f4':'115','f5':'116','f6':'117',
		'f7':'118','f8':'119','f9':'120','f10':'121','f11':'122','f12':'123'
	});
	
	/**
	 * @parent jQuery.event.key
	 * @plugin jquery/event/key
	 * @function jQuery.Event.prototype.keyName
	 *
	 * Returns a string representation of the key pressed:
	 *
	 *      $("input").on('keypress', function(ev){
	 *          if(ev.keyName() == 'ctrl') {
	 *              $(this).addClass('highlight');
	 *          }
	 *      });
	 *
	 * The key names mapped by default can be found in the [jQuery.event.key jQuery.event.key overview].
	 *
	 * @return {String} The string representation of of the key pressed.
	 */
	jQuery.Event.prototype.keyName  = function(){
		var event = this,
			keycode,
			test = /\w/;
	
		var key_Key =   reverseKeyMap[(event.keyCode || event.which)+""],
			char_Key =  String.fromCharCode(event.keyCode || event.which),
			key_Char =  event.charCode && reverseKeyMap[event.charCode+""],
			char_Char = event.charCode && String.fromCharCode(event.charCode);
		
		if( char_Char && test.test(char_Char) ) {
			return char_Char.toLowerCase()
		}
		if( key_Char && test.test(key_Char) ) {
			return char_Char.toLowerCase()
		}
		if( char_Key && test.test(char_Key) ) {
			return char_Key.toLowerCase()
		}
		if( key_Key && test.test(key_Key) ) {
			return key_Key.toLowerCase()
		}

		if (event.type == 'keypress'){
			return event.keyCode ? String.fromCharCode(event.keyCode) : String.fromCharCode(event.which)
		}

		if (!event.keyCode && event.which) {
			return String.fromCharCode(event.which)
		}

		return reverseKeyMap[event.keyCode+""] 
	}
	
	
})(jQuery)