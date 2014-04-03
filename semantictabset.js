//*** This code is copyright 2004 by Gavin Kistner, !@phrogz.net
//*** It is covered under the license viewable at http://phrogz.net/JS/_ReuseLicense.txt
//*** Reuse or modification is free provided you abide by the terms of that license.
//*** (Including the first two lines above in your source code mostly satisfies the conditions.)

/*******************************************************************************
* Semantic Tab Set Library
* 
* See http://phrogz.net/tmp/SemanticTabset/ for documentation.
*
* 20040412 v1.0   Initial release.
*******************************************************************************/

AttachEvent(window,'load',function(){
	var parentTagName='dl',parentTagClass='tabset',tabTagName='dt',bodyTagName='dd';

	/***  ***/

	function FindEl(tagName,evt){
		if (!evt && window.event) evt=event;
		if (!evt) return DebugOut("Can't find an event to handle in DLTabSet::SetTab",0);
		var el=evt.currentTarget || evt.srcElement;
		while (el && (!el.tagName || el.tagName.toLowerCase()!=tagName)) el=el.parentNode;
		return el;
	}
	function FindBody(el){
		for (var b=el.nextSibling;b&&(!b.tagName || b.tagName.toLowerCase()!=bodyTagName);b=b.nextSibling){}
		if (!b) return DebugOut("Can't find the <"+bodyTagName+"> element that goes with the tab in DLTabSet::FindBody",0);
		return b;			
	}

	function SetTab(evt){
		SetTabActive(FindEl(tabTagName,evt));
		DeGlowTab(evt);
	}
	function SetTabActive(el){
		var p,bod;
		if (!el || !HasClass((p=el.parentNode),parentTagClass)) return DebugOut("Can't find the <"+tabTagName+"> element who caught the event in DLTabSet::SetTab",0);
		if (p.activeTab){
			KillClass(p.activeTab,'active');
			if (b=FindBody(p.activeTab)) KillClass(b,'active');
			if (p.activeTab.previousTab) KillClass(p.activeTab.previousTab,'preActive');
			if (p.activeTab.nextTab) KillClass(p.activeTab.nextTab,'postActive');
		}
		AddClass(p.activeTab=el,'active');
		if (b=FindBody(p.activeTab)) AddClass(b,'active');				
		if (p.activeTab.previousTab) AddClass(p.activeTab.previousTab,'preActive');
		if (p.activeTab.nextTab) AddClass(p.activeTab.nextTab,'postActive');
	}

	function GlowTab(evt){
		var el=FindEl(tabTagName,evt),dl;
		if (!el || !HasClass((dl=el.parentNode),parentTagClass)) return DebugOut("Can't find the <dt> element who caught the event in DLTabSet::GlowTab",0);
		if (!HasClass(el,'active')) AddClass(el,'hover');
	}
	function DeGlowTab(evt){
		var el=FindEl(tabTagName,evt),dl;
		if (!el || !HasClass((dl=el.parentNode),parentTagClass)) return DebugOut("Can't find the <dt> element who caught the event in DLTabSet::DeGlowTab",0);
		KillClass(el,'hover');
	}

	function SetTabFromAnchor(evt){
		SetTabActive(FindEl('a',evt).semanticTab);
	}

	/***  ***/

	function Initialize(){
		var tabsById={};
		var dls = document.getElementsByTagName('dl');
		for (var i=0,len=dls.length;i<len;i++){
			var dl = dls[i];
			if (!HasClass(dl,parentTagClass)) continue;
			var lastEl=null;
			for (var j=0,els=dl.childNodes,len2=els.length;j<len2;j++){
				var el = els[j];
				if (!el.tagName || el.tagName.toLowerCase()!=tabTagName || HasClass(el,'ieclear')) continue;

				if (el.id) tabsById[el.id]=el;

				if (!lastEl) AddClass(el,'first-child');
				else{
					el.previousTab=lastEl;
					lastEl.nextTab=el;
				}

				if (HasClass(el,'active')) SetTabActive(el);
				
				AttachEvent(el,'click',SetTab,false);
				AttachEvent(el,'mouseover',GlowTab,false);
				AttachEvent(el,'mouseout',DeGlowTab,false);
				
				lastEl=el;
			}
		}
		
		var anchorMatch = /#([a-z][\w.:-]*)$/i,match;
		for (var i=0,len=document.links.length;i<len;i++){
			var a = document.links[i];
			if (!(match=anchorMatch.exec(a.href))) continue;
			if (a.semanticTab = tabsById[match[1]]) AttachEvent(a,'click',SetTabFromAnchor,false);
		}
	}
	Initialize();

},false);