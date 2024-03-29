FileView = function(ClientID, ControllerID, RegularItemStyle, SelectedItemStyle, EditTextBoxStyle) {
    this.ClientID = ClientID;
    this.ControllerID = ControllerID;
    this._controller = eval('WFM_' + ControllerID);
    this.RegularItemStyle = RegularItemStyle;
    this.SelectedItemStyle = SelectedItemStyle;
    this.EditTextBoxStyle = EditTextBoxStyle;
    this.Element = WebForm_GetElementById(this.ClientID);
    this.Focuser = WebForm_GetElementById(this.ClientID + '_Focus');
    this.Address = WebForm_GetElementById(this.ClientID + '_Address');
    this.SelectedItems = new Array();
    this.HitInfo = 'FileView';
    this.InProcess = false;
    var This = this;
    
    this.Element.onselectstart = function(e) {
        return false;
    }
  
    this.Element.onscroll = function(e) {
        eval('WFM_' + ControllerID + '.HideTextBox()');
        var top=''+WebForm_GetElementById(ClientID).scrollTop+'px'
        var left=''+WebForm_GetElementById(ClientID).scrollLeft+'px'
        var tHead = WebForm_GetElementById(ClientID+"_Thead_Name");
        if(tHead) {
            tHead.style.position = 'relative';
            tHead.style.zIndex = 10;
            tHead.style.top = top;
            tHead.style.left = '-1px';
            tHead.style.left = '0px';
        }
        var tHead = WebForm_GetElementById(ClientID+"_Thead_Size");
        if(tHead) {
            tHead.style.position = 'relative';
            tHead.style.zIndex = 10;
            tHead.style.top = top;
            tHead.style.left = '-1px';
            tHead.style.left = '0px';
        }
        var tHead = WebForm_GetElementById(ClientID+"_Thead_Type");
        if(tHead) {
            tHead.style.position = 'relative';
            tHead.style.zIndex = 10;
            tHead.style.top = top;
            tHead.style.left = '-1px';
            tHead.style.left = '0px';
        }
        var tHead = WebForm_GetElementById(ClientID+"_Thead_Modified");
        if(tHead) {
            tHead.style.position = 'relative';
            tHead.style.zIndex = 10;
            tHead.style.top = top;
            tHead.style.left = '-1px';
            tHead.style.left = '0px';
        }
    }
  
    this.Element.oncontextmenu = function(e) {
        if(e == null) var e = event;
        eval('WFM_' + ClientID + '.ShowContextMenu(e)');
        eval('WFM_' + ClientID + '.HitInfo = \'FileView\'');
        return false;
    }
    
    if(this.Address) {
        this.Address.onkeydown = function(e) {
            if(e == null) var e = event;
            if(e.keyCode == 13) {
				This.Navigate(this.value);
                e.cancelBubble = true;
                return false;
            }
        }
    }
    
    this.Focuser.onkeydown = function(e) {
        if(e == null) var e = event;
        if(e.keyCode == 13) {
            eval('WFM_' + ControllerID + '.OnExecuteCommand(WFM_' + ClientID + ',\'0:0\')');
            e.cancelBubble = true;
            return false;
        } else if (e.keyCode == 38 || e.keyCode == 37) {
            eval('WFM_' + ClientID + '.GoToPreviousItem(e)');
            e.cancelBubble = true;
            return false;
        } else if (e.keyCode == 40 || e.keyCode == 39) {
            eval('WFM_' + ClientID + '.GoToNextItem(e)');
            e.cancelBubble = true;
            return false;
        } else if (e.keyCode == 113) {
            eval('WFM_' + ControllerID + '.doNotHide = true');
            eval('WFM_' + ControllerID + '.OnRename(WFM_' + ClientID + ',\'\')');
            e.cancelBubble = true;
            return false;
        } else if (e.keyCode == 116) {
            eval('WFM_' + ControllerID + '.OnRefresh(WFM_' + ClientID + ',\'\')');
            e.cancelBubble = true;
            return false;
        } else if (e.keyCode == 46) {
            eval('WFM_' + ControllerID + '.OnSelectedItemsDelete(WFM_' + ClientID + ',\'\')');
            e.cancelBubble = true;
            return false;
        }
        return false;
    }
}
FileView.prototype.getController = function() {return this._controller;}

