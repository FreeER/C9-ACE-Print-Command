/* global plugin */
/* global services */
services.commands.addCommand({
    name: "print",
    group: "ace",
    hint: "Maximize code editor for easy printing",
    bindKey     : { mac: "Command-P", win: "Ctrl-Alt-Shift-P" },

    isAvailable: function(editor) {
        var tab = services.tabManager.focussedTab;
        return tab && tab.editor.ace;
    },

    exec: function() {
        var tab = services.tabManager.focussedTab;
        require("ace/config").loadModule("ace/ext/static_highlight", function(m) {
            var editor = tab.editor.ace;
            var result = m.renderSync(
                editor.getValue(),
                editor.session.getMode(),
                editor.renderer.theme
            );
            document.body.style.display="none";
            var d = document.createElement("div");
            d.innerHTML=result.html;
            document.documentElement.appendChild(d);
            require("ace/lib/dom").importCssString(result.css);

            setTimeout(function() {window.print()}, 10);

            function restore() {
               window.removeEventListener("focus", restore, false);
               d.parentNode.removeChild(d);
               document.body.style.display= "";
               editor.resize(true);
            }
            window.addEventListener("focus", restore, false);
            d.onclick = restore;
        });
    }
}, plugin);