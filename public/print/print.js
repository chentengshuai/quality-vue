/**
 * Created by zhudaoyuan on 2020/3/31.
 */
var LODOP;
function needCLodop(){
    try{
        var ua=navigator.userAgent;
        if (ua.match(/Windows\sPhone/i) !=null) return true;
        if (ua.match(/iPhone|iPod/i) != null) return true;
        if (ua.match(/Android/i) != null) return true;
        if (ua.match(/Edge\D?\d+/i) != null) return true;
        if (ua.match(/QQBrowser/i) != null) return false;
        var verTrident=ua.match(/Trident\D?\d+/i);
        var verIE=ua.match(/MSIE\D?\d+/i);
        var verOPR=ua.match(/OPR\D?\d+/i);
        var verFF=ua.match(/Firefox\D?\d+/i);
        var x64=ua.match(/x64/i);
        if ((verTrident==null)&&(verIE==null)&&(x64!==null))
            return true; else
        if ( verFF !== null) {
            verFF = verFF[0].match(/\d+/);
            if ( verFF[0] >= 42 ) return true;
        } else
        if ( verOPR !== null) {
            verOPR = verOPR[0].match(/\d+/);
            if ( verOPR[0] >= 32 ) return true;
        } else
        if ((verTrident==null)&&(verIE==null)) {
            var verChrome=ua.match(/Chrome\D?\d+/i);
            if ( verChrome !== null ) {
                verChrome = verChrome[0].match(/\d+/);
                if (verChrome[0]>=42) return true;
            };
        };
        return false;
    } catch(err) {return true;};
};
if (typeof CreatedOKLodop7766 == 'undefined' || CreatedOKLodop7766 == null) {
    if(needCLodop())
    {
        var oscript = document.createElement("script");
        oscript.src = "http://localhost:8000/CLodopfuncs.js?priority=1";
        var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
        head.insertBefore(oscript, head.firstChild);
        head.addEventListener("load", function(event) {
            if (event.target.nodeName === "SCRIPT" && event.target.getAttribute("src") == oscript.src)
            {
                try{ LODOP=getCLodop();} catch(err) {
                    LODOP = null;
                    CreatedOKLodop7766 = {};
                    alert(err);
                };
                try {
                    LODOP.SET_LICENSES("长飞光纤光缆股份有限公司","1D94781BFAE17DEDC50B3A807E83CA12","長飛光纖光纜股份有限公司","A09A4B2ED4CE7F620802B3963C36E7CA");
                    LODOP.SET_LICENSES("THIRD LICENSE","","YOFC Optical Fibre and Cable Joint Stock Limited Company","6155EB005BA4614653D149BDC4E2E48E");
                } catch (e) {
                    LODOP = null;
                    CreatedOKLodop7766 = {};
                    alert(e);
                }
                CreatedOKLodop7766 = LODOP;
            }
        }, true);
    }
    else
    {
        var isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0);
        LODOP = document.createElement("object");
        LODOP.setAttribute("width", 0);
        LODOP.setAttribute("height", 0);
        LODOP.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
        if (isIE)
            LODOP.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
        else
            LODOP.setAttribute("type", "application/x-print-lodop");
        document.documentElement.appendChild(LODOP);
        CreatedOKLodop7766 = LODOP;
        if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined")) {
            console.log("create LODOP Failed")
            if (LODOP != null) {
                LODOP.parentNode.removeChild(LODOP);
                LODOP = null;
                CreatedOKLodop7766 = {};
            }
        }
        else {
            try {
                LODOP.SET_LICENSES("长飞光纤光缆股份有限公司","1D94781BFAE17DEDC50B3A807E83CA12","長飛光纖光纜股份有限公司","A09A4B2ED4CE7F620802B3963C36E7CA");
                LODOP.SET_LICENSES("THIRD LICENSE","","YOFC Optical Fibre and Cable Joint Stock Limited Company","6155EB005BA4614653D149BDC4E2E48E");
            } catch (e) {
                alert(e);
            }
        }
    }
}