FileView.prototype.ShowContextMenu = function(arg) {
    if(this.InProcess)
        return;
    var x = arg.clientX + WebForm_GetScrollX();
    var y = arg.clientY + WebForm_GetScrollY();
    if(this.HitInfo == 'FileView')
        eval(this.ClientID+'_ShowContextMenu(x,y)');
    else
        eval(this.ClientID+'_ShowSelectedItemsContextMenu(x,y)');
}

FileView.prototype.ShowProgress = function() {
    this.InProcess = true;
    progImg = WebForm_GetElementById(this.ClientID + '_ProgressImg');
    if(progImg)
        progImg.style.visibility = 'visible';
    this.Element.style.cursor = 'wait';
    var rootControl = WebForm_GetElementById(this.Element.rootControl);
    if(rootControl)
        rootControl.style.cursor = 'wait';
}

FileView.prototype.HidePrgress = function() {
    this.InProcess = false;
    progImg = WebForm_GetElementById(this.ClientID + '_ProgressImg');
    if(progImg)
        progImg.style.visibility = 'hidden';
    this.Element.style.cursor = 'default';
    var rootControl = WebForm_GetElementById(this.Element.rootControl);
    if(rootControl)
        rootControl.style.cursor = 'default';
}

FileView.prototype.Navigate = function(arg) {
    eval('WFM_' + this.ControllerID + '.OnFileViewNavigate(WFM_' + this.ClientID + ',arg)');
}

FileView.prototype.Rename = function(arg) {
    eval('WFM_' + this.ControllerID + '.OnRename(WFM_' + this.ClientID + ',arg)');
}

FileView.prototype.SelectedItemsDelete = function(arg) {
    eval('WFM_' + this.ControllerID + '.OnSelectedItemsDelete(WFM_' + this.ClientID + ',arg)');
}

FileView.prototype.SetFocus = function() {
    this.Focuser.focus();
}

FileView.prototype.GoToPreviousItem = function(e) {
    var item = null;
    if(this.SelectedItems.length == 0) {
        item = WebForm_GetElementById(this.ClientID + '_Item_0');
    } else {
        var currentSelectedItem = this.SelectedItems[this.SelectedItems.length - 1];
        for(i=0;i<this.Items.length;i++) {
            if(this.Items[i].id == currentSelectedItem.id) {
                try {item = this.Items[i-1];}
                catch(e) {}
                break;
            }
        }
    }
    if(item) {
        this.AddSelectedItem(item, true);
        this.EnsureVisible(item);
    }
}

FileView.prototype.GoToNextItem = function(e) {
    var item = null;
    if(this.SelectedItems.length == 0) {
        item = WebForm_GetElementById(this.ClientID + '_Item_0');
    } else {
        var currentSelectedItem = this.SelectedItems[this.SelectedItems.length - 1];
        for(i=0;i<this.Items.length;i++) {
            if(this.Items[i].id == currentSelectedItem.id) {
                try {item = this.Items[i+1];}
                catch(e) {}
                break;
            }
        }
    }
    if(item) {
        this.AddSelectedItem(item, true);
        this.EnsureVisible(item);
    }
}

FileView.prototype.EnsureVisible = function(item) {
    var posEl = WebForm_GetElementPosition(this.Element);
    var posItem = WebForm_GetElementPosition(item);
    var topBar = 0;
    var tHeadName = WebForm_GetElementById(this.ClientID+"_Thead_Name");
    if(tHeadName) { topBar = WebForm_GetElementPosition(tHeadName).height; }
    
    if((posItem.y+posItem.height-this.Element.scrollTop)>(posEl.y+posEl.height-25)) this.Element.scrollTop = (posItem.y+posItem.height)-(posEl.y+posEl.height-25);
    if((posItem.y-this.Element.scrollTop)<(posEl.y + topBar)) this.Element.scrollTop = (posItem.y)-(posEl.y + topBar);
}

FileView.prototype.Initialize = function() {
    var initScript = WebForm_GetElementById(this.ClientID+'_InitScript').innerHTML;
    eval(initScript);
    var dir = WebForm_GetElementDir(this.Element);
    this.Element.scrollTop = 0;
    this.Element.scrollLeft = (dir=='rtl')?this.Element.scrollWidth:0;
}

