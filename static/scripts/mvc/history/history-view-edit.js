define("mvc/history/history-view-edit",["exports","mvc/history/history-view","mvc/history/history-contents","mvc/dataset/states","mvc/history/hda-model","mvc/history/hda-li-edit","mvc/history/hdca-li-edit","mvc/tag","mvc/annotation","mvc/collection/list-collection-creator","mvc/collection/pair-collection-creator","mvc/collection/list-of-pairs-collection-creator","ui/fa-icon-button","mvc/ui/popup-menu","mvc/base-mvc","utils/localization","ui/editable-text"],function(t,e,i,n,o,s,a,r,d,l,c,h,u,f,p,g){"use strict";function m(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(t,"__esModule",{value:!0});var v=m(e),y=(m(i),m(n),m(o)),w=m(s),D=m(a),E=m(r),H=m(d),S=m(l),T=m(c),x=m(h),A=m(u),b=(m(f),m(p)),C=m(g),I=v.default.HistoryView,k=I.extend({HDAViewClass:w.default.HDAListItemEdit,HDCAViewClass:D.default.HDCAListItemEdit,initialize:function(t){t=t||{},I.prototype.initialize.call(this,t),this.tagsEditor=null,this.dragItems=!0,this.annotationEditor=null,this.purgeAllowed=t.purgeAllowed||!1,this.annotationEditorShown=t.annotationEditorShown||!1,this.tagsEditorShown=t.tagsEditorShown||!1},_setUpListeners:function(){return I.prototype._setUpListeners.call(this),this.on({"droptarget:drop":function(t,e){this.dataDropped(e),this.dropTargetOff()},"view:attached view:removed":function(){this._renderCounts()},"search:loading-progress":this._renderSearchProgress,"search:searching":this._renderSearchFindings})},_setUpModelListeners:function(){return I.prototype._setUpModelListeners.call(this),this.listenTo(this.model,"change:size",this.updateHistoryDiskSize),this},_setUpCollectionListeners:function(){return I.prototype._setUpCollectionListeners.call(this),this.listenTo(this.collection,{"change:deleted":this._handleItemDeletedChange,"change:visible":this._handleItemVisibleChange,"change:purged":function(t){this.model.fetch()},"fetching-deleted":function(t){this.$("> .controls .deleted-count").html("<i>"+(0,C.default)("loading...")+"</i>")},"fetching-hidden":function(t){this.$("> .controls .hidden-count").html("<i>"+(0,C.default)("loading...")+"</i>")},"fetching-deleted-done fetching-hidden-done":this._renderCounts}),this},_buildNewRender:function(){var t=I.prototype._buildNewRender.call(this);return this.model?(Galaxy&&Galaxy.user&&Galaxy.user.id&&Galaxy.user.id===this.model.get("user_id")&&(this._renderTags(t),this._renderAnnotation(t)),t):t},updateHistoryDiskSize:function(){this.$(".history-size").text(this.model.get("nice_size"))},renderItems:function(t){var e=I.prototype.renderItems.call(this,t);return this.searchFor?this._renderSearchFindings(t):this._renderCounts(t),e},_renderCounts:function(t){t=t instanceof jQuery?t:this.$el;var e=this.templates.counts(this.model.toJSON(),this);return t.find("> .controls .subtitle").html(e)},_renderTags:function(t){var e=this;this.tagsEditor=new E.default.TagsEditor({model:this.model,el:t.find(".controls .tags-display"),onshowFirstTime:function(){this.render()},onshow:function(){e.toggleHDATagEditors(!0,e.fxSpeed)},onhide:function(){e.toggleHDATagEditors(!1,e.fxSpeed)},$activator:(0,A.default)({title:(0,C.default)("Edit history tags"),classes:"history-tag-btn",faIcon:"fa-tags"}).appendTo(t.find(".controls .actions"))})},_renderAnnotation:function(t){var e=this;this.annotationEditor=new H.default.AnnotationEditor({model:this.model,el:t.find(".controls .annotation-display"),onshowFirstTime:function(){this.render()},onshow:function(){e.toggleHDAAnnotationEditors(!0,e.fxSpeed)},onhide:function(){e.toggleHDAAnnotationEditors(!1,e.fxSpeed)},$activator:(0,A.default)({title:(0,C.default)("Edit history annotation"),classes:"history-annotate-btn",faIcon:"fa-comment"}).appendTo(t.find(".controls .actions"))})},_setUpBehaviors:function(t){if(t=t||this.$el,I.prototype._setUpBehaviors.call(this,t),this.model&&Galaxy.user&&!Galaxy.user.isAnonymous()&&Galaxy.user.id===this.model.get("user_id")){var e=this;t.find("> .controls .name").attr("title",(0,C.default)("Click to rename history")).tooltip({placement:"bottom"}).make_text_editable({on_finish:function(t){var i=e.model.get("name");t&&t!==i?(e.$el.find("> .controls .name").text(t),e.model.save({name:t}).fail(function(){e.$el.find("> .controls .name").text(e.model.previous("name"))})):e.$el.find("> .controls .name").text(i)}})}},multiselectActions:function(){var t=this,e=[{html:(0,C.default)("Hide datasets"),func:function(){var e=y.default.HistoryDatasetAssociation.prototype.hide;t.getSelectedModels().ajaxQueue(e)}},{html:(0,C.default)("Unhide datasets"),func:function(){var e=y.default.HistoryDatasetAssociation.prototype.unhide;t.getSelectedModels().ajaxQueue(e)}},{html:(0,C.default)("Delete datasets"),func:function(){var e=y.default.HistoryDatasetAssociation.prototype.delete;t.getSelectedModels().ajaxQueue(e)}},{html:(0,C.default)("Undelete datasets"),func:function(){var e=y.default.HistoryDatasetAssociation.prototype.undelete;t.getSelectedModels().ajaxQueue(e)}}];return t.purgeAllowed&&e.push({html:(0,C.default)("Permanently delete datasets"),func:function(){if(confirm((0,C.default)("This will permanently remove the data in your datasets. Are you sure?"))){var e=y.default.HistoryDatasetAssociation.prototype.purge,i=t.getSelectedModels(),n=i.filter(function(t){return"dataset"==t.get("history_content_type")});i.ajaxQueue(e,{},n)}}}),e=e.concat(t._collectionActions())},_collectionActions:function(){var t=this;return[{html:(0,C.default)("Build Dataset List"),func:function(){t.buildCollection("list")}},{html:(0,C.default)("Build Dataset Pair"),func:function(){t.buildCollection("paired")}},{html:(0,C.default)("Build List of Dataset Pairs"),func:function(){t.buildCollection("list:paired")}}]},buildCollection:function(t,e,i){var n,o=this,e=e||o.getSelectedModels(),i=i||!1;"list"==t?n=S.default.createListCollection:"paired"==t?n=T.default.createPairCollection:"list:paired"==t?n=x.default.createListOfPairsCollection:console.warn("Unknown collectionType encountered "+t),n(e,i).done(function(){o.model.refresh()})},_getItemViewOptions:function(t){var e=I.prototype._getItemViewOptions.call(this,t);return _.extend(e,{purgeAllowed:this.purgeAllowed,tagsEditorShown:this.tagsEditor&&!this.tagsEditor.hidden,annotationEditorShown:this.annotationEditor&&!this.annotationEditor.hidden}),e},_handleItemDeletedChange:function(t){t.get("deleted")?this._handleItemDeletion(t):this._handleItemUndeletion(t),this._renderCounts()},_handleItemDeletion:function(t){var e=this.model.get("contents_active");e.deleted+=1,e.active-=1,this.model.contents.includeDeleted||this.removeItemView(t),this.model.set("contents_active",e)},_handleItemUndeletion:function(t){var e=this.model.get("contents_active");e.deleted-=1,this.model.contents.includeDeleted||(e.active-=1),this.model.set("contents_active",e)},_handleItemVisibleChange:function(t){t.hidden()?this._handleItemHidden(t):this._handleItemUnhidden(t),this._renderCounts()},_handleItemHidden:function(t){var e=this.model.get("contents_active");e.hidden+=1,e.active-=1,this.model.contents.includeHidden||this.removeItemView(t),this.model.set("contents_active",e)},_handleItemUnhidden:function(t){var e=this.model.get("contents_active");e.hidden-=1,this.model.contents.includeHidden||(e.active-=1),this.model.set("contents_active",e)},toggleHDATagEditors:function(t,e){_.each(this.views,function(i){i.tagsEditor&&i.tagsEditor.toggle(t,e)})},toggleHDAAnnotationEditors:function(t,e){_.each(this.views,function(i){i.annotationEditor&&i.annotationEditor.toggle(t,e)})},events:_.extend(_.clone(I.prototype.events),{"click .show-selectors-btn":"toggleSelectors","click .toggle-deleted-link":function(t){this.toggleShowDeleted()},"click .toggle-hidden-link":function(t){this.toggleShowHidden()}}),_renderSearchProgress:function(t,e){var i=t+e;return this.$("> .controls .subtitle").html(["<i>",(0,C.default)("Searching "),i,"/",this.model.contentsShown(),"</i>"].join(""))},_renderSearchFindings:function(t){t=t instanceof jQuery?t:this.$el;var e=this.templates.found(this.model.toJSON(),this);return t.find("> .controls .subtitle").html(e),this},dropTargetOn:function(){if(this.dropTarget)return this;this.dropTarget=!0;var t={dragenter:_.bind(this.dragenter,this),dragover:_.bind(this.dragover,this),dragleave:_.bind(this.dragleave,this),drop:_.bind(this.drop,this)},e=this._renderDropTarget();this.$list().before([this._renderDropTargetHelp(),e]);for(var i in t)t.hasOwnProperty(i)&&e.on(i,t[i]);return this},_renderDropTarget:function(){return this.$(".history-drop-target").remove(),$("<div/>").addClass("history-drop-target")},_renderDropTargetHelp:function(){return this.$(".history-drop-target-help").remove(),$("<div/>").addClass("history-drop-target-help").text((0,C.default)("Drag datasets here to copy them to the current history"))},dropTargetOff:function(){if(!this.dropTarget)return this;this.dropTarget=!1;var t=this.$(".history-drop-target").get(0);for(var e in this._dropHandlers)this._dropHandlers.hasOwnProperty(e)&&t.off(e,this._dropHandlers[e]);return this.$(".history-drop-target").remove(),this.$(".history-drop-target-help").remove(),this},dropTargetToggle:function(){return this.dropTarget?this.dropTargetOff():this.dropTargetOn(),this},dragenter:function(t){t.preventDefault(),t.stopPropagation(),this.$(".history-drop-target").css("border","2px solid black")},dragover:function(t){t.preventDefault(),t.stopPropagation()},dragleave:function(t){t.preventDefault(),t.stopPropagation(),this.$(".history-drop-target").css("border","1px dashed black")},drop:function(t){t.preventDefault();var e=this,i=t.originalEvent.dataTransfer,n=i.getData("text");i.dropEffect="move";try{n=JSON.parse(n)}catch(t){e.warn("error parsing JSON from drop:",n)}return e.trigger("droptarget:drop",t,n,e),!1},dataDropped:function(t){var e=this;return _.isObject(t)&&"HistoryDatasetAssociation"===t.model_class&&t.id?0!==e.contents.currentPage?e.contents.fetchPage(0).then(function(){return e.model.contents.copy(t.id)}):e.model.contents.copy(t.id):jQuery.when()},toString:function(){return"HistoryViewEdit("+(this.model?this.model.get("name"):"")+")"}});k.prototype.templates=function(){var t=b.default.wrapTemplate(["<% var shown = Math.max( view.views.length, history.contents_active.active ) %>","<% if( shown ){ %>",'<span class="shown-count">',"<%- shown %> ",(0,C.default)("shown"),"</span>","<% } %>","<% if( history.contents_active.deleted ){ %>",'<span class="deleted-count">',"<% if( view.model.contents.includeDeleted ){ %>",'<a class="toggle-deleted-link" href="javascript:void(0);">',(0,C.default)("hide deleted"),"</a>","<% } else { %>","<%- history.contents_active.deleted %> ",'<a class="toggle-deleted-link" href="javascript:void(0);">',(0,C.default)("deleted"),"</a>","<% } %>","</span>","<% } %>","<% if( history.contents_active.hidden ){ %>",'<span class="hidden-count">',"<% if( view.model.contents.includeHidden ){ %>",'<a class="toggle-hidden-link" href="javascript:void(0);">',(0,C.default)("hide hidden"),"</a>","<% } else { %>","<%- history.contents_active.hidden %> ",'<a class="toggle-hidden-link" href="javascript:void(0);">',(0,C.default)("hidden"),"</a>","<% } %>","</span>","<% } %>"],"history"),e=b.default.wrapTemplate([(0,C.default)("Found")," <%- view.views.length %>, ","<% if( history.contents_active.deleted ){ %>","<% if( view.model.contents.includeDeleted ){ %>",'<a class="toggle-deleted-link" href="javascript:void(0);">',(0,C.default)("hide deleted"),"</a>, ","<% } else { %>",'<a class="toggle-deleted-link" href="javascript:void(0);">',(0,C.default)("show deleted"),"</a>, ","<% } %>","<% } %>","<% if( history.contents_active.hidden ){ %>","<% if( view.model.contents.includeHidden ){ %>",'<a class="toggle-hidden-link" href="javascript:void(0);">',(0,C.default)("hide hidden"),"</a>","<% } else { %>",'<a class="toggle-hidden-link" href="javascript:void(0);">',(0,C.default)("show hidden"),"</a>","<% } %>","<% } %>"],"history");return _.extend(_.clone(I.prototype.templates),{counts:t,found:e})}(),t.default={HistoryViewEdit:k}});
//# sourceMappingURL=../../../maps/mvc/history/history-view-edit.js.map
