var EventEmmiter = function(){
    var self = this;

    var fn_list = [];

    /**
     * adds a function to subscription list for this event
     * @param {function} fn
     */
    self.subscribe = function (fn) {
        if (typeof(fn) === 'function') {
            fn_list.push(fn);
            return;
        }
        throw 'fn parameter IS NOT a function';
    }

    self.emmit = function (...args1) {
        for (let i = 0; i < fn_list.length; i++) {
            const fn = fn_list[i];
            fn.apply(null,args1);
        }
    }
}

window.AppStructure = new function(){
    var self = this;

    /** حداقل عرض که اجازه فیکس کردن منو را میدهد */
    var minWidthFixAllowed = 992;
    var appMain = null;
    var appMenuLeft = null;
    var appMenuRight = null;
    
    var ev_onFixed = new EventEmmiter();
    


    //#region private methods
    
    var init = function () {
        appMain = document.getElementsByClassName('app-main')[0];
        appMenuLeft = document.getElementsByClassName('app-menu-left')[0];
        appMenuRight = document.getElementsByClassName('app-menu-right')[0];

        if (appMain) {
            appMain.onclick = function(){
                hideAllMenus();
            }
        }
        if (appMenuLeft) {
            appMenuLeft.onclick = function(){
                (event && event.stopPropagation());
            }
        }
        if (appMenuRight) {
            appMenuRight.onclick = function(){
                (event && event.stopPropagation());
            }
        }


        if (isFixingAllowed()) {
            (self.config.leftMenuFixedAtStartup && fixMenu(appMenuLeft, 'left'));
            (self.config.rightMenuFixedAtStartup && fixMenu(appMenuRight, 'right'));
        } else {
            unfixMenu(appMenuLeft);
            unfixMenu(appMenuRight);
        }
    }

    var getSideMenuItem = function(side){
        if (side==='left') {
            return appMenuLeft;
        } else if (side==='right') {
            return appMenuRight;
        }
        return null;
    }

    var hideMenu = function(menu){
        if (menu) {
            menu.classList.remove('floating-show');
            appMain.classList.remove('show-menu');
        }
    }
    
    var hideAllMenus = function(){
        hideMenu(appMenuLeft);
        hideMenu(appMenuRight);
    }

    var showMenu = function(menu){
        if (menu) {
            menu.classList.add('floating-show');
        }
        appMain.classList.add('show-menu');
    }
    var isMenuShowing = function(menu){
        if (menu) {
            return menu.classList.contains('floating-show');
        }
        return null;
    }
    var isMenuFixed = function(menu){
        if (menu) {
            return !menu.classList.contains('floating');
        }
        return null;
    }

    var fixMenu = function(menu, side){
        if (menu && isFixingAllowed()) {
            menu.classList.remove('floating');
            ev_onFixed.emmit(menu, side);
        }
    }

    var unfixMenu = function(menu){
        if (menu) {
            menu.classList.add('floating');
        }
    }

    var isFixingAllowed = function(){
        return window.innerWidth >= minWidthFixAllowed;
    }

    //#endregion


    //#region public methods
    self.config = {
        rightMenuFixedAtStartup: true,
        leftMenuFixedAtStartup: false,
    };

    self.toggleFixMenu = function(side){
        (event && event.stopPropagation());
        var menu = getSideMenuItem(side);
        if (!menu) {
            return null;
        }
        hideMenu(menu);
        if (isMenuFixed(menu) === false) {
            fixMenu(menu, side);
            return true;
        } else if (isMenuFixed(menu) === true){
            unfixMenu(menu);
            return false;
        }
        return null;
    }
    self.showMenu = function(side){
        (event && event.stopPropagation());
        hideAllMenus();
        var menu = getSideMenuItem(side);
        if (!isMenuFixed(menu)) {
            showMenu(menu);
        }
    }
    self.hideMenu = function(side){
        (event && event.stopPropagation());
        var menu = getSideMenuItem(side);
        hideMenu(menu);
    }
    self.hideAllMenus = function(){
        hideAllMenus();
    }
    self.isFixingAllowed = function(){
        return isFixingAllowed();
    }
    self.isMenuShowing = function(side){
        var menu = getSideMenuItem(side);
        return isMenuShowing(menu);
    }
    self.toggleMenu = function(side){
        (event && event.stopPropagation());
        var menu = getSideMenuItem(side);
        var isShowing = isMenuShowing(menu);
        hideAllMenus();
        if (isShowing === false && !isMenuFixed(menu)) {
            showMenu(menu);
        }
    }

    /**
     * menu fixed event
     * @param {(menuElement: HTMLElement, menuSide: string) => void} fn 
     */
    self.onFixed = function (fn) {
        ev_onFixed.subscribe(fn);
    }

    self.init = function(){
        init();
    }
    //#endregion
}