FileView.prototype.ClearSelectedItems = function() {
    for(i=0;i<this.SelectedItems.length;i++) {
        WebForm_RemoveClassName(this.SelectedItems[i], this.SelectedItemStyle);
        this.SelectedItems[i].Selected = false;
    }
    this.SelectedItems = new Array();
    this.SaveSelectedItemsState();
}

FileView.prototype.AddSelectedItem = function(item, clearBefore) {
    if(clearBefore)
        this.ClearSelectedItems(); 
    for(i=0;i<this.SelectedItems.length;i++) {
        if(this.SelectedItems[i].id == item.id) {
            return;
        }
    }
    item.Selected = true;
    WebForm_AppendToClassName(item, this.SelectedItemStyle);
    this.SelectedItems[this.SelectedItems.length] = item;
    this.SaveSelectedItemsState();
}

FileView.prototype.SaveSelectedItemsState = function() {
    var selectedItemsEl = document.getElementById(this.ClientID+'_SelectedItems');
    var paths = new Array();
    for(i=0;i<this.SelectedItems.length;i++) {
        paths[paths.length] = this.SelectedItems[i].Path;
    }
    selectedItemsEl.value = paths.join(":");
}

FileView.prototype.GetDirectory = function() {
    var directory = document.getElementById(this.ClientID+'_Directory');
    return directory.value;
}

FileView.prototype.GetSort = function() {
    var sort = document.getElementById(this.ClientID+'_Sort');
    return sort.value;
}

FileView.prototype.SetSort = function(arg) {
    var sort = document.getElementById(this.ClientID+'_Sort');
    var sortDirection = document.getElementById(this.ClientID+'_SortDirection');
    if(sort.value == arg) {
        if(sortDirection.value == 'Ascending') sortDirection.value = 'Descending';
        else sortDirection.value = 'Ascending';
    } else {
        sort.value = arg;
        sortDirection.value = 'Ascending';
    }
}
FileView.prototype.GetShowInGroups = function() {
    var showInGroups = document.getElementById(this.ClientID+'_ShowInGroups');
    return eval(showInGroups.value);
}
FileView.prototype.SwitchShowInGroups = function() {
    var showInGroups = document.getElementById(this.ClientID+'_ShowInGroups');
    var _showInGroups = eval(showInGroups.value);
    showInGroups.value = ''+!_showInGroups;
}
FileView.prototype.GetView = function() {
    var sort = document.getElementById(this.ClientID+'_View');
    return sort.value;
}
FileView.prototype.SetView = function(arg) {
    var sort = document.getElementById(this.ClientID+'_View');
    sort.value = arg;
}

FileView.prototype.InitItem = function(item, path, isDirectory, canBeRenamed, selected, fileType) {
	
    var ControllerID = this.ControllerID;
    var ClientID = this.ClientID;
    item.OwnerID = ClientID;
    item.Path = path;
    item.className = this.RegularItemStyle;
    item.FileType = fileType;
    item.IsDirectory = isDirectory;
    item.Selected = selected;
    item.CanBeRenamed = canBeRenamed;
    item.Name = decodeURIComponent(path);
    
    item.ondblclick = function(e) {
        if(e == null) var e = event;
        eval('WFM_' + ControllerID + '.OnExecuteCommand(WFM_' + ClientID + ',\'0:0\')');
        e.cancelBubble = true;
        return false;
    }
    
    item.oncontextmenu = function(e) {
        if(e == null) var e = event;
        if(!this.Selected)
            eval('WFM_' + ClientID + '.AddSelectedItem(this, true)');
        eval('WFM_' + ClientID + '.HitInfo = \'SelectedItems\'');
        return false;
    }
    
	var fileViewItem = new FileViewItem(this, item);
}

FileView.prototype.OnMenuItemClick = function(sender, arg) {
    var ControllerID = this.ControllerID;
    var ClientID = this.ClientID;
    eval('WFM_' + ControllerID + '.On'+arg.CommandName+'(WFM_' + ClientID + ',arg.CommandArgument)');
}

FileViewItem = function(owner, element) {
	this._owner = owner;
	this._element = element;
	
	var mouseDown = this._mouseDown;
	var mouseOut = this._mouseOut;
	var mouseUp = this._mouseUp;
	var mouseMove = this._mouseMove;
	var instance = this;
	element.onmouseup = function(e) {
		e = e || window.event;
		mouseUp.call(instance, e); 
	}
	element.onmousemove = function(e) {
		e = e || window.event;
		mouseMove.call(instance, e);
	}
	element.onmousedown = function(e) {
		e = e || window.event;
		mouseDown.call(instance, e); 
	}
	element.onmouseout = function(e) {
		e = e || window.event;
		mouseOut.call(instance, e); 
	}
}

