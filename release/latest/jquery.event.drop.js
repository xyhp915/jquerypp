(function($){
	var getSetZero = function(v){ return v !== undefined ? (this.array[0] = v) : this.array[0] },
		getSetOne = function(v){ return v !== undefined ? (this.array[1] = v) : this.array[1] }
/**
 * @class jQuery.Vector
 * @parent jquerypp
 *
 * A vector class
 *
 * @constructor creates a new vector instance from the arguments.  Example:
 * @codestart
 * new jQuery.Vector(1,2)
 * @codeend
 * 
 */
	$.Vector = function() {
		this.update($.makeArray(arguments));
	};
	$.Vector.prototype =
	/* @Prototype*/
	{
		/**
		 * Applys the function to every item in the vector and returns a new vector.
		 *
		 * @param {Function} f The function to apply
		 * @return {jQuery.Vector} A new $.Vector instance
		 */
		app: function( f ) {
			var i, vec, newArr = [];

			for ( i = 0; i < this.array.length; i++ ) {
				newArr.push(f(this.array[i]));
			}
			vec = new $.Vector();
			return vec.update(newArr);
		},
		/**
		 * Adds two vectors together and returns a new instance. Example:
		 *
		 * @codestart
		 * new Vector(1,2).plus(2,3) //-> &lt;3,5>
		 * new Vector(3,5).plus(new Vector(4,5)) //-> &lt;7,10>
		 * @codeend
		 * @return {$.Vector}
		 */
		plus: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				arr[i] = (arr[i] ? arr[i] : 0) + args[i];
			}
			return vec.update(arr);
		},
		/**
		 * Subtract one vector from another.
		 *
		 * @return {jQuery.Vector}
		 */
		minus: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				arr[i] = (arr[i] ? arr[i] : 0) - args[i];
			}
			return vec.update(arr);
		},
		/**
		 * Returns the current vector if it is equal to the vector passed in.
		 *
		 * False if otherwise.
		 * @return {jQuery.Vector}
		 */
		equals: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				if ( arr[i] != args[i] ) {
					return null;
				}
			}
			return vec.update(arr);
		},
		/**
		 * Returns the first value of the vector
		 * @return {Number}
		 */
		x: getSetZero,
		/**
		 * same as x()
		 * @return {Number}
		 */
		left: getSetZero,
		/**
		 * Returns the first value of the vector
		 * @return {Number}
		 */
		width: getSetZero,
		/**
		 * Returns the 2nd value of the vector
		 * @return {Number}
		 */
		y: getSetOne,
		/**
		 * Same as y()
		 * @return {Number}
		 */
		top: getSetOne,
		/**
		 * Returns the 2nd value of the vector
		 * @return {Number}
		 */
		height: getSetOne,
		/**
		 * returns (x,y)
		 * @return {String}
		 */
		toString: function() {
			return "(" + this.array[0] + "," + this.array[1] + ")";
		},
		/**
		 * Replaces the vectors contents
		 *
		 * @param {Object} array
		 */
		update: function( array ) {
			var i;
			if ( this.array ) {
				for ( i = 0; i < this.array.length; i++ ) {
					delete this.array[i];
				}
			}
			this.array = array;
			for ( i = 0; i < array.length; i++ ) {
				this[i] = this.array[i];
			}
			return this;
		}
	};

	$.Event.prototype.vector = function() {
		if ( this.originalEvent.synthetic ) {
			var doc = document.documentElement,
				body = document.body;
			return new $.Vector(this.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0), this.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0));
		} else {
			return new $.Vector(this.pageX, this.pageY);
		}
	};

	$.fn.offsetv = function() {
		if ( this[0] == window ) {
			return new $.Vector(window.pageXOffset ? window.pageXOffset : document.documentElement.scrollLeft, window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop);
		} else {
			var offset = this.offset();
			return new $.Vector(offset.left, offset.top);
		}
	};

	$.fn.dimensionsv = function( which ) {
		if ( this[0] == window || !which ) {
			return new $.Vector(this.width(), this.height());
		}
		else {
			return new $.Vector(this[which + "Width"](), this[which + "Height"]());
		}
	};
})(jQuery);
(function() {

	var event = jQuery.event,

		//helper that finds handlers by type and calls back a function, this is basically handle
		// events - the events object
		// types - an array of event types to look for
		// callback(type, handlerFunc, selector) - a callback
		// selector - an optional selector to filter with, if there, matches by selector
		//     if null, matches anything, otherwise, matches with no selector
		findHelper = function( events, types, callback, selector ) {
			var t, type, typeHandlers, all, h, handle, 
				namespaces, namespace,
				match;
			for ( t = 0; t < types.length; t++ ) {
				type = types[t];
				all = type.indexOf(".") < 0;
				if (!all ) {
					namespaces = type.split(".");
					type = namespaces.shift();
					namespace = new RegExp("(^|\\.)" + namespaces.slice(0).sort().join("\\.(?:.*\\.)?") + "(\\.|$)");
				}
				typeHandlers = (events[type] || []).slice(0);

				for ( h = 0; h < typeHandlers.length; h++ ) {
					handle = typeHandlers[h];
					
					match = (all || namespace.test(handle.namespace));
					
					if(match){
						if(selector){
							if (handle.selector === selector  ) {
								callback(type, handle.origHandler || handle.handler);
							}
						} else if (selector === null){
							callback(type, handle.origHandler || handle.handler, handle.selector);
						}
						else if (!handle.selector ) {
							callback(type, handle.origHandler || handle.handler);
							
						} 
					}
					
					
				}
			}
		};

	/**
	 * Finds event handlers of a given type on an element.
	 * @param {HTMLElement} el
	 * @param {Array} types an array of event names
	 * @param {String} [selector] optional selector
	 * @return {Array} an array of event handlers
	 */
	event.find = function( el, types, selector ) {
		var events = ( $._data(el) || {} ).events,
			handlers = [],
			t, liver, live;

		if (!events ) {
			return handlers;
		}
		findHelper(events, types, function( type, handler ) {
			handlers.push(handler);
		}, selector);
		return handlers;
	};
	/**
	 * Finds all events.  Group by selector.
	 * @param {HTMLElement} el the element
	 * @param {Array} types event types
	 */
	event.findBySelector = function( el, types ) {
		var events = $._data(el).events,
			selectors = {},
			//adds a handler for a given selector and event
			add = function( selector, event, handler ) {
				var select = selectors[selector] || (selectors[selector] = {}),
					events = select[event] || (select[event] = []);
				events.push(handler);
			};

		if (!events ) {
			return selectors;
		}
		//first check live:
		/*$.each(events.live || [], function( i, live ) {
			if ( $.inArray(live.origType, types) !== -1 ) {
				add(live.selector, live.origType, live.origHandler || live.handler);
			}
		});*/
		//then check straight binds
		findHelper(events, types, function( type, handler, selector ) {
			add(selector || "", type, handler);
		}, null);

		return selectors;
	};
	event.supportTouch = "ontouchend" in document;
	
	$.fn.respondsTo = function( events ) {
		if (!this.length ) {
			return false;
		} else {
			//add default ?
			return event.find(this[0], $.isArray(events) ? events : [events]).length > 0;
		}
	};
	$.fn.triggerHandled = function( event, data ) {
		event = (typeof event == "string" ? $.Event(event) : event);
		this.trigger(event, data);
		return event.handled;
	};
	/**
	 * Only attaches one event handler for all types ...
	 * @param {Array} types llist of types that will delegate here
	 * @param {Object} startingEvent the first event to start listening to
	 * @param {Object} onFirst a function to call 
	 */
	event.setupHelper = function( types, startingEvent, onFirst ) {
		if (!onFirst ) {
			onFirst = startingEvent;
			startingEvent = null;
		}
		var add = function( handleObj ) {

			var bySelector, selector = handleObj.selector || "";
			if ( selector ) {
				bySelector = event.find(this, types, selector);
				if (!bySelector.length ) {
					$(this).delegate(selector, startingEvent, onFirst);
				}
			}
			else {
				//var bySelector = event.find(this, types, selector);
				if (!event.find(this, types, selector).length ) {
					event.add(this, startingEvent, onFirst, {
						selector: selector,
						delegate: this
					});
				}

			}

		},
			remove = function( handleObj ) {
				var bySelector, selector = handleObj.selector || "";
				if ( selector ) {
					bySelector = event.find(this, types, selector);
					if (!bySelector.length ) {
						$(this).undelegate(selector, startingEvent, onFirst);
					}
				}
				else {
					if (!event.find(this, types, selector).length ) {
						event.remove(this, startingEvent, onFirst, {
							selector: selector,
							delegate: this
						});
					}
				}
			};
		$.each(types, function() {
			event.special[this] = {
				add: add,
				remove: remove,
				setup: function() {},
				teardown: function() {}
			};
		});
	};
})(jQuery);
(function( $ ) {
	//modify live
	//steal the live handler ....
	var bind = function( object, method ) {
		var args = Array.prototype.slice.call(arguments, 2);
		return function() {
			var args2 = [this].concat(args, $.makeArray(arguments));
			return method.apply(object, args2);
		};
	},
		event = $.event,
		clearSelection = window.getSelection ? function(){
				window.getSelection().removeAllRanges()
			} : function(){};
	// var handle = event.handle; //unused
	/**
	 * @class jQuery.Drag
	 * @parent jQuery.event.drag
	 * @plugin jquery/event/drag
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/drag/drag.js
	 * @test jquery/event/drag/qunit.html
	 *
	 * The `$.Drag` constructor is never called directly but an instance of `$.Drag` is passed as the second argument
	 * to the `dragdown`, `draginit`, `dragmove`, `dragend`, `dragover` and `dragout` event handlers:
	 *
	 *      $('#dragger').on('draginit', function(el, drag) {
	 *          // drag -> $.Drag
	 *      });
	 */
	$.Drag = function() {};

	/**
	 * @Static
	 */
	$.extend($.Drag, {
		lowerName: "drag",
		current: null,
		distance: 0,
		/**
		 * Called when someone mouses down on a draggable object.
		 * Gathers all callback functions and creates a new Draggable.
		 * @hide
		 */
		mousedown: function( ev, element ) {
			var isLeftButton = ev.button === 0 || ev.button == 1;
			if (!isLeftButton || this.current ) {
				return;
			} //only allows 1 drag at a time, but in future could allow more
			//ev.preventDefault();
			//create Drag
			var drag = new $.Drag(),
				delegate = ev.delegateTarget || element,
				selector = ev.handleObj.selector,
				self = this;
			this.current = drag;

			drag.setup({
				element: element,
				delegate: ev.delegateTarget || element,
				selector: ev.handleObj.selector,
				moved: false,
				_distance: this.distance,
				callbacks: {
					dragdown: event.find(delegate, ["dragdown"], selector),
					draginit: event.find(delegate, ["draginit"], selector),
					dragover: event.find(delegate, ["dragover"], selector),
					dragmove: event.find(delegate, ["dragmove"], selector),
					dragout: event.find(delegate, ["dragout"], selector),
					dragend: event.find(delegate, ["dragend"], selector)
				},
				destroyed: function() {
					self.current = null;
				}
			}, ev);
		}
	});
	
	/**
	 * @Prototype
	 */
	$.extend($.Drag.prototype, {
		setup: function( options, ev ) {
			$.extend(this, options);
			this.element = $(this.element);
			this.event = ev;
			this.moved = false;
			this.allowOtherDrags = false;
			var mousemove = bind(this, this.mousemove),
				mouseup = bind(this, this.mouseup);
			this._mousemove = mousemove;
			this._mouseup = mouseup;
			this._distance = options.distance ? options.distance : 0;
			
			this.mouseStartPosition = ev.vector(); //where the mouse is located
			
			$(document).bind('mousemove', mousemove);
			$(document).bind('mouseup', mouseup);

			if (!this.callEvents('down', this.element, ev) ) {
			    this.noSelection(this.delegate);
				//this is for firefox
				clearSelection();
			}
		},
		/**
		 * Unbinds listeners and allows other drags ...
		 * @hide
		 */
		destroy: function() {
			$(document).unbind('mousemove', this._mousemove);
			$(document).unbind('mouseup', this._mouseup);
			if (!this.moved ) {
				this.event = this.element = null;
			}

            this.selection(this.delegate);
			this.destroyed();
		},
		mousemove: function( docEl, ev ) {
			if (!this.moved ) {
				var dist = Math.sqrt( Math.pow( ev.pageX - this.event.pageX, 2 ) + Math.pow( ev.pageY - this.event.pageY, 2 ));
				if(dist < this._distance){
					return false;
				}
				
				this.init(this.element, ev);
				this.moved = true;
			}

			var pointer = ev.vector();
			if ( this._start_position && this._start_position.equals(pointer) ) {
				return;
			}
			//e.preventDefault();
			this.draw(pointer, ev);
		},
		
		mouseup: function( docEl, event ) {
			//if there is a current, we should call its dragstop
			if ( this.moved ) {
				this.end(event);
			}
			this.destroy();
		},

        /**
         * The `drag.noSelection(element)` method turns off text selection during a drag event.
         * This method is called by default unless a event is listening to the 'dragdown' event.
         *
         * ## Example
         *
         *      $('div.drag').bind('dragdown', function(elm,event,drag){
         *          drag.noSelection();
         *      });
         *      
         * @param [elm] an element to prevent selection on.  Defaults to the dragable element.
         */
		noSelection: function(elm) {
            elm = elm || this.delegate
            
			document.documentElement.onselectstart = function() {
				return false;
			};
			document.documentElement.unselectable = "on";
			this.selectionDisabled = (this.selectionDisabled ? this.selectionDisabled.add(elm) : $(elm));
			this.selectionDisabled.css('-moz-user-select', '-moz-none');
		},

        /**
         * @hide
         * `drag.selection()` method turns on text selection that was previously turned off during the drag event.
         * This method is always called.
         * 
         * ## Example
         *
         *     $('div.drag').bind('dragdown', function(elm,event,drag){
         *       drag.selection();
         *     });
         */
		selection: function() {
            if(this.selectionDisabled){
                document.documentElement.onselectstart = function() {};
                document.documentElement.unselectable = "off";
                this.selectionDisabled.css('-moz-user-select', '');
            }
		},

		init: function( element, event ) {
			element = $(element);
			var startElement = (this.movingElement = (this.element = $(element))); //the element that has been clicked on
			//if a mousemove has come after the click
			this._cancelled = false; //if the drag has been cancelled
			this.event = event;
			
			/**
			 * @attribute mouseElementPosition
			 * The position of start of the cursor on the element
			 */
			this.mouseElementPosition = this.mouseStartPosition.minus(this.element.offsetv()); //where the mouse is on the Element
			//this.callStart(element, event);
			this.callEvents('init', element, event);

			//Check what they have set and respond accordingly
			//  if they canceled
			if ( this._cancelled === true ) {
				return;
			}
			//if they set something else as the element
			this.startPosition = startElement != this.movingElement ? this.movingElement.offsetv() : this.currentDelta();

			this.makePositioned(this.movingElement);
			this.oldZIndex = this.movingElement.css('zIndex');
			this.movingElement.css('zIndex', 1000);
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.compile(event, this);
			}
		},
		makePositioned: function( that ) {
			var style, pos = that.css('position');

			if (!pos || pos == 'static' ) {
				style = {
					position: 'relative'
				};

				if ( window.opera ) {
					style.top = '0px';
					style.left = '0px';
				}
				that.css(style);
			}
		},
		callEvents: function( type, element, event, drop ) {
			var i, cbs = this.callbacks[this.constructor.lowerName + type];
			for ( i = 0; i < cbs.length; i++ ) {
				cbs[i].call(element, event, this, drop);
			}
			return cbs.length;
		},
		/**
		 * Returns the position of the movingElement by taking its top and left.
		 * @hide
		 * @return {Vector}
		 */
		currentDelta: function() {
			return new $.Vector(parseInt(this.movingElement.css('left'), 10) || 0, parseInt(this.movingElement.css('top'), 10) || 0);
		},
		//draws the position of the dragmove object
		draw: function( pointer, event ) {
			// only drag if we haven't been cancelled;
			if ( this._cancelled ) {
				return;
			}
			clearSelection();
			/**
			 * @attribute location
			 * `drag.location` is a vector specifying where the element should be in the page.  This 
			 * takes into account the start position of the cursor on the element.
			 * 
			 * If the drag is going to be moved to an unacceptable location, you can call preventDefault in
			 * dragmove to prevent it from being moved there.
			 * 
			 *     $('.mover').bind("dragmove", function(ev, drag){
			 *       if(drag.location.top() < 100){
			 *         ev.preventDefault()
			 *       }
			 *     });
			 *     
			 * You can also set the location to where it should be on the page.
			 * 
			 */
			this.location = pointer.minus(this.mouseElementPosition); // the offset between the mouse pointer and the representative that the user asked for
			// position = mouse - (dragOffset - dragTopLeft) - mousePosition
			
			// call move events
			this.move(event);
			if ( this._cancelled ) {
				return;
			}
			if (!event.isDefaultPrevented() ) {
				this.position(this.location);
			}

			//fill in
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.show(pointer, this, event);
			}
		},
		/**
		 * `drag.position( newOffsetVector )` sets the position of the movingElement.  This is overwritten by
		 * the [$.Drag::scrolls], [$.Drag::limit] and [$.Drag::step] plugins 
		 * to make sure the moving element scrolls some element
		 * or stays within some boundary.  This function is exposed and documented so you could do the same.
		 * 
		 * The following approximates how step does it:
		 * 
		 *     var oldPosition = $.Drag.prototype.position;
		 *     $.Drag.prototype.position = function( offsetPositionv ) {
		 *       if(this._step){
		 *         // change offsetPositionv to be on the step value
		 *       }
		 *       
		 *       oldPosition.call(this, offsetPosition)
		 *     }
		 * 
		 * @param {jQuery.Vector} newOffsetv the new [$.Drag::location] of the element.
		 */
		position: function( newOffsetv ) { //should draw it on the page
			var style, dragged_element_css_offset = this.currentDelta(),
				//  the drag element's current left + top css attributes
				dragged_element_position_vector = // the vector between the movingElement's page and css positions
				this.movingElement.offsetv().minus(dragged_element_css_offset); // this can be thought of as the original offset
			this.required_css_position = newOffsetv.minus(dragged_element_position_vector);

			this.offsetv = newOffsetv;
			//dragged_element vector can probably be cached.
			style = this.movingElement[0].style;
			if (!this._cancelled && !this._horizontal ) {
				style.top = this.required_css_position.top() + "px";
			}
			if (!this._cancelled && !this._vertical ) {
				style.left = this.required_css_position.left() + "px";
			}
		},
		move: function( event ) {
			this.callEvents('move', this.element, event);
		},
		over: function( event, drop ) {
			this.callEvents('over', this.element, event, drop);
		},
		out: function( event, drop ) {
			this.callEvents('out', this.element, event, drop);
		},
		/**
		 * Called on drag up
		 * @hide
		 * @param {Event} event a mouseup event signalling drag/drop has completed
		 */
		end: function( event ) {
			if ( this._cancelled ) {
				return;
			}
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.end(event, this);
			}

			this.callEvents('end', this.element, event);

			if ( this._revert ) {
				var self = this;
				this.movingElement.animate({
					top: this.startPosition.top() + "px",
					left: this.startPosition.left() + "px"
				}, function() {
					self.cleanup.apply(self, arguments);
				});
			}
			else {
				this.cleanup();
			}
			this.event = null;
		},
		/**
		 * Cleans up drag element after drag drop.
		 * @hide
		 */
		cleanup: function() {
			this.movingElement.css({
				zIndex: this.oldZIndex
			});
			if ( this.movingElement[0] !== this.element[0] && 
				!this.movingElement.has(this.element[0]).length && 
				!this.element.has(this.movingElement[0]).length ) {
				this.movingElement.css({
					display: 'none'
				});
			}
			if ( this._removeMovingElement ) {
				this.movingElement.remove();
			}

			this.movingElement = this.element = this.event = null;
		},
		/**
		 * `drag.cancel()` stops a drag motion from from running.  This also stops any other events from firing, meaning
		 * that "dragend" will not be called.
		 * 
		 *     $("#todos").on(".handle", "draginit", function( ev, drag ) {
		 *       if(drag.movingElement.hasClass("evil")){
		 *         drag.cancel();	
		 *       }
		 *     })
		 * 
		 */
		cancel: function() {
			this._cancelled = true;
			//this.end(this.event);
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.clear(this.event.vector(), this, this.event);
			}
			this.destroy();

		},
		/**
		 * `drag.ghost( [parent] )` clones the element and uses it as the 
		 * moving element, leaving the original dragged element in place.  The `parent` option can
		 * be used to specify where the ghost element should be temporarily added into the 
		 * DOM.  This method should be called in "draginit".
		 * 
		 *     $("#todos").on(".handle", "draginit", function( ev, drag ) {
		 *       drag.ghost();
		 *     })
		 * 
		 * @param {HTMLElement} [parent] the parent element of the newly created ghost element. If not provided the 
		 * ghost element is added after the moving element.
		 * @return {jQuery.fn} the ghost element to do whatever you want with it.
		 */
		ghost: function( parent ) {
			// create a ghost by cloning the source element and attach the clone to the dom after the source element
			var ghost = this.movingElement.clone().css('position', 'absolute');
			if( parent ) {
				$(parent).append(ghost);
			} else {
				$(this.movingElement).after(ghost)
			}
			ghost.width(this.movingElement.width()).height(this.movingElement.height());
			// put the ghost in the right location ...
			ghost.offset(this.movingElement.offset())
			
			// store the original element and make the ghost the dragged element
			this.movingElement = ghost;
			this.noSelection(ghost)
			this._removeMovingElement = true;
			return ghost;
		},
		/**
		 * `drag.representative( element, [offsetX], [offsetY])` tells the drag motion to use
		 * a different element than the one that began the drag motion. 
		 * 
		 * For example, instead of
		 * dragging an drag-icon of a todo element, you want to move some other representation of
		 * the todo element (or elements).  To do this you might:
		 * 
		 *     $("#todos").on(".handle", "draginit", function( ev, drag ) {
		 *       // create what we'll drag
		 *       var rep = $('<div/>').text("todos")
		 *         .appendTo(document.body)
		 *       // indicate we want our mouse on the top-right of it
		 *       drag.representative(rep, rep.width(), 0);
		 *     })
		 * 
		 * @param {HTMLElement} element the element you want to actually drag.  This should be 
		 * already in the DOM.
		 * @param {Number} offsetX the x position where you want your mouse on the representative element (defaults to 0)
		 * @param {Number} offsetY the y position where you want your mouse on the representative element (defaults to 0)
		 * @return {drag} returns the drag object for chaining.
		 */
		representative: function( element, offsetX, offsetY ) {
			this._offsetX = offsetX || 0;
			this._offsetY = offsetY || 0;

			var p = this.mouseStartPosition;

			this.movingElement = $(element);
			this.movingElement.css({
				top: (p.y() - this._offsetY) + "px",
				left: (p.x() - this._offsetX) + "px",
				display: 'block',
				position: 'absolute'
			}).show();
			this.noSelection(this.movingElement)
			this.mouseElementPosition = new $.Vector(this._offsetX, this._offsetY);
			return this;
		},
		/**
		 * `drag.revert([val])` makes the [$.Drag::representative representative] element revert back to it
		 * original position after the drag motion has completed.  The revert is done with an animation.
		 * 
		 *     $("#todos").on(".handle","dragend",function( ev, drag ) {
		 *       drag.revert();
		 *     })
		 * 
		 * @param {Boolean} [val] optional, set to false if you don't want to revert.
		 * @return {drag} the drag object for chaining
		 */
		revert: function( val ) {
			this._revert = val === undefined ? true : val;
			return this;
		},
		/**
		 * `drag.vertical()` isolates the drag to vertical movement.  For example:
		 * 
		 *     $("#images").on(".thumbnail","draginit", function(ev, drag){
		 *       drag.vertical();
		 *     });
		 * 
		 * Call `vertical()` in "draginit" or "dragdown".
		 * 
		 * @return {drag} the drag object for chaining.
		 */
		vertical: function() {
			this._vertical = true;
			return this;
		},
		/**
		 * `drag.horizontal()` isolates the drag to horizontal movement.  For example:
		 * 
		 *     $("#images").on(".thumbnail","draginit", function(ev, drag){
		 *       drag.horizontal();
		 *     });
		 * 
		 * Call `horizontal()` in "draginit" or "dragdown".
		 * 
		 * @return {drag} the drag object for chaining.
		 */
		horizontal: function() {
			this._horizontal = true;
			return this;
		},
		/**
		 * `drag.only([only])` indicates if you __only__ want a drag motion and the drag should
		 * not notify drops.  The default value is `false`.  Call it with no arguments or pass it true
		 * to prevent drop events.
		 * 
		 *     $("#images").on(".thumbnail","dragdown", function(ev, drag){
		 * 	     drag.only();
		 *     });
		 * 
		 * @param {Boolean} [only] true if you want to prevent drops, false if otherwise.
		 * @return {Boolean} the current value of only.
		 */
		only: function( only ) {
			return (this._only = (only === undefined ? true : only));
		},
		
		/**
		 * `distance([val])` sets or reads the distance the mouse must move before a drag motion is started.  This should be set in
		 * "dragdown" and delays "draginit" being called until the distance is covered.  The distance
		 * is measured in pixels.  The default distance is 0 pixels meaning the drag motion starts on the first
		 * mousemove after a mousedown.
		 * 
		 * Set this to make drag motion a little "stickier" to start.
		 * 
		 *     $("#images").on(".thumbnail","dragdown", function(ev, drag){
		 *       drag.distance(10);
		 *     });
		 * 
		 * @param {Number} [val] The number of pixels the mouse must move before "draginit" is called.
		 * @return {drag|Number} returns the drag instance for chaining if the drag value is being set or the
		 * distance value if the distance is being read.
		 */
		distance:function(val){
			if(val !== undefined){
				this._distance = val;
				return this;
			}else{
				return this._distance
			}
		}
	});

	/**
	 * @add jQuery.event.drag
	 */
	event.setupHelper([
	/**
	 * @attribute dragdown
	 * <p>Listens for when a drag movement has started on a mousedown.
	 * If you listen to this, the mousedown's default event (preventing
	 * text selection) is not prevented.  You are responsible for calling it
	 * if you want it (you probably do).  </p>
	 * <p><b>Why might you not want it?</b></p>
	 * <p>You might want it if you want to allow text selection on element
	 * within the drag element.  Typically these are input elements.</p>
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 * @codestart
	 * $(".handles").delegate("dragdown", function(ev, drag){})
	 * @codeend
	 */
	'dragdown',
	/**
	 * @attribute draginit
	 * Called when the drag starts.
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 */
	'draginit',
	/**
	 * @attribute dragover
	 * Called when the drag is over a drop.
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 */
	'dragover',
	/**
	 * @attribute dragmove
	 * Called when the drag is moved.
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 */
	'dragmove',
	/**
	 * @attribute dragout
	 * When the drag leaves a drop point.
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 */
	'dragout',
	/**
	 * @attribute dragend
	 * Called when the drag is done.
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 */
	'dragend'], "mousedown", function( e ) {
		$.Drag.mousedown.call($.Drag, e, this);

	});
})(jQuery);
(function($){
   var withinBox = function(x, y, left, top, width, height ){
        return (y >= top &&
                y <  top + height &&
                x >= left &&
                x <  left + width);
    } 
/**
 * @function jQuery.fn.within
 * @parent jQuery.within
 * @plugin jquery/dom/within
 * 
 * Returns all elements matching the selector that touch a given point:
 * 
 *     // get all elements that touch 200x200.
 *     $('*').within(200, 200);
 * 
 * @param {Number} left the position from the left of the page 
 * @param {Number} top the position from the top of the page
 * @param {Boolean} [useOffsetCache=false] cache the dimensions and offset of the elements.
 * @return {jQuery} a jQuery collection of elements whos area
 * overlaps the element position.
 */
$.fn.within= function(left, top, useOffsetCache) {
    var ret = []
    this.each(function(){
        var q = jQuery(this);

        if (this == document.documentElement) {
			return ret.push(this);
		}
        var offset = useOffsetCache ? 
						jQuery.data(this,"offsetCache") || jQuery.data(this,"offsetCache", q.offset()) : 
						q.offset();

        var res =  withinBox(left, top,  offset.left, offset.top,
                                    this.offsetWidth, this.offsetHeight );

        if (res) {
			ret.push(this);
		}
    });
    
    return this.pushStack( jQuery.unique( ret ), "within", left+","+top );
}


/**
 * @function jQuery.fn.withinBox
 * @parent jQuery.within
 *
 * Returns all elements matching the selector that have a given area in common:
 *
 *      $('*').withinBox(200, 200, 100, 100)
 *
 * @param {Number} left the position from the left of the page
 * @param {Number} top the position from the top of the page
 * @param {Number} width the width of the area
 * @param {Number} height the height of the area
 * @param {Boolean} [useOffsetCache=false] cache the dimensions and offset of the elements.
 * @return {jQuery} a jQuery collection of elements whos area
 * overlaps the element position.
 */
$.fn.withinBox = function(left, top, width, height, useOffsetCache){
	var ret = []
    this.each(function(){
        var q = jQuery(this);

        if(this == document.documentElement) return  ret.push(this);

        var offset = cache ? 
			jQuery.data(this,"offset") || 
			jQuery.data(this,"offset", q.offset()) : 
			q.offset();


        var ew = q.width(), eh = q.height();

		res =  !( (offset.top > top+height) || (offset.top +eh < top) || (offset.left > left+width ) || (offset.left+ew < left));

        if(res)
            ret.push(this);
    });
    return this.pushStack( jQuery.unique( ret ), "withinBox", jQuery.makeArray(arguments).join(",") );
}
    
})(jQuery);
(function($){

/**
 * @function jQuery.fn.compare
 * @parent jQuery.compare
 *
 * Compare two elements and return a bitmask as a number representing the following conditions:
 *
 * - `000000` -> __0__: Elements are identical
 * - `000001` -> __1__: The nodes are in different documents (or one is outside of a document)
 * - `000010` -> __2__: #bar precedes #foo
 * - `000100` -> __4__: #foo precedes #bar
 * - `001000` -> __8__: #bar contains #foo
 * - `001010` -> __10__: #bar precedes #foo __and__ #bar contains #foo
 * - `010000` -> __16__: #foo contains #bar
 * - `010100` -> __20__: #foo precedes #bar __and__ #foo contains #bar
 *
 * You can check for any of these conditions using a bitwise AND:
 *
 *     if( $('#foo').compare($('#bar')) & 2 ) {
 *       console.log("#bar precedes #foo")
 *     }
 *
 * @param {HTMLElement|jQuery} element an element or jQuery collection to compare against.
 * @return {Number} A number representing a bitmask deatiling how the elements are positioned from each other.
 */
jQuery.fn.compare = function(element){ //usually 
	//element is usually a relatedTarget, but element/c it is we have to avoid a few FF errors
	
	try{ //FF3 freaks out with XUL
		element = element.jquery ? element[0] : element;
	}catch(e){
		return null;
	}
	if (window.HTMLElement) { //make sure we aren't coming from XUL element

		var s = HTMLElement.prototype.toString.call(element)
		if (s == '[xpconnect wrapped native prototype]' || s == '[object XULElement]' || s === '[object Window]') {
			return null;
		}

	}
	if(this[0].compareDocumentPosition){
		return this[0].compareDocumentPosition(element);
	}
	if(this[0] == document && element != document) return 8;
	var number = (this[0] !== element && this[0].contains(element) && 16) + (this[0] != element && element.contains(this[0]) && 8),
		docEl = document.documentElement;
	if(this[0].sourceIndex){
		number += (this[0].sourceIndex < element.sourceIndex && 4)
		number += (this[0].sourceIndex > element.sourceIndex && 2)
		number += (this[0].ownerDocument !== element.ownerDocument ||
			(this[0] != docEl && this[0].sourceIndex <= 0 ) ||
			(element != docEl && element.sourceIndex <= 0 )) && 1
	}else{
		var range = document.createRange(), 
			sourceRange = document.createRange(),
			compare;
		range.selectNode(this[0]);
		sourceRange.selectNode(element);
		compare = range.compareBoundaryPoints(Range.START_TO_START, sourceRange);
		
	}

	return number;
}

})(jQuery);
(function($){
	var event = $.event;
	//somehow need to keep track of elements with selectors on them.  When element is removed, somehow we need to know that
	//
	/**
	 * @add jQuery.event.drop
	 */
	var eventNames = [
	/**
	 * @attribute dropover
	 * Called when a drag is first moved over this drop element.
	 *
	 * Drop events are covered in more detail in [jQuery.Drop].
	 */
	"dropover",
	/**
	 * @attribute dropon
	 * Called when a drag is dropped on a drop element.
	 *
	 * Drop events are covered in more detail in [jQuery.Drop].
	 */
	"dropon",
	/**
	 * @attribute dropout
	 * Called when a drag is moved out of this drop.
	 *
	 * Drop events are covered in more detail in [jQuery.Drop].
	 */
	"dropout",
	/**
	 * @attribute dropinit
	 *
	 * Called when a drag motion starts and the drop elements are initialized.
	 *
	 * Drop events are covered in more detail in [jQuery.Drop].
	 */
	"dropinit",
	/**
	 * @attribute dropmove
	 * Called repeatedly when a drag is moved over a drop.
	 *
	 * Drop events are covered in more detail in [jQuery.Drop].
	 */
	"dropmove",
	/**
	 * @attribute dropend
	 * Called when the drag is done for this drop.
	 *
	 * Drop events are covered in more detail in [jQuery.Drop].
	 */
	"dropend"];
	
	/**
	 * @class jQuery.Drop
	 * @parent jQuery.event.drop
	 * @plugin jquery/event/drop
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/drop/drop.js
	 * @test jquery/event/drag/qunit.html
	 *
	 * The `$.Drop` constructor is never called directly but an instance of `$.Drag` is passed as the second argument
	 * to the `dropinit`, `dropover`, `dropmove`, `dropon`, and `dropend` event handlers. The third argument will be
	 * an instance of [jQuery.Drag]:
	 *
	 *      $('#dropper').on('dropover', function(el, drop, drag) {
	 *          // drop -> $.Drop
	 *          // drag -> $.Drag
	 *      });
	 */
	$.Drop = function(callbacks, element){
		jQuery.extend(this,callbacks);
		this.element = $(element);
	}
	// add the elements ...
	$.each(eventNames, function(){
			event.special[this] = {
				add: function( handleObj ) {
					//add this element to the compiles list
					var el = $(this), current = (el.data("dropEventCount") || 0);
					el.data("dropEventCount",  current+1   )
					if(current==0){
						$.Drop.addElement(this);
					}
				},
				remove: function() {
					var el = $(this), current = (el.data("dropEventCount") || 0);
					el.data("dropEventCount",  current-1   )
					if(current<=1){
						$.Drop.removeElement(this);
					}
				}
			}
	});
	
	$.extend($.Drop,{
		/**
		 * @static
		 */
		lowerName: "drop",
		_rootElements: [], //elements that are listening for drops
		_elements: $(),    //elements that can be dropped on
		last_active: [],
		endName: "dropon",
		// adds an element as a 'root' element
		// this element might have events that we need to respond to
		addElement: function( el ) {
			//check other elements
			for(var i =0; i < this._rootElements.length ; i++  ){
				if(el ==this._rootElements[i]) return;
			}
			this._rootElements.push(el);
		},
		removeElement: function( el ) {
			 for(var i =0; i < this._rootElements.length ; i++  ){
				if(el == this._rootElements[i]){
					this._rootElements.splice(i,1)
					return;
				}
			}
		},
		/**
		* @hide
		* For a list of affected drops, sorts them by which is deepest in the DOM first.
		*/ 
		sortByDeepestChild: function( a, b ) {
			var compare = a.element.compare(b.element);
			if(compare & 16 || compare & 4) return 1;
			if(compare & 8 || compare & 2) return -1;
			return 0;
		},
		/**
		 * @hide
		 * Tests if a drop is within the point.
		 */
		isAffected: function( point, moveable, responder ) {
			return ((responder.element != moveable.element) && (responder.element.within(point[0], point[1], responder._cache).length == 1));
		},
		/**
		 * @hide
		 * Calls dropout and sets last active to null
		 * @param {Object} drop
		 * @param {Object} drag
		 * @param {Object} event
		 */
		deactivate: function( responder, mover, event ) {
			mover.out(event, responder)
			responder.callHandlers(this.lowerName+'out',responder.element[0], event, mover)
		}, 
		/**
		 * @hide
		 * Calls dropover
		 * @param {Object} drop
		 * @param {Object} drag
		 * @param {Object} event
		 */
		activate: function( responder, mover, event ) { //this is where we should call over
			mover.over(event, responder)
			//this.last_active = responder;
			responder.callHandlers(this.lowerName+'over',responder.element[0], event, mover);
		},
		move: function( responder, mover, event ) {
			responder.callHandlers(this.lowerName+'move',responder.element[0], event, mover)
		},
		/**
		 * `$.Drop.compile()` gets all elements that are droppable and adds them to a list.
		 * 
		 * This should be called if and when new drops are added to the page
		 * during the motion of a single drag.
		 * 
		 * This is called by default when a drag motion starts.
		 * 
		 * ## Use
		 * 
		 * After adding an element or drop, call compile.
		 * 
		 * $("#midpoint").bind("dropover",function(){
		 * 		// when a drop hovers over midpoint,
		 *      // make drop a drop.
		 * 		$("#drop").bind("dropover", function(){
		 * 			
		 * 		});
		 * 		$.Drop.compile();
		 * 	});
		 */
		compile: function( event, drag ) {
			// if we called compile w/o a current drag
			if(!this.dragging && !drag){
				return;
			}else if(!this.dragging){
				this.dragging = drag;
				this.last_active = [];
				//this._elements = $();
			}
			var el, 
				drops, 
				selector, 
				dropResponders, 
				newEls = [],
				dragging = this.dragging;
			
			// go to each root element and look for drop elements
			for(var i=0; i < this._rootElements.length; i++){ //for each element
				el = this._rootElements[i]
				
				// gets something like {"": ["dropinit"], ".foo" : ["dropover","dropmove"] }
				var drops = $.event.findBySelector(el, eventNames)

				// get drop elements by selector
				for(selector in drops){ 
					
					
					dropResponders = selector ? jQuery(selector, el) : [el];
					
					// for each drop element
					for(var e= 0; e < dropResponders.length; e++){ 
						
						// add the callbacks to the element's Data
						// there already might be data, so we merge it
						if( this.addCallbacks(dropResponders[e], drops[selector], dragging) ){
							newEls.push(dropResponders[e])
						};
					}
				}
			}
			// once all callbacks are added, call init on everything ...
			// todo ... init could be called more than once?
			this.add(newEls, event, dragging)
		},
		// adds the drag callbacks object to the element or merges other callbacks ...
		// returns true or false if the element is new ...
		// onlyNew lets only new elements add themselves
		addCallbacks : function(el, callbacks, onlyNew){
			
			var origData = $.data(el,"_dropData");
			if(!origData){
				$.data(el,"_dropData", new $.Drop(callbacks, el));
				//this._elements.push(el);
				return true;
			}else if(!onlyNew){
				var origCbs = origData;
				// merge data
				for(var eventName in callbacks){
					origCbs[eventName] = origCbs[eventName] ?
							origCbs[eventName].concat(callbacks[eventName]) :
							callbacks[eventName];
				}
				return false;
			}
		},
		// calls init on each element's drags. 
		// if its cancelled it's removed
		// adds to the current elements ...
		add: function( newEls, event, drag , dragging) {
			var i = 0,
				drop;
			
			while(i < newEls.length){
				drop = $.data(newEls[i],"_dropData");
				drop.callHandlers(this.lowerName+'init', newEls[i], event, drag)
				if(drop._canceled){
					newEls.splice(i,1)
				}else{
					i++;
				}
			}
			this._elements.push.apply(this._elements, newEls)
		},
		show: function( point, moveable, event ) {
			var element = moveable.element;
			if(!this._elements.length) return;
			
			var respondable, 
				affected = [], 
				propagate = true, 
				i = 0, 
				j, 
				la, 
				toBeActivated, 
				aff, 
				oldLastActive = this.last_active,
				responders = [],
				self = this,
				drag;
				
			//what's still affected ... we can also move element out here
			while( i < this._elements.length){
				drag = $.data(this._elements[i],"_dropData");
				
				if (!drag) {
					this._elements.splice(i, 1)
				}
				else {
					i++;
					if (self.isAffected(point, moveable, drag)) {
						affected.push(drag);
					}
				}
			}
			

			
			affected.sort(this.sortByDeepestChild); //we should only trigger on lowest children
			event.stopRespondPropagate = function(){
				propagate = false;
			}
			
			toBeActivated = affected.slice();

			// all these will be active
			this.last_active = affected;
			
			//deactivate everything in last_active that isn't active
			for (j = 0; j < oldLastActive.length; j++) {
				la = oldLastActive[j];
				i = 0;
				while((aff = toBeActivated[i])){
					if(la == aff){
						toBeActivated.splice(i,1);break;
					}else{
						i++;
					}
				}
				if(!aff){
					this.deactivate(la, moveable, event);
				}
				if(!propagate) return;
			}
			for(var i =0; i < toBeActivated.length; i++){
				this.activate(toBeActivated[i], moveable, event);
				if(!propagate) return;
			}
			//activate everything in affected that isn't in last_active
			
			for (i = 0; i < affected.length; i++) {
				this.move(affected[i], moveable, event);
				
				if(!propagate) return;
			}
		},
		end: function( event, moveable ) {
			var responder, la, 
				endName = this.lowerName+'end',
				dropData;
			
			// call dropon
			//go through the actives ... if you are over one, call dropped on it
			for(var i = 0; i < this.last_active.length; i++){
				la = this.last_active[i]
				if( this.isAffected(event.vector(), moveable, la)  && la[this.endName]){
					la.callHandlers(this.endName, null, event, moveable);
				}
			}
			// call dropend
			for(var r =0; r<this._elements.length; r++){
				dropData = $.data(this._elements[r],"_dropData");
				dropData && dropData.callHandlers(endName, null, event, moveable);
			}

			this.clear();
		},
		/**
		 * Called after dragging has stopped.
		 * @hide
		 */
		clear: function() {
		  this._elements.each(function(){
		  	$.removeData(this,"_dropData")
		  })
		  this._elements = $();
		  delete this.dragging;
		  //this._responders = [];
		}
	})
	$.Drag.responder = $.Drop;
	
	$.extend($.Drop.prototype,{
		/**
		 * @prototype
		 */
		callHandlers: function( method, el, ev, drag ) {
			var length = this[method] ? this[method].length : 0
			for(var i =0; i < length; i++){
				this[method][i].call(el || this.element[0], ev, this, drag)
			}
		},
		/**
		 * `drop.cache(value)` sets the drop to cache positions of draggable elements.
		 * This should be called in `dropinit`. For example:
		 *
		 *      $('#dropable').on('dropinit', function( el, ev, drop ) {
		 *          drop.cache();
		 *      });
		 *
		 * @param {Boolean} [value=true] Whether to cache drop elements or not.
		 */
		cache: function( value ) {
			this._cache = value != null ? value : true;
		},
		/**
		 * `drop.cancel()` prevents this drop from being dropped on.
		 */
		cancel: function() {
			this._canceled = true;
		}
	} )
})(jQuery)