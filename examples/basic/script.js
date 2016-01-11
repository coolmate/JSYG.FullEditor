$(function() {
    
    window.svgEditor = new JSYG.FullEditor('svg');
    
    svgEditor.editableShapes = "> *";
    
    svgEditor.enable();
    
    
    ["left","center","right","top","middle","bottom"].forEach(function(type) {
        
        $('#align'+JSYG.ucfirst(type)).on("click",function() {
            svgEditor.align(type);
        })
    });
    
    ["Front","Back","ToFront","ToBack"].forEach(function(type) {
        
        $('#move'+type).on("click",function() {
            svgEditor["moveTarget"+type]();
        });
    });
   
    $("#newDocument").on("click",function() {
        svgEditor.newDocument( $('#width').val(), $('#height').val() );
    });
    
    $("#openDocument").on("click",function() {
        $("#uploadFile").trigger("click");
    });
    
    $("#uploadFile").on("change",function() {
        svgEditor.loadFile(this.files[0])
            .catch(alert);
    });
    
    $('#openExample').on("click",function() {
        $('#exampleChoice').modal();
    });
    
    $('#confirmExample').on("click",function() {
        $('#exampleChoice').modal("hide");
        svgEditor.loadURL('../' + $('#examples').val() + '.svg');
    });
    
    svgEditor.on("load",function() {
        var dim = svgEditor.getDimDocument();
        $('#width').val(dim.width);
        $('#height').val(dim.height);
    });
    
    $('#width').on("change",function() {
        svgEditor.setDimDocument({width:this.value});
    });
    
    $('#height').on("change",function() {
        svgEditor.setDimDocument({height:this.value});
    });
    
    
    $('.collapse').collapse({parent:"#accordion"});
    
    $('#viewPanel').on("hide.bs.collapse",function() {
        svgEditor.disableMousePan();
        $('#mousePan').removeClass("active");
    });
    
    $('#mousePan').on("click",function() {
        svgEditor.enableMousePan();
        $(this).addClass("active");
    });
    
    $('#drawShapes').on({
        "show.bs.collapse":function () {
            $('#shape').trigger("change");
        },
        "hide.bs.collapse":function() {
            svgEditor.disableShapeDrawer();
            svgEditor.disableInsertElement();
        }
    });
    
    $('#shape').on("change",function() {
        
        var type = this.value;
        
        if (type.indexOf("path")!=-1) {
            svgEditor.drawingPathMethod = (type == "path") ? "point2point" : "freehand";
            type = "path";
        }
        
        var shape = new JSYG("<"+type+">").addClass("perso");
        
        if (type == "text") svgEditor.enableInsertElement(shape);
        else svgEditor.enableShapeDrawer(shape);
    });
    
    $('#marqueeZoom').on("click",function() {
        svgEditor.enableMarqueeZoom();
    });
    
    $('#fitToCanvas').on("click",function() {
        svgEditor.zoomTo('canvas');
    });
    
    $('#realSize').on("click",function() {
        svgEditor.zoomTo(100);
    });
    
    $('#zoomIn').on("click",function() {
        svgEditor.zoom(+10);
    });
    
    $('#zoomOut').on("click",function() {
        svgEditor.zoom(-10);
    });
    
    ["remove","copy","cut","paste","undo","redo","group","ungroup"].forEach(function(action) {
        
        $('#'+action).on("click",function() {
            svgEditor[action]();
        });
    });
    
    ["canvasResizable","editPathMainPoints","editPathCtrlPoints","keepShapesRatio","autoSmoothPaths","useTransformAttr","editPosition","editSize","editRotation","editText"].forEach(function(property) {
        
        $('#'+property).on("change",function() {
            svgEditor[property] = this.checked;
            new JSYG(this).blur();
        }).trigger("change");
    });
    
    ["toSVGDataURL","toPNGDataURL"].forEach(function(action) {
        
        $("#"+action).on("click",function() {
            svgEditor[action]().then(function(url) {
                window.open(url);
            });
        });
    });
    
    svgEditor.registerKeyShortCut({
        "ctrl+c": svgEditor.copy,
        "ctrl+x": svgEditor.cut,
        "ctrl+v": svgEditor.paste,
        "ctrl+z": svgEditor.undo,
        "ctrl+y": svgEditor.redo,
        "ctrl+a":svgEditor.selectAll,
        "del": svgEditor.remove
    });
    
    svgEditor.newDocument(500,500);
    
    svgEditor.enableDropImages();
    //svgEditor.loadURL("examples/world.svg");
    
});