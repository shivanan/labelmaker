#TODO: Change this to not be hard-coded
pxtoinch = (px) ->
	return px/96.0

class LabelObject
	constructor: (@label,@props) ->
		@el = $('<div />').addClass('label-object')
		@el.data 'object',@
		@type ='base'
	
	updateDimensions: (w,h) ->
		console.log 'udateddim',w,h
		@el.css 'width',w + 'in'
		@el.css 'height',h + 'in'
	serialize: () ->
		r = 
			type: @type
		for k,v of @props
			r[k] = v
		r['width'] = pxtoinch @el.width()
		r['height'] = pxtoinch @el.height()
		
		pos = @el.position()
		r['x'] = pxtoinch pos.left
		r['y'] = pxtoinch pos.top
		
		return r

class TextObject extends LabelObject
	constructor: (@label,@props) ->
		super @label,@props
		@type = 'text'
		
		@el.addClass('text')
		@el.text @props.text
		@updateDimensions(@props.width,@props.height)
		@updateProps(@props)

	updateProps: (props) ->
		if props['font-size']
			@props['font-size'] = props['font-size']
			@el.css 'font-size',@props['font-size'] + 'in'
		if props['align']
			@props['align'] = props['align']
			@el.css 'text-align',@props['align']
		if props['font']
			@props['font'] = props['font']
			@el.css 'font-family',@props['font']
	
	incrementFontSize: (dir) ->
		fs = @props['font-size']
		fs += dir*0.1
		@updateProps
			'font-size': fs

	serialize: () ->
		r = super()
		r['text'] = @el.text()
		return r


class Label
	constructor: (@el,@width,@height) ->
		@el.addClass 'labelcanvas'
		@el.bind 'click',() =>
			@unselectAll()
		@setWidth @width
		@setHeight @height

	setWidth: (inches) ->
		@el.css('width',inches + 'in')
		@width = inches

	setHeight: (inches) ->
		@el.css('height',inches + 'in')
		@height = inches

	serialize: () ->
		objects = for els in @el.find('.label-object')
			to = $(els).data 'object'
			to.serialize()
		sobj = 
			width: @width
			height: @height
			objects: objects
	addText: (txt) ->
		console.log 'object added',@width,@height
		to = new TextObject @,
			text: txt
			'font-size':1
			'font':'Helvetica'
			width: @width - 0.5
			height: @height - 0.5

		to.el.draggable
			start: () =>
				@objectClicked to
		
		to.el.resizable
			start: () =>
				@objectClicked to
		
		to.el.bind 'click',(evnt) =>
			evnt.stopPropagation()
			@objectClicked to
		
		@el.append(to.el)

	unselectAll: () ->
		@el.find('.label-object').removeClass('selected')
	
	getSelectedObject: () ->
		@el.find('.selected').data('object')
	
	objectClicked: (obj) ->
		@unselectAll()
		obj.el.addClass 'selected'
		to = obj.el.data 'object'
		console.log 'Found obj',to


root = window || this
root.Label = Label
root.TextObject = TextObject
root.LabelObject = LabelObject