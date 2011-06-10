(function(){CKEDITOR.plugins.add("undo",{requires:["selection","wysiwygarea"],init:function(h){var k=new f(h);var g=h.addCommand("undo",{exec:function(){if(k.undo()){h.selectionChange();this.fire("afterUndo")}},state:CKEDITOR.TRISTATE_DISABLED,canUndo:false});var i=h.addCommand("redo",{exec:function(){if(k.redo()){h.selectionChange();this.fire("afterRedo")}},state:CKEDITOR.TRISTATE_DISABLED,canUndo:false});k.onChange=function(){g.setState(k.undoable()?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED);i.setState(k.redoable()?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED)};function j(l){if(k.enabled&&l.data.command.canUndo!==false){k.save()}}h.on("beforeCommandExec",j);h.on("afterCommandExec",j);h.on("saveSnapshot",function(){k.save()});h.on("contentDom",function(){h.document.on("keydown",function(l){if(!l.data.$.ctrlKey&&!l.data.$.metaKey){k.type(l)}})});h.on("beforeModeUnload",function(){h.mode=="wysiwyg"&&k.save(true)});h.on("mode",function(){k.enabled=h.readOnly?false:h.mode=="wysiwyg";k.onChange()});h.ui.addButton("Undo",{label:h.lang.undo,command:"undo"});h.ui.addButton("Redo",{label:h.lang.redo,command:"redo"});h.resetUndo=function(){k.reset();h.fire("saveSnapshot")};h.on("updateSnapshot",function(){if(k.currentImage&&new c(h).equals(k.currentImage)){setTimeout(function(){k.update()},0)}})}});CKEDITOR.plugins.undo={};var c=CKEDITOR.plugins.undo.Image=function(h){this.editor=h;h.fire("beforeUndoImage");var i=h.getSnapshot(),g=i&&h.getSelection();CKEDITOR.env.ie&&i&&(i=i.replace(/\s+data-cke-expando=".*?"/g,""));this.contents=i;this.bookmarks=g&&g.createBookmarks2(true);h.fire("afterUndoImage")};var e=/\b(?:href|src|name)="[^"]*?"/gi;c.prototype={equals:function(p,k){var n=this.contents,o=p.contents;if(CKEDITOR.env.ie&&(CKEDITOR.env.ie7Compat||CKEDITOR.env.ie6Compat)){n=n.replace(e,"");o=o.replace(e,"")}if(n!=o){return false}if(k){return true}var h=this.bookmarks,g=p.bookmarks;if(h||g){if(!h||!g||h.length!=g.length){return false}for(var m=0;m<h.length;m++){var l=h[m],j=g[m];if(l.startOffset!=j.startOffset||l.endOffset!=j.endOffset||!CKEDITOR.tools.arrayCompare(l.start,j.start)||!CKEDITOR.tools.arrayCompare(l.end,j.end)){return false}}}return true}};function f(g){this.editor=g;this.reset()}var b={8:1,46:1},d={16:1,17:1,18:1},a={37:1,38:1,39:1,40:1};f.prototype={type:function(j){var o=j&&j.data.getKey(),g=o in d,k=o in b,p=this.lastKeystroke in b,q=k&&o==this.lastKeystroke,n=o in a,r=this.lastKeystroke in a,i=(!k&&!n),h=(k&&!q),m=!(g||this.typing)||(i&&(p||r));if(m||h){var l=new c(this.editor);CKEDITOR.tools.setTimeout(function(){var s=this.editor.getSnapshot();if(CKEDITOR.env.ie){s=s.replace(/\s+data-cke-expando=".*?"/g,"")}if(l.contents!=s){this.typing=true;if(!this.save(false,l,false)){this.snapshots.splice(this.index+1,this.snapshots.length-this.index-1)}this.hasUndo=true;this.hasRedo=false;this.typesCount=1;this.modifiersCount=1;this.onChange()}},0,this)}this.lastKeystroke=o;if(k){this.typesCount=0;this.modifiersCount++;if(this.modifiersCount>25){this.save(false,null,false);this.modifiersCount=1}}else{if(!n){this.modifiersCount=0;this.typesCount++;if(this.typesCount>25){this.save(false,null,false);this.typesCount=1}}}},reset:function(){this.lastKeystroke=0;this.snapshots=[];this.index=-1;this.limit=this.editor.config.undoStackSize||20;this.currentImage=null;this.hasUndo=false;this.hasRedo=false;this.resetType()},resetType:function(){this.typing=false;delete this.lastKeystroke;this.typesCount=0;this.modifiersCount=0},fireChange:function(){this.hasUndo=!!this.getNextImage(true);this.hasRedo=!!this.getNextImage(false);this.resetType();this.onChange()},save:function(g,i,j){var h=this.snapshots;if(!i){i=new c(this.editor)}if(i.contents===false){return false}if(this.currentImage&&i.equals(this.currentImage,g)){return false}h.splice(this.index+1,h.length-this.index-1);if(h.length==this.limit){h.shift()}this.index=h.push(i)-1;this.currentImage=i;if(j!==false){this.fireChange()}return true},restoreImage:function(g){this.editor.loadSnapshot(g.contents);if(g.bookmarks){this.editor.getSelection().selectBookmarks(g.bookmarks)}else{if(CKEDITOR.env.ie){var h=this.editor.document.getBody().$.createTextRange();h.collapse(true);h.select()}}this.index=g.index;this.update();this.fireChange()},getNextImage:function(g){var k=this.snapshots,j=this.currentImage,l,h;if(j){if(g){for(h=this.index-1;h>=0;h--){l=k[h];if(!j.equals(l,true)){l.index=h;return l}}}else{for(h=this.index+1;h<k.length;h++){l=k[h];if(!j.equals(l,true)){l.index=h;return l}}}}return null},redoable:function(){return this.enabled&&this.hasRedo},undoable:function(){return this.enabled&&this.hasUndo},undo:function(){if(this.undoable()){this.save(true);var g=this.getNextImage(true);if(g){return this.restoreImage(g),true}}return false},redo:function(){if(this.redoable()){this.save(true);if(this.redoable()){var g=this.getNextImage(false);if(g){return this.restoreImage(g),true}}}return false},update:function(){this.snapshots.splice(this.index,1,(this.currentImage=new c(this.editor)))}}})();