FileViewItem.prototype._owner = null;
FileViewItem.prototype._div = null;
FileViewItem.prototype._dropMove = true;
FileViewItem.prototype._node = null;
FileViewItem.prototype._highlight = false;
FileViewItem.prototype._cursor = null;
	
FileViewItem.prototype.getController = function() {return this._owner.getController();}
	
FileViewItem.prototype.getFullPath = function() {
	var dirPath = decodeURIComponent(this._owner.GetDirectory());
	var name = decodeURIComponent(this._element.Path);
	var spliter = '/';
	if(dirPath.charAt(dirPath.length-1) == '/') spliter = '';
	return dirPath + spliter + name;
}

FileViewItem.prototype.highlight = function(bool) {
	if(this._highlight == bool) return;
	this._highlight = bool;
	if(bool) WebForm_AppendToClassName(this._element, this._owner.SelectedItemStyle);
	else WebForm_RemoveClassName(this._element, this._owner.SelectedItemStyle);
};

FileViewItem.prototype.setCursor = function(cursor){
	if(this._cursor == cursor) return;
	this._cursor = cursor;
	this._element.style.cursor = cursor;
	var name = WebForm_GetElementById(this._element.id+'_Name');
	if(name) name.style.cursor = cursor;
};

FileViewItem.prototype.isSelected = function() {return this._element.Selected;};

FileViewItem.prototype.select = function(bool) {this._owner.AddSelectedItem(this._element, bool);};

FileViewItem.prototype.canDrop = function() {
	return this._element.IsDirectory && !this.isSelected();
};

FileViewItem.prototype._mouseMove = function(ev) {
	if(ev.preventDefault) ev.preventDefault();
	ev.returnValue = false;
	if(this._pendDragDrop) {
		this._moveCounter++;
		if(this._moveCounter>2) {
			this._pendDragDrop = false;
			this._pendSelect = false;
			this.getController().startDragDrop(this._owner);
		}
	}
	if(this.getController().isDragging()) {
		this.onDragInTarget(ev);
	}
	return false;
};

FileViewItem.prototype._mouseOut = function(ev) {
	if(ev.preventDefault) ev.preventDefault();
	ev.returnValue = false;
	if(this.getController().isDragging()) {
		this.onDragLeaveTarget();
	}
	return false;
};
	
FileViewItem.prototype._mouseDown = function(ev) {
	if(ev.preventDefault) ev.preventDefault();
	ev.returnValue = false;
	this._pendDragDrop = true;
	this._moveCounter = 0;
	if(this.isSelected()) this._pendSelect = true;
	else this.select(!ev.ctrlKey && !ev.shiftKey);
	return false;
};
	
FileViewItem.prototype._mouseUp = function(ev) {
	if(ev.preventDefault) ev.preventDefault();
	ev.returnValue = false;
	var pendSelect = this._pendSelect;
	this._pendDragDrop = false;
	this._pendSelect = false;
	if(this.getController().isDragging()) {
		this.onDrop();
	}
	else if(pendSelect) {
		this.select(!ev.ctrlKey && !ev.shiftKey)
	}
	return false;
};

FileViewItem.prototype.onDragLeaveTarget = function() {
	this.getController()._dropTarget = null;
	if(this.canDrop()){
		this.highlight(false);
	}
	this.setCursor("default");
};

FileViewItem.prototype.onDragInTarget = function(ev) {
	if(this.canDrop()){
		this._dropMove = !ev.ctrlKey && !ev.shiftKey;
		this.getController()._dropTarget = this;
		this.highlight(true);
		if(this._dropMove)
			this.setCursor(this.getController()._dropMoveCursor);
		else
			this.setCursor(this.getController()._dropCopyCursor);
	}
	else {
		this.setCursor(this.getController()._dropNotAllowedCursor);
	}
};

FileViewItem.prototype.onDrop = function (){
	if(this.canDrop()) {
		this.getController().drop(this, this._dropMove);
		this.highlight(false);
	}
	else {
		this.getController().stopDragDrop(this);
	}
	this.setCursor("default");
};
