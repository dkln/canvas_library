class StackedLoader
  @stack: {}
  @loadStack: []
  @toLoad: null
  @onCompleteHandlers: []
  @loading: false

  @add: (id, type, url) ->
    @remove(id) if @stack[id]
    @loadStack.push type: type, url: url, id: id

  @load: (onCompleteHandler) ->
    @onCompleteHandlers.push(onCompleteHandler) if onCompleteHandler?

    unless @loading
      @loading = true
      @loadNext()

  @get: (id) ->
    @stack[id]

  @getClonedBitmap: (id) ->
    new Bitmap(@stack[@toLoad.id])

  @loadNext: ->
    if @loadStack.length == 0
      for onCompleteHandler in @onCompleteHandlers
        onCompleteHandler()

      @onCompleteHandlers = []
      @loading = false
    else
      @toLoad = @loadStack[0]
      @['load' + Utils.firstUpcase(@toLoad.type)]()


  @loadString: ->
    @stack[@toLoad.id] = new XMLHttpRequest()
    @stack[@toLoad.id].onreadystatechange = =>
      if @stack[@toLoad.id].readyState == 4 && @stack[@toLoad.id].status == 200
        @['handle' + Utils.firstUpcase(@toLoad.type) + 'LoadComplete']()

    @stack[@toLoad.id].open 'GET', @toLoad.url, true
    @stack[@toLoad.id].send null

  @loadBitmap: ->
    @stack[@toLoad.id] = new Image()
    @stack[@toLoad.id].onload = => @handleBitmapLoadComplete()
    @stack[@toLoad.id].src = @toLoad.url

  @loadSprite: ->
    @loadString()

  @loadAudio: ->
    @stack[@toLoad.id] = new Audio()
    @stack[@toLoad.id].src = @toLoad.url
    @handleAssetLoadComplete()

  @handleBitmapLoadComplete: ->
    @stack[@toLoad.id].onload = null
    @stack[@toLoad.id] = new Bitmap(@stack[@toLoad.id])
    @stack[@toLoad.id].id = @toLoad.id

    @handleAssetLoadComplete()

  @handleStringLoadComplete: ->
    @stack[@toLoad.id].onreadystatechange = null
    @stack[@toLoad.id] = @stack[@toLoad.id].responseText
    @handleAssetLoadComplete

  @handleSpriteLoadComplete: ->
    @stack[@toLoad.id].onreadystatechange = null
    @stack[@toLoad.id] = new PixelSprite(@stack[@toLoad.id].responseText)
    @handleAssetLoadComplete

  @handleAssetLoadComplete: ->
    @loadStack.splice 0, 1
    @loadNext()
