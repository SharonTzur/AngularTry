/**
 * AngularJS Tutorial 1
 * @author Nick Kaye <nick.c.kaye@gmail.com>
 */

/**
 * Main AngularJS Web Application
 */function handleParseError(err) {
    switch (err.code) {
        case Parse.Error.INVALID_SESSION_TOKEN:
            Parse.User.logOut();
    }
}

(function () {
    Parse.initialize("eJukmpYRRnPheSJjnmUUPtfk1e2z7oOSEMvxW8WS", "CLQTl0cAsj6yaGM2LT6GqjOAiloBVRzSlCJcZTnJ");


    var app = angular.module('AngularTry', [
        'ngRoute', 'parse-angular'
    ]);


    /**
     * Configure the Routes
     */
    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            // Home

            .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})
            // Pages
            .when("/signup", {templateUrl: "partials/signup.html", controller: "SignUpCtrl"})
            .when("/login", {templateUrl: "partials/login.html", controller: "LoginCtrl"})

            .when("/newstrategy", {templateUrl: "partials/newstrategy.html", controller: "CreateCtrl"})
            .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})
            .when("/faq", {templateUrl: "partials/faq.html", controller: "PageCtrl"})
            .when("/pricing", {templateUrl: "partials/pricing.html", controller: "PageCtrl"})
            .when("/services", {templateUrl: "partials/services.html", controller: "PageCtrl"})
            .when("/contact", {templateUrl: "partials/contact.html", controller: "PageCtrl"})
            // Blog
            .when("/blog", {templateUrl: "partials/blog.html", controller: "BlogCtrl"})
            .when("/blog/post", {templateUrl: "partials/blog_item.html", controller: "BlogCtrl"})
            // else 404
            .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
    }]);

    /**
     * Controls the Blog
     */
    app.controller('BlogCtrl', function (/* $scope, $location, $http */) {
        console.log("Blog Controller reporting for duty.");
    });


    app.factory("myService", function () {

        return {
            currentUser: Parse.User.current(),
            activeUser : false
        }
    });


    app.controller('LoginCtrl', function ($scope, myService) {
        console.log("Login reporting for duty.");
        $scope.newUser = {};
        $scope.login = function (newUser) {
            Parse.User.logIn(newUser.username, newUser.password, {
                success: function (user) {
                    myService.currentUser = Parse.User.current();
                    updateHeader(true);
                },
                error  : function (user, error) {

                    handleParseError(error);

                }
            });

        };
        function updateHeader(val) {
            myService.activeUser = val;
        }
    });


    app.controller('HeaderCtrl', function ($scope, myService) {

        $scope.activeUser = myService.activeUser;


        console.log("Header Controller reporting for duty.");

        if (myService.currentUser) {
            $scope.activeUser = true;
            $scope.currentUsername = myService.currentUser.attributes.username;
        }


        $scope.logout = function () {
            $scope.activeUser = false;
            Parse.User.logOut();
            $scope.user = myService.currentUser;

        };
    });


    app.controller('SignUpCtrl', function ($scope) {

        $scope.newUser = {};
        $scope.signUp = function (newUser) {
            var user = new Parse.User();
            user.set("username", newUser.username);
            user.set("password", newUser.password);
            user.set("email", newUser.email);
            user.signUp(null, {
                success: function (user) {
                    var token = user._sessionToken;

                },
                error  : function (user, error) {
                    handleParseError(error);


                    // Show the error message somewhere and let the user try again.
                    alert("Error: " + error.code + " " + error.message);
                }
            });


        };


    });

    /**
     * Controls all other Pages
     */
    app.controller('PageCtrl', function (/* $scope, $location, $http */) {
        console.log("Page Controller reporting for duty.");

        // Activates the Carousel
        $('.carousel').carousel({
            interval: 5000
        });

        // Activates Tooltips for Social Links
        $('.tooltip-social').tooltip({
            selector: "a[data-toggle=tooltip]"
        })
    });


    app.controller('CreateCtrl', function ($scope/*, $location, $http */) {
        console.log("Create Controller reporting for duty.");
        $scope.savedModelData = {};
        $scope.strategy = {}
        $scope.save = function () {
            $scope.strategy.rawdata = myDiagram.model.toJson();
            document.getElementById("mySavedModel").value = myDiagram.model.toJson();
            myDiagram.isModified = false;
            $scope.modifyStrategySave($scope.strategy);
            /*
             access to saved strategy:
             myDiagram.model
             */


        };

        $scope.modifyStrategySave = function (newStrategy) {
            var rawStrat = JSON.parse(newStrategy.rawdata);

            var Strategy = Parse.Object.extend("Strategy");

            var strategy = new Strategy();


            strategy.save({
                title                 : newStrategy.title,
                nodeDataArray         : rawStrat.nodeDataArray,
                linkDataArray         : rawStrat.linkDataArray,
                linkFromPortIdProperty: rawStrat.linkFromPortIdProperty,
                linkToPortIdProperty  : rawStrat.linkToPortIdProperty,
                class                 : rawStrat.class
            }, {
                success: function (strategy) {
                    debugger;
                },
                error  : function (strategy, error) {
                    debugger;

                    // The save failed.
                    // error is a Parse.Error with an error code and message.
                }
            });

            debugger;

        };
        $scope.load = function () {
            myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
        };
        // add an SVG rendering of the diagram at the end of this page
        $scope.makeSVG = function () {
            var svg = myDiagram.makeSvg({
                scale: 0.5
            });
            svg.style.border = "1px solid black";
            obj = document.getElementById("SVGArea");
            obj.appendChild(svg);
            if (obj.children.length > 0) {
                obj.replaceChild(svg, obj.children[0]);
            }
        };
        var showPorts = function (node, show) {
            var diagram = node.diagram;
            if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
            node.ports.each(function (port) {
                port.stroke = (show ? "white" : null);
            });
        };
        var init = function () {
            if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
            var $ = go.GraphObject.make;  // for conciseness in defining templates
            myDiagram =
                $(go.Diagram, "myDiagram",  // must name or refer to the DIV HTML element
                    {
                        initialContentAlignment    : go.Spot.Center,
                        allowDrop                  : true,  // must be true to accept drops from the Palette
                        "LinkDrawn"                : showLinkLabel,  // this DiagramEvent listener is defined below
                        "LinkRelinked"             : showLinkLabel,
                        "animationManager.duration": 800, // slightly longer than default (600ms) animation
                        "undoManager.isEnabled"    : true  // enable undo & redo
                    });
            // when the document is modified, add a "*" to the title and enable the "Save" button
            myDiagram.addDiagramListener("Modified", function (e) {
                var button = document.getElementById("SaveButton");
                if (button) button.disabled = !myDiagram.isModified;
                var idx = document.title.indexOf("*");
                if (myDiagram.isModified) {
                    if (idx < 0) document.title += "*";
                } else {
                    if (idx >= 0) document.title = document.title.substr(0, idx);
                }
            });
            // helper definitions for node templates
            function nodeStyle() {
                return [
                    // The Node.location comes from the "loc" property of the node data,
                    // converted by the Point.parse static method.
                    // If the Node.location is changed, it updates the "loc" property of the node data,
                    // converting back using the Point.stringify static method.
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    {
                        // the Node.location is at the center of each node
                        locationSpot: go.Spot.Center,
                        //isShadowed: true,
                        //shadowColor: "#888",
                        // handle mouse enter/leave events to show/hide the ports
                        mouseEnter  : function (e, obj) {
                            showPorts(obj.part, true);
                        },
                        mouseLeave  : function (e, obj) {
                            showPorts(obj.part, false);
                        }
                    }
                ];
            }

            // Define a function for creating a "port" that is normally transparent.
            // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
            // and where the port is positioned on the node, and the boolean "output" and "input" arguments
            // control whether the user can draw links from or to the port.
            function makePort(name, spot, output, input) {
                // the port is basically just a small circle that has a white stroke when it is made visible
                return $(go.Shape, "Circle",
                    {
                        fill        : "transparent",
                        stroke      : null,  // this is changed to "white" in the showPorts function
                        desiredSize : new go.Size(8, 8),
                        alignment   : spot, alignmentFocus: spot,  // align the port on the main Shape
                        portId      : name,  // declare this object to be a "port"
                        fromSpot    : spot, toSpot: spot,  // declare where links may connect at this port
                        fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                        cursor      : "pointer"  // show a different cursor to indicate potential link point
                    });
            }

            // define the Node templates for regular nodes
            var lightText = 'whitesmoke';
            myDiagram.nodeTemplateMap.add("",  // the default category
                $(go.Node, "Spot", nodeStyle(),
                    // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                    $(go.Panel, "Auto",
                        $(go.Shape, "Rectangle",
                            {fill: "#00A9C9", stroke: null},
                            new go.Binding("figure", "figure")),
                        $(go.TextBlock,
                            {
                                font    : "bold 11pt Helvetica, Arial, sans-serif",
                                stroke  : lightText,
                                margin  : 8,
                                maxSize : new go.Size(160, NaN),
                                wrap    : go.TextBlock.WrapFit,
                                editable: true
                            },
                            new go.Binding("text").makeTwoWay())
                    ),
                    // four named ports, one on each side:
                    makePort("T", go.Spot.Top, false, true),
                    makePort("L", go.Spot.Left, true, true),
                    makePort("R", go.Spot.Right, true, true),
                    makePort("B", go.Spot.Bottom, true, false)
                ));
            myDiagram.nodeTemplateMap.add("Start",
                $(go.Node, "Spot", nodeStyle(),
                    $(go.Panel, "Auto",
                        $(go.Shape, "Circle",
                            {minSize: new go.Size(40, 40), fill: "#79C900", stroke: null}),
                        $(go.TextBlock, "Start",
                            {font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText},
                            new go.Binding("text"))
                    ),
                    // three named ports, one on each side except the top, all output only:
                    makePort("L", go.Spot.Left, true, false),
                    makePort("R", go.Spot.Right, true, false),
                    makePort("B", go.Spot.Bottom, true, false)
                ));
            myDiagram.nodeTemplateMap.add("End",
                $(go.Node, "Spot", nodeStyle(),
                    $(go.Panel, "Auto",
                        $(go.Shape, "Circle",
                            {minSize: new go.Size(40, 40), fill: "#DC3C00", stroke: null}),
                        $(go.TextBlock, "End",
                            {font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText},
                            new go.Binding("text"))
                    ),
                    // three named ports, one on each side except the bottom, all input only:
                    makePort("T", go.Spot.Top, false, true),
                    makePort("L", go.Spot.Left, false, true),
                    makePort("R", go.Spot.Right, false, true)
                ));
            myDiagram.nodeTemplateMap.add("Comment",
                $(go.Node, "Auto", nodeStyle(),
                    $(go.Shape, "File",
                        {fill: "#EFFAB4", stroke: null}),
                    $(go.TextBlock,
                        {
                            margin   : 5,
                            maxSize  : new go.Size(200, NaN),
                            wrap     : go.TextBlock.WrapFit,
                            textAlign: "center",
                            editable : true,
                            font     : "bold 12pt Helvetica, Arial, sans-serif",
                            stroke   : '#454545'
                        },
                        new go.Binding("text").makeTwoWay())
                    // no ports, because no links are allowed to connect with a comment
                ));
            // replace the default Link template in the linkTemplateMap
            myDiagram.linkTemplate =
                $(go.Link,  // the whole link panel
                    {
                        routing       : go.Link.AvoidsNodes,
                        curve         : go.Link.JumpOver,
                        corner        : 5, toShortLength: 4,
                        relinkableFrom: true,
                        relinkableTo  : true,
                        reshapable    : true,
                        resegmentable : true,
                        // mouse-overs subtly highlight links:
                        mouseEnter    : function (e, link) {
                            link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
                        },
                        mouseLeave    : function (e, link) {
                            link.findObject("HIGHLIGHT").stroke = "transparent";
                        }
                    },
                    new go.Binding("points").makeTwoWay(),
                    $(go.Shape,  // the highlight shape, normally transparent
                        {isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT"}),
                    $(go.Shape,  // the link path shape
                        {isPanelMain: true, stroke: "gray", strokeWidth: 2}),
                    $(go.Shape,  // the arrowhead
                        {toArrow: "standard", stroke: null, fill: "gray"}),
                    $(go.Panel, "Auto",  // the link label, normally not visible
                        {visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
                        new go.Binding("visible", "visible").makeTwoWay(),
                        $(go.Shape, "RoundedRectangle",  // the label shape
                            {fill: "#F8F8F8", stroke: null}),
                        $(go.TextBlock, "Yes",  // the label
                            {
                                textAlign: "center",
                                font     : "10pt helvetica, arial, sans-serif",
                                stroke   : "#333333",
                                editable : true
                            },
                            new go.Binding("text", "text").makeTwoWay())
                    )
                );
            // Make link labels visible if coming out of a "conditional" node.
            // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
            function showLinkLabel(e) {
                var label = e.subject.findObject("LABEL");
                if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
            }

            // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
            myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
            myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
            $scope.load();  // load an initial diagram from some JSON text
            // initialize the Palette that is on the left side of the page
            myPalette =
                $(go.Palette, "myPalette",  // must name or refer to the DIV HTML element
                    {
                        "animationManager.duration": 800, // slightly longer than default (600ms) animation
                        nodeTemplateMap            : myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
                        model                      : new go.GraphLinksModel([  // specify the contents of the Palette
                            {category: "Start", text: "Start"},
                            {category: "task", text: "task", figure: "Diamond"},
                            {category: "How", text: "How"},
                            {category: "Why", text: "Why"},
                            {category: "Tip", text: "Tip"},
                            {category: "Example", text: "Example"},
                            {category: "End", text: "End"}
                        ])
                    });


        };
// and fire it after definition
        init();

    });

})();