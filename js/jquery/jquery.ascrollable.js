(function(b){b.ascrollable={options:{debug:false,itemHeight:null,pageSize:null,pageBuffer:3,totalItems:0,itemsContainer:null,clear:true,placeholderItem:null,emptyContainer:null,loadingContainer:null,startPage:0,items:null,onLoadPage:null,onBeforeLoadPage:null,onAfterLoadPage:null,indexAttr:"ascrollableIndex",onEmpty:null,onLoading:null,loadProcTimeout:1000,onScroll:null}};b.fn.ascrollable=function(c){return this.each(function(d,e){function g(){}g.prototype=a;var f=new g();f.initialize(this,c)})};var a={root:null,options:null,pages:null,loadProc:null,placeholders:null,initialize:function(d,e){var c=this;this.root=b(d);this.pages=new Array();this.placeholders=new Array();this.options=b.extend({},b.ascrollable.options,e);if(this.options.itemHeight==null){throw new Error("Must specify itemHeight when using ascrollable")}if(this.options.pageSize==null){throw new Error("Must specify pageSize when using ascrollable")}if(this.options.itemsContainer==null){this.options.itemsContainer=b(this.root.children("*").get(0))}else{if(typeof this.options.itemsContainer=="string"){this.options.itemsContainer=b(this.root.children(options.itemsContainer).get(0))}}if(this.options.clear){this.options.itemsContainer.empty();this.pages=new Array();this.loadProc=null;this.placeholders=new Array()}if(this.options.loadingContainer){this.showContainer(this.options.loadingContainer)}if(typeof this.options.onLoading=="function"){this.options.onLoading()}this.root.unbind("scroll");this.root.get(0).scrollTop=this.getStartPagePosition();this.root.bind("scroll",function(){c.scrollHandler.apply(c,arguments)});this.root.unbind("loadPage");this.root.bind("loadPage",function(){c.pageLoadHandler.apply(c,arguments)});this.root.unbind("beforeLoadPage");this.root.bind("beforeLoadPage",function(){c.beforePageLoadHandler.apply(c,arguments)});this.root.unbind("afterLoadPage");this.root.bind("afterLoadPage",function(){c.afterPageLoadHandler.apply(c,arguments)});this.scrollHandler()},getStartPagePosition:function(){return this.options.startPage*this.options.pageSize*this.options.itemHeight},getCurrentTopPosition:function(){return parseInt(this.root.attr("scrollTop"))},getCurrentBottomPosition:function(){return this.getCurrentTopPosition()+this.root.height()},getCurrentRange:function(){var c={};c.top=this.getCurrentTopPosition();c.bottom=this.getCurrentBottomPosition();return c},getCurrentTopElementIndex:function(){return Math.floor(this.getCurrentTopPosition()/this.options.itemHeight)},getCurrentBottomElementIndex:function(){return Math.floor(this.getCurrentBottomPosition()/this.options.itemHeight)},getCurrentPageIndex:function(){return Math.floor(this.getCurrentTopElementIndex()/this.options.pageSize)},getVisiblePageIndecies:function(){var e=new Array();var f=Math.floor(this.getCurrentTopElementIndex()/this.options.pageSize);if(this.options.debug&&console){console.log("TOP PAGE: "+f)}var c=Math.floor(this.getCurrentBottomElementIndex()/this.options.pageSize);if(this.options.debug&&console){console.log("BOTTOM PAGE: "+c)}e.push(f);if(f!=c){for(var d=f;d<=c;d++){e.push(d)}}return e},scrollHandler:function(e){var h=this.getVisiblePageIndecies();if(this.options.debug&&console){console.log("Visible pages: "+h)}var g=null;var f=null;for(var c=0;c<h.length;c++){if(!this.hasPage(h[c])){g=h[c];break}}for(var c=(h.length-1);c>=0;c--){if(!this.hasPage(h[c])){f=h[c];break}}if(g==null){if(this.options.debug&&console){console.log("All the required pages loaded...")}}else{if(this.options.debug&&console){console.log("Need to load pages: "+g+" - "+f)}var d=(f-g)+1;this.root.trigger("loadPage",[g,this.options.pageSize,d])}if(e&&typeof this.options.onScroll=="function"){this.options.onScroll(e)}},pageLoadHandler:function(g,c,d,f){var e=this;if(this.options.debug&&console){console.log("Requesting page: "+c+" + "+f)}this.root.trigger("beforeLoadPage",[c,d,f]);if(this.loadProc){clearTimeout(this.loadProc)}this.loadProc=setTimeout(function(){e.loadProc=null;if(typeof e.options.onLoadPage=="function"){var h=e.options.onLoadPage(c,d,f);if(h){e.root.trigger("afterLoadPage",[c,d,f])}}else{e.root.trigger("afterLoadPage",[c,d,f])}},this.options.loadProcTimeout)},beforePageLoadHandler:function(g,c,d,f){if(typeof this.options.onBeforeLoadPage=="function"){this.options.onBeforeLoadPage(c,d,f)}if((this.options.itemsContainer.css("display")!="none")&&this.options.placeholderItem instanceof jQuery){var k=c*d;var h=Math.min((k+(d*f)-1),(this.getTotalItems()-1));for(var e=k;e<=h;e++){var j=this.options.placeholderItem.clone();this.placeholders.push(j);this.insertItem(j,e)}}},afterPageLoadHandler:function(c,g,o,l){if(typeof this.options.onAfterLoadPage=="function"){this.options.onAfterLoadPage(g,o,l)}var s=this.getTotalItems();if(s==0){if(this.options.emptyContainer){this.showContainer(this.options.emptyContainer)}if(typeof this.options.onEmpty=="function"){this.options.onEmpty()}return}var m=s*this.options.itemHeight;this.options.itemsContainer.css({height:m+"px"});var n=this.getItems();for(var e=0;e<l;e++){var f=g+e;this.pages[f]=new Array();var q=f*o;var k=q+o-1;if(this.options.debug&&console){console.log(">>> Loading from "+q+" to "+k+" page: "+e+"/"+l)}if(n instanceof Array){for(var h=q;h<=k;h++){if(n[h]){var r=(n[h] instanceof jQuery)?n[h]:b(n[h]);this.pages[f].push(r);this.insertItem(r,h)}}}}if(this.placeholders&&this.placeholders.length>0){if(this.options.debug&&console){console.log(">>> Removing "+this.placeholders.length+" Placeholders")}for(var e=0;e<this.placeholders.length;e++){if(this.placeholders[e]!=null){this.placeholders[e].remove()}}this.placeholders=new Array()}var j=this.getTotalLoadedItems();var d=this.getTotalLoadedPages();if(this.options.debug&&console){console.log(">>> LOADED: "+j+" / "+d)}if(this.needsCleanup()){this.cleanupObsolete(g,l)}this.showContainer(this.options.itemsContainer)},cleanupObsolete:function(c,g){if(this.options.debug&&console){console.log("Cleaning up obsolete page: "+c+" + "+g)}var k=c;var j=c+g-1;var e=new Array();if(this.options.debug&&console){console.log(">>> Looking for obsolete pages excluding: "+k+" - "+j+" / "+this.pages.length)}for(var f=0;f<this.pages.length;f++){if(this.hasPage(f)&&(f<k||f>j)){e.push(f)}}if(this.options.debug&&console){console.log("Pages: "+e)}var h=e.shift();var d=e.pop();if(this.options.debug&&console){console.log("Top obsolete: "+h+" Bottom obsolete: "+d)}if(typeof h=="undefined"&&typeof d=="undefined"){return}if(typeof d=="undefined"){this.removePage(h)}else{if((c-h)>(d-c)){this.removePage(h)}else{this.removePage(d)}}if(this.needsCleanup()){this.cleanupObsolete(c,g)}},removePage:function(c){if(this.pages[c] instanceof Array){if(this.options.debug&&console){console.log("Removing page: "+c+" having "+this.pages[c].length+" elements")}for(var d=0;d<this.pages[c].length;d++){this.pages[c][d].remove()}this.pages[c]=null}},needsCleanup:function(){return(this.options.pageBuffer>0&&this.getTotalLoadedPages()>this.options.pageBuffer)},getItems:function(){if(typeof this.options.items=="function"){return this.options.items()}else{return this.options.items}},setIndexAttrs:function(e,c){var d=c*this.options.itemHeight;if(this.options.debug&&console){console.log(">>> Setting offset: "+d+" for index: "+c)}e.css({position:"absolute",top:d+"px"});e.attr(this.options.indexAttr,c)},insertItem:function(e,c){if(this.options.debug&&console){console.log(">>> Inserting item at index: "+c)}this.setIndexAttrs(e,c);if(this.options.debug){e.append(b("<div class='ascrollableDebug'>"+c+"</div>"))}var d=this.root.find("*["+this.options.indexAttr+"="+c+"]");if(d.length>0){d.replaceWith(e)}else{this.options.itemsContainer.append(e)}},hasPage:function(c){return(this.pages[c] instanceof Array)},getTotalItems:function(){if(typeof this.options.totalItems=="function"){return parseInt(this.options.totalItems())}else{return parseInt(this.options.totalItems)}},getTotalPages:function(){var c=this.getTotalItems();if(c>0){return Math.ceil(c/this.options.pageSize)}else{return 0}},getTotalLoadedItems:function(){return this.options.itemsContainer.children().length},getTotalLoadedPages:function(){return Math.ceil(this.getTotalLoadedItems()/this.options.pageSize)},getAllContainers:function(){var c=new Array();c.push(this.options.itemsContainer);if(this.options.loadingContainer){c.push(this.options.loadingContainer)}if(this.options.emptyContainer){c.push(this.options.emptyContainer)}return c},showContainer:function(c){if(c){var e=this.getAllContainers();for(var d=0;d<e.length;d++){if(e[d]==c){if(this.options.debug&&console){console.log("Showing container: "+e[d].attr("id"))}e[d].show()}else{if(this.options.debug&&console){console.log("Hiding container: "+e[d].attr("id"))}e[d].hide()}}}}}})(jQuery);