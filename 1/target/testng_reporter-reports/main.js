
            
            var selectedTestCaseLink;

            function clearAllSelections() {
                if (selectedTestCaseLink != null) {
                    selectedTestCaseLink.className = "testCaseLink";
                }
            }

            function selectTestCaseLink(testCaseLinkElement) {
                clearAllSelections();
                testCaseLinkElement.className = "testCaseLinkSelected";
                selectedTestCaseLink = testCaseLinkElement;
            }

            function switchTestMethodsView(checkbox) {
                document.getElementById("testMethodsByStatus").style["display"] = checkbox.checked ? "none" : "block";
                document.getElementById("testMethodsByClass").style["display"] = checkbox.checked ? "block" : "none";
            }

            function toggleVisibility(elementId) {
                var displayElement = document.getElementById(elementId);
                if (getCurrentStyle(displayElement, "display") == "none") {
                    displayElement.style["display"] = "block";
                } else {
                    displayElement.style["display"] = "none";
                }
            }

            function toggleDetailsVisibility(elementId) {
                var displayElement = document.getElementById(elementId);
                if (displayElement.className == "testMethodDetails") {
                    displayElement.className = "testMethodDetailsVisible";
                    document.getElementById("imgExpand_"+elementId).src = "images/open.gif";
                } else {
                    displayElement.className = "testMethodDetails";
                    document.getElementById("imgExpand_"+elementId).src = "images/close.gif";
                }
            }

            function toggleTestRunDetailsVisibility(elementId) {
                var displayElement = document.getElementById(elementId).parentNode.parentNode;
                if (displayElement.className == "testRunDetails") {
                    displayElement.className = "testRunDetailsVisible";
                    document.getElementById("imgExpand_"+elementId).src = "images/open.gif";
                } else {
                    displayElement.className = "testRunDetails";
                    document.getElementById("imgExpand_"+elementId).src = "images/close.gif";
                }
            }
			
			function toggleReportVisibility(elementId) {
                var displayElement = document.getElementById(elementId);
                if (displayElement.className == "reportDetails") {
                    displayElement.className = "reportDetailsVisible";
                } else {
                    displayElement.className = "reportDetails";
                }
            }
			
			function toggleReportsVisibility(elementId) {
                var displayElement = document.getElementById(elementId);
                if (displayElement.className == "reportsDetails") {
                    displayElement.className = "reportsDetailsVisible section";
                } else {
                    displayElement.className = "reportsDetails";
                }
            }

            function toggleExceptionsVisibility(elementId) {
                var displayElement = document.getElementById(elementId);
                if (displayElement.className == "exceptionDetails") {
                    displayElement.className = "exceptionDetailsVisible";
                } else {
                    displayElement.className = "exceptionDetails";
                }
            }

             function toggleLogsVisibility(elementId) {
                /*var displayElement = document.getElementById(elementId);
                if (displayElement.className == "logDetails") {
                    displayElement.className = "logDetailsVisible";
                } else {
                    displayElement.className = "logDetails";
                } */
                newwindow = window.open("logOpener.html?id="+elementId,'Log Details','height=600,width=850');

				formatLog(elementId);
            }

            function getCurrentStyle(elem, prop) {
                if (elem.currentStyle) {
                    var ar = prop.match(/\w[^-]*/g);
                    var s = ar[0];
                    for(var i = 1; i < ar.length; ++i) {
                        s += ar[i].replace(/\w/, ar[i].charAt(0).toUpperCase());
                    }
                    return elem.currentStyle[s];
                } else if (document.defaultView.getComputedStyle) {
                    return document.defaultView.getComputedStyle(elem, null).getPropertyValue(prop);
                }
            }

            function testMethodsFilterChanged(filterCheckBox, status) {
                var filterAll = document.getElementById("methodsFilter_ALL");
                var filterFail = document.getElementById("methodsFilter_FAIL");
                var filterPass = document.getElementById("methodsFilter_PASS");
                var filterSkip = document.getElementById("methodsFilter_SKIP");
                var filterConf = document.getElementById("methodsFilter_CONF");
                if (filterCheckBox != filterAll) {
                    filterMethods(filterCheckBox, status);
                    checkMainFilter(filterAll, filterFail, filterPass, filterSkip, filterConf);
                } else {
                    filterFail.checked = filterPass.checked = filterSkip.checked = filterConf.checked = filterAll.checked;
                    filterMethods(filterAll, "FAIL");
                    filterMethods(filterAll, "PASS");
                    filterMethods(filterAll, "SKIP");
                    filterMethods(filterAll, "CONF");
                }
                closeAllExpandedDetails();
            }

            function checkMainFilter(filterAll, filterFail, filterPass, filterSkip, filterConf) {
                if ((filterFail.checked == filterPass.checked) && (filterPass.checked == filterSkip.checked) && (filterSkip.checked == filterConf.checked)) {
                    filterAll.checked = filterFail.checked;
                } else {
                    filterAll.checked = false;
                }
            }

            function filterMethods(filterCheckBox, status) {
                var visible = filterCheckBox.checked;
                alterCssElement("testMethodStatus" + status, "display", visible ? "" : "none");
            }            
			
			function formatLog(docEleid) {
                var str = document.getElementById(docEleid).innerHTML;
				var new_str = str.replace(/                                                         /gi, "");
				document.getElementById(docEleid).innerHTML = new_str;
            }

            function alterCssElement(cssClass, element, value) {
                var rules;
                if (document.all) {
                    rules = 'rules';
                }
                else if (document.getElementById) {
                    rules = 'cssRules';
                }
                for (var i = 0; i < document.styleSheets.length; i++) {
                    for (var j = 0; j < document.styleSheets[i][rules].length; j++) {
                        if (document.styleSheets[i][rules][j].selectorText.indexOf(cssClass) > -1) {
                            document.styleSheets[i][rules][j].style[element] = value;
                            break;
                        }
                    }
                }
            }

            function closeAllExpandedDetails() {
                var node = document.getElementsByTagName("body")[0];
                //var re = new RegExp("\\btestMethodDetailsVisible\\b");
                var els = document.getElementsByTagName("div");
                for (var i = 0,j = els.length; i < j; i++) {
                    if (els[i].className == "testMethodDetailsVisible") {
                        els[i].className = "testMethodDetails";
                    }
                }
            }

            function renderSvgEmbedTag(chartWidth, chartHeight) {
                var success = false;
                var userAgent = navigator.userAgent;

                if (userAgent.indexOf("Firefox") > -1 || userAgent.indexOf("Safari") > -1) {
                    success = true;
                } else if (navigator.mimeTypes != null && navigator.mimeTypes.length > 0) {
                    if (navigator.mimeTypes["image/svg+xml"] != null) {
                        success = true;
                    }
                } else if (window.ActiveXObject) {
                    try {
                        testObj = new ActiveXObject("Adobe.SVGCtl");
                        success = true;
                    } catch (e) {}
                }

                var chartContainer = document.getElementById('chart-container');
                
                if (success) {
                    var chart = document.createElement('embed');
                    
                    chart.src = 'overview-chart.svg';
                    chart.type = 'image/svg+xml';
                    chart.width = chartWidth;
                    chart.height = chartHeight;
                    
                    chartContainer.appendChild(chart);
                } else {
                    var message = document.createElement('h4');
                    var text = document.createTextNode('SVG Pie Charts are not available. Please install a SVG viewer for your browser.');
                    
                    message.style.color = 'navy';
                    message.appendChild(text);
                    
                    chartContainer.appendChild(message);
                }
            }


            function gup( name )
                        {
                          name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
                          var regexS = "[\\?&]"+name+"=([^&#]*)";
                          var regex = new RegExp( regexS );
                          var results = regex.exec( window.location.href );
                          if( results == null )
                            return "";
                          else
                            return results[1];
                        }
            
        