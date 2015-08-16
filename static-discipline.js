// -*- js2 -*-
// Copyright (c) <2015> <Derek Rhodes (physci@gmail.com)>

// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// (setq-default indent-tabs-mode nil)
"use strict";

const nil = null;

var StaticCommon = {};
StaticCommon.MIT_RED = "#a31f34";
StaticCommon.LOGIC_LEVEL_LO = 0;
StaticCommon.LOGIC_LEVEL_HI = 5;
StaticCommon.COLOR_OF_FORBIDDEN = StaticCommon.MIT_RED;
StaticCommon.Clip = function(v) {
    if (v < StaticCommon.LOGIC_LEVEL_LO) {
        return StaticCommon.LOGIC_LEVEL_LO;
    }
    if (v > StaticCommon.LOGIC_LEVEL_HI) {
        return StaticCommon.LOGIC_LEVEL_HI;
    }
    return v;
};

// Plot of the transfer function containing the user controls
function TransferPlot(top, left, size) {
    const LOGIC_LEVEL_LO = StaticCommon.LOGIC_LEVEL_LO;
    const LOGIC_LEVEL_HI = StaticCommon.LOGIC_LEVEL_HI;
    var PLOT_TOP = top; 
    var PLOT_LEFT = left;
    var PLOT_WIDTH = size;
    var PLOT_HEIGHT = size;
    const PLOT_RIGHT = PLOT_LEFT + PLOT_WIDTH;
    const PLOT_BOTTOM = PLOT_TOP + PLOT_HEIGHT;
    
    // slider thickness and breadth is hard coded in the path string as
    // extracted from inkscapes exported .svg found in ./design/slider.svg
    const SLIDER_THICK = 10;
    const SLIDER_BREADTH = 30;
    const ACTIVE_SLIDER_COLOR = "blue";
    const LINE_THICKNESS = 1;

    function ClampY(y) {
        if (y > PLOT_BOTTOM - SLIDER_THICK) {
            return PLOT_BOTTOM - SLIDER_THICK;
        }
        if (y < PLOT_TOP + SLIDER_THICK) {
            return PLOT_TOP + SLIDER_THICK;
        }
        return y;
    }
    function ClampX(x) {
        if (x > PLOT_RIGHT - SLIDER_THICK) {
            return PLOT_RIGHT - SLIDER_THICK;
        }
        if (x < PLOT_LEFT + SLIDER_THICK) {
            return PLOT_LEFT + SLIDER_THICK;
        }
        return x;
    }

    // -----------------------------------------------------------------------------
    function InheritAdjuster(self) {
        self._dirty = false;

        self.Adjusted = function() {
            return self._dirty;
        };
        self.MakeClean = function() {
            self._dirty = false;
        };
        self.MakeDirty = function() {
            self._dirty = true;
        };
    }

    // -----------------------------------------------------------------------------
    function InheritSliderStyle(self) {
        self.knob = new paper.Path("m 10,1022.3622 0,30 -10,-10 0,-10 z");
        self.knob.fillColor = 'black';
        self._highlighted = false;

        self.Highlight = function() {
            self.knob.fillColor = ACTIVE_SLIDER_COLOR;
            self.line.strokeColor = 'blue';
            self._highlighted = true;
            self.SetTextToVolts();
        };

        self.UnHighlight = function() {
            self.knob.fillColor = 'black';
            self.line.strokeColor = 'lightgray';
            self._highlighted = false;
            self.SetTextToLabel();
        };

        self.IsHighlighted = function() {
            return self._highlighted;
        };
    }

    // -----------------------------------------------------------------------------
    function InheritSliderLabel(self, txt) {
        self.labelTxt = txt;
        self.text = new paper.PointText(new paper.Point(50, 50));
        self.text.fillColor = 'black';
        self.text.content = txt;
        self.text.fontFamily = "courier";
        self.text.fontSize = 16;

        self.SetTextX = function(x) { self.text.position.x = x; };
        self.SetTextY = function(y) { self.text.position.y = y; };
        self.SetTextLoc = function(x, y) {
            self.SetTextX(x); self.SetTextY(y);
        };

        self.SetTextToVolts = function() {
            var v = self.Volts();
            self.text.content = self.Volts().toFixed(1);
        };
        self.SetTextToLabel = function() {
            self.text.content = self.labelTxt;
        };
    }

    // -----------------------------------------------------------------------------
    var _show_flag = false;
    function Popup(msg) {
        if (_show_flag) {
            return;
        }
        _show_flag = true;

        var text = new paper.PointText(new paper.Point(0, 0));
        text.fillColor = 'black';
        text.content = msg;
        text.fontFamily = "courier";
        text.fontSize = 16;
        text.position.x = PLOT_LEFT + text.bounds.width/2;
        text.position.y = PLOT_TOP - text.bounds.height/2;

        setTimeout( function() {
            text.remove();
            _show_flag = false;
        }, 500);
    }

    // -----------------------------------------------------------------------------
    function ScrollBarV(paper, left, top) {
        var self = {
            path: nil,
            sliderVol: nil,
            sliderVoh: nil
        };
        InheritAdjuster(self);

        //returns [Closer slider, Furthor slider]
        self.ClosestSlider = function(y) {
            var volY = self.sliderVol.Y();
            var vohY = self.sliderVoh.Y();

            var dVol = Math.abs(y - volY);
            var dVoh = Math.abs(y - vohY);

            if (dVol <= dVoh) {
                return [self.sliderVol, self.sliderVoh];
            } else {
                return [self.sliderVoh, self.sliderVol];
            }
        };

        self.init = function() {
            var x = left;
            var y = top;
            var p1 = new paper.Point(x, y);
            var p2 = new paper.Point(x + SLIDER_BREADTH,
                                     y + PLOT_BOTTOM - PLOT_TOP);

            self.path = new paper.Path.Rectangle(p1, p2);
            self.path.fillColor = '#b3b3b3';
            self.path.opacity =0.3;

            self.BackgroundOpacity = function(n) {
                self.path.opacity = n;
            };

            // setup the event callbacks.
            self.path.on('mouseleave', function() {
                // deselect bots sliders.
                self.sliderVol.UnHighlight();
                self.sliderVoh.UnHighlight();
                self.BackgroundOpacity(0.3);
            });

            self.path.on('mousedrag', function(evt) {
                // mark dirty
                self.MakeDirty();

                // move the closest slider to this mouse position.
                var y = ClampY(evt.point.y);
                var slider = self.ClosestSlider(y)[0];
                slider.MoveTo(y);
            });

            self.path.on('mouseup', function(evt) {
            });

            self.path.on('mouseenter', function(evt) {
                self.BackgroundOpacity(.2);
            });

            self.path.on('mousemove', function(evt) {
                // Highlight the closest slider.
                var y = ClampY(evt.point.y);

                var pair = self.ClosestSlider(y);
                pair[0].Highlight();
                pair[1].UnHighlight();
            });

            self.path.on('mousedown', function(evt) {
                // move the closest slider to this mouse position.
                var y = ClampY(evt.point.y);
                var pair = self.ClosestSlider(y);
                pair[0].MoveTo(y);
                self.MakeDirty();
            });
            return self;
        };

        return self.init();
    }

    // -----------------------------------------------------------------------------
    function SliderVoh(paper) {
        var self = {
            x: PLOT_LEFT - SLIDER_BREADTH / 2,
            y: 0,
            knob: nil,
            line: nil,
            paper: paper
        };
        InheritSliderStyle(self);
        InheritSliderLabel(self, "Voh");

        self.init = function() {
            self.knob.rotate(90);
        };

        self.Volts = function() {
            var pxRange = PLOT_HEIGHT;
            var ratio = (PLOT_BOTTOM - self.Y()) / pxRange;
            return StaticCommon.Clip(LOGIC_LEVEL_HI * ratio);
        };

        ClampY = function(y) {
            if (y > PLOT_BOTTOM - SLIDER_THICK) {
                return PLOT_BOTTOM - SLIDER_THICK;
            }
            if (y < PLOT_TOP + SLIDER_THICK) {
                return PLOT_TOP + SLIDER_THICK;
            }
            return y;
        };

        self.SetY = function(y) {
            return self.y = ClampY(y);
        };

        self.Y = function() {
            return self.y;
        };

        self.SetV = function(v) {
            v = StaticCommon.Clip(v);
            var ratio = v / LOGIC_LEVEL_HI;
            var py = ratio * PLOT_HEIGHT;
            self.MoveTo(PLOT_BOTTOM - py);
        };

        self.MoveTo = function(y) {
            self.SetY(y);
            var nudge = SLIDER_THICK / 2;
            self.knob.position = new paper.Point(self.x, self.y - nudge);
            // draw the line
            self.UpdateLine(y);
            self.SetTextLoc(self.x - SLIDER_BREADTH - nudge, self.Y() - nudge);
        };

        self.UpdateLine = function(y) {
            if (self.line != nil) {
                self.line.remove();
            }
            var from = new paper.Point(PLOT_LEFT, self.Y());
            var to = new paper.Point(PLOT_RIGHT, self.Y());
            self.line = new paper.Path.Line(from, to);
            self.line.strokeColor = 'lightgray';
            self.line.dashArray = [2, 4];
        };

        self.init();
        return self;
    }

    // -----------------------------------------------------------------------------
    function SliderVol(paper) {
        var self = {
            x: PLOT_LEFT - SLIDER_BREADTH/2,
            y: 0,
            knob: nil,
            line: nil,
            paper: paper
        };
        InheritSliderStyle(self);
        InheritSliderLabel(self, "Vol");

        self.init = function() {
            self.knob.rotate(-90);
        };

        self.SetY = function(y) {
            return self.y = ClampY(y);
        };

        self.Y = function() {
            return self.y;
        };

        self.Volts = function() {
            var ratio = (PLOT_BOTTOM - self.Y()) / PLOT_HEIGHT;
            var v = ratio * StaticCommon.LOGIC_LEVEL_HI;
            return StaticCommon.Clip(v);
        };

        self.SetV = function(v) {
            v = StaticCommon.Clip(v);
            var ratio = v / LOGIC_LEVEL_HI;
            var px = ratio * PLOT_HEIGHT;
            self.MoveTo(PLOT_BOTTOM - px);
        };

        self.MoveTo = function(y) {
            self.SetY(y);
            self.knob.position = new paper.Point(self.x, self.y + SLIDER_THICK/2);
            // draw the line
            self.UpdateLine();
            var nudge = 5;
            self.SetTextLoc(self.x - SLIDER_BREADTH - nudge, self.Y() + SLIDER_THICK/2);
        };

        self.UpdateLine = function() {
            if (self.line != nil) {
                self.line.remove();
            }
            var y = self.Y(); //- SLIDER_THICK/2;
            var from = new paper.Point(PLOT_LEFT, y);
            var to = new paper.Point(PLOT_RIGHT, y);
            self.line = new paper.Path.Line(from, to);
            self.line.strokeColor = 'lightgray';
            self.line.dashArray = [2, 4];
        };

        self.init();
        return self;
    }

    // -----------------------------------------------------------------------------
    function ScrollBarH(paper, left, top) {
        var self = {
            path: nil,
            sliderVil: nil,
            sliderVih: nil
        };
        InheritAdjuster(self);

        self.init = function() {
            // setup the path.
            var x = left;
            var y = top;
            var p1 = new paper.Point(x, y);
            var p2 = new paper.Point(x + PLOT_RIGHT - PLOT_LEFT,
                                     y + SLIDER_BREADTH);
            self.path = new paper.Path.Rectangle(p1, p2);
            self.path.fillColor = '#b3b3b3';
            self.path.opacity =0.3;

            // setup the event callbacks.
            self.path.on('mouseleave', function() {
                // deselect bots sliders.
                self.sliderVil.UnHighlight();
                self.sliderVih.UnHighlight();
            });
            self.path.on('mousedown', function(evt) {
                // move the closest slider to this mouse position.
                var x = evt.point.x;
                var pair = self.ClosestSlider(x);
                pair[0].MoveTo(x);
                self.MakeDirty();
            });
            self.path.on('mouseup', function(evt) {
            });

            self.path.on('mousedrag', function(evt) {
                // make dirty.
                self.MakeDirty();

                // move the closest slider to this mouse position.
                var x = evt.point.x;
                var slider = self.ClosestSlider(x)[0];

                // drag a slider only if cursor is in range.
                if (x > PLOT_LEFT && x < PLOT_RIGHT) {
                    slider.MoveTo(x);
                }
            });
            self.path.on('mousemove', function(evt) {
                // Highlight the closest slider.
                var x = evt.point.x;
                var pair = self.ClosestSlider(x);
                pair[0].Highlight();
                pair[1].UnHighlight();
            });
        };

        // returns [Closer slider, Furthor slider]
        self.ClosestSlider = function(x) {
            var vilX = self.sliderVil.X();
            var vihX = self.sliderVih.X();

            var dVil = Math.abs(x - vilX);
            var dVih = Math.abs(x - vihX);

            if (dVil <= dVih) {
                return [self.sliderVil, self.sliderVih];
            } else {
                return [self.sliderVih, self.sliderVil];
            }
        };

        self.init();
        return self;
    }

    // -----------------------------------------------------------------------------
    function SliderVih(paper) {
        // has a handle and a dotted line
        var self = {
            x:0, y:0,
            knob: nil,
            line: nil,
            tag: nil
        };
        InheritSliderStyle(self);
        InheritSliderLabel(self, "Vih");

        self.init = function() {
            self.knob.rotate(180);
            self.tag = new paper.PointText();
        };

        self.SetX = function(x) {
            return self.x = ClampX(x);
        };
        self.X = function(x) {
            return self.x;
        };

        self.MoveTo = function(x) {
            self.SetX(x);
            var y = PLOT_BOTTOM + SLIDER_BREADTH / 2;
            self.knob.position = new paper.Point(self.x + SLIDER_THICK/2, y);
            self.UpdateLine(x,y);
            var textPadding = SLIDER_THICK + 20;
            self.SetTextLoc(self.x + SLIDER_THICK + textPadding, y)
        };

        self.Volts = function() {
            var v = LOGIC_LEVEL_HI * ((self.X() - PLOT_LEFT) / PLOT_WIDTH);
            return StaticCommon.Clip(v);
        };

        self.SetV = function(v) {
            v = StaticCommon.Clip(v);
            var ratio = v / LOGIC_LEVEL_HI;
            var px = ratio * PLOT_WIDTH;
            self.MoveTo(PLOT_LEFT + px);
        };

        self.UpdateLine = function(x, y) {
            if (self.line != nil) {
                self.line.remove();
            }
            // draw the line
            // measure from the slider loc, the middle of the left side.
            var x1 = self.X() // - SLIDER_THICK / 2;

            var from = new paper.Point(x1, PLOT_BOTTOM);
            var to = new paper.Point(x1, PLOT_TOP);
            self.line = new paper.Path.Line(from, to);
            self.line.strokeColor = 'white';
            self.line.dashArray = [2, 4];
        };

        self.init();
        return self;
    }

    // -----------------------------------------------------------------------------
    function SliderVil(paper) {
        var self = {
            x:0, y:0,
            knob: nil,
            line: nil,
            paper: paper
        };
        InheritSliderStyle(self);
        InheritSliderLabel(self, "Vil");

        self.init = function() {
            // paper js doesn't offer a way to alter the origin within
            // a shape, so its position is at the center of the
            // sprite. Therefore, the shape the reprsents the slider
            // knob
        };

        self.SetX = function(x) {
            return self.x = ClampX(x);
        };
        self.X = function(x) {
            return self.x;
        };

        self.Volts = function() {
            var v = (LOGIC_LEVEL_HI * ((self.X() - PLOT_LEFT) / PLOT_WIDTH));
            return StaticCommon.Clip(v);
        };

        self.SetV = function(v) {
            v = StaticCommon.Clip(v);
            var ratio = v / LOGIC_LEVEL_HI;
            var px = ratio * PLOT_WIDTH;
            self.MoveTo(PLOT_LEFT + px);
        };

        // Adjusted X conpensates for the knob thickness.
        self.AdjX = function() {
            return self.X() - SLIDER_THICK / 2;
        };

        // move the knob to x. the line should be directly on x
        self.MoveTo = function(x) {
            self.SetX(x);
            var y = PLOT_BOTTOM + SLIDER_BREADTH / 2;

            self.knob.position = new paper.Point(self.AdjX(), y);
            self.DrawLine(y);
            self.SetTextLoc(self.AdjX() - self.text.bounds.width, y)
        };

        self.DrawLine = function(y) {
            if (self.line != nil) {
                self.line.remove();
            }
            // draw the line
            var from = new paper.Point(self.X(), PLOT_BOTTOM);
            var to = new paper.Point(self.X(), PLOT_TOP);

            self.line = new paper.Path.Line(from, to);
            self.line.strokeColor = 'white';
            self.line.dashArray = [2, 4];
        };

        self.init();
        return self;
    }

    // -----------------------------------------------------------------------------
    function RandomTransferFunction(paper, plot) {
        var self = {
            path: nil
        };

        self.Update = function(paper, plot) {
            const smidgen = 5;

            // randomPoint on segment (0, voh) -> (0, LOGIC_LEVEL_HI)
            var x1 = PLOT_LEFT;
            var y1 = randomRangeInt(PLOT_TOP, plot.sliderVoh.Y());
            var p1 = new paper.Point(x1, y1);
            // randomPoint on segment (vil, voh) -> (vil, LOGIC_LEVEL_HI)
            var x2 = plot.sliderVil.X();
            var y2 = randomRangeInt(PLOT_TOP, plot.sliderVoh.Y());
            var p2 = new paper.Point(x2, y2);
            // randomPoint on segment (vih, 0) -> (vil, Vol)
            var x3 = plot.sliderVih.X();
            var y3 = randomRangeInt(plot.sliderVol.Y(), PLOT_BOTTOM);
            var p3 = new paper.Point(x3, y3);
            // randomPoint on segment (LOGIC_LEVEL_HI, 0) -> (LOGIC_LEVEL_HI, Vol)
            var x4 = PLOT_RIGHT;
            var y4 = randomRangeInt(plot.sliderVol.Y(), PLOT_BOTTOM);
            var p4 = new paper.Point(x4, y4);

            if (self.path != nil) {
                self.path.remove();
            }
            self.path = new paper.Path.Line(p1, p2);

            // find a couple more points between vil and vih
            // sort them by vi
            var vil = plot.sliderVil.X() + smidgen;
            var vih = plot.sliderVih.X() - smidgen;
            var ps = [];

            // generate some points
            while(coinFlipIsHeads()) {
                var rx = randomRangeInt(vil, vih);
                var ry = randomRangeInt(PLOT_TOP, PLOT_BOTTOM);
                ps.push(new paper.Point(rx, ry));
            }
            ps.sort(function(a, b) {
                return a.x - b.x;
            });
            for (var i in ps) {
                self.path.lineTo(ps[i]);
            }

            self.path.lineTo(p3);
            self.path.lineTo(p4);
            self.path.strokeColor = "BLACK";
            self.path.strokeWidth = 2;
            Popup("Generating random, valid transfer function");
        };

        return self;
    }

    // -----------------------------------------------------------------------------
    function Plot(paper, width, height) {
        var self = {
            width: width,
            height: height,
            scrollBarV: nil,
            scrollBarH: nil,
            background: nil,
            sliderVil: nil, // these
            sliderViH: nil, // should
            sliderVol: nil, // be encapsulated
            sliderVoh: nil, // in the scrollbars.
            diagonalVol: nil,
            diagonalVoh: nil,
            forbiddenL: nil,
            forbiddenR: nil,
            tranferFunc: nil,
            lastActive: nil, // The last active slider.
            noiseMarginObject: nil,
            end:nil
        };
        InheritAdjuster(self);

        self.initBackground = function() {
            var x = PLOT_LEFT;
            var y = PLOT_TOP;
            var p1 = new paper.Point(x, y);
            var p2 = new paper.Point(x+PLOT_WIDTH, y+PLOT_HEIGHT);
            self.path = new paper.Path.Rectangle(p1, p2);
            self.path.fillColor = '#848494';
        };

        self.initSliders = function() {
            self.sliderVil = SliderVil(paper);
            self.sliderVih = SliderVih(paper);
            self.sliderVoh = SliderVoh(paper);
            self.sliderVol = SliderVol(paper);
            // set the values to something

            self.sliderVil.SetV(1.3);
            self.sliderVih.SetV(2.2);
            self.sliderVoh.SetV(4);
            self.sliderVol.SetV(0.2);

            self.scrollBarH = ScrollBarH(paper, PLOT_LEFT, PLOT_BOTTOM);
            self.scrollBarV = ScrollBarV(paper, PLOT_LEFT - SLIDER_BREADTH, PLOT_TOP);

            // refactor. scrollbars should own sliders.
            self.scrollBarV.sliderVol = self.sliderVol;
            self.scrollBarV.sliderVoh = self.sliderVoh;
            self.scrollBarH.sliderVil = self.sliderVil;
            self.scrollBarH.sliderVih = self.sliderVih;
        };

        self.Vol = function() { return self.sliderVol.Volts(); };
        self.Voh = function() { return self.sliderVoh.Volts(); };
        self.Vil = function() { return self.sliderVil.Volts(); };
        self.Vih = function() { return self.sliderVih.Volts(); };

        self.initTranferFunc = function() {
            self.transferFunc = RandomTransferFunction();
        };

        self.UpdateForbiddenL = function() {
            if (self.forbiddenL != nil) {
                self.forbiddenL.remove();
            }
            var top = self.sliderVoh.Y();
            var bot = self.sliderVol.Y();
            var right = self.sliderVil.X() - LINE_THICKNESS;

            var p1 = new paper.Point(PLOT_LEFT, top+1);
            var p2 = new paper.Point(right, bot - LINE_THICKNESS);
            self.forbiddenL = new paper.Path.Rectangle(p1, p2);
            self.forbiddenL.fillColor = StaticCommon.COLOR_OF_FORBIDDEN;
        };

        self.UpdateForbiddenR = function() {
            if (self.forbiddenR != nil) {
                self.forbiddenR.remove();
            }
            var top = self.sliderVoh.Y();
            var bot = self.sliderVol.Y();
            var left = self.sliderVih.X() + LINE_THICKNESS;
            var right = PLOT_RIGHT;

            var p1 = new paper.Point(left, top);
            var p2 = new paper.Point(right, bot - LINE_THICKNESS);
            self.forbiddenR = new paper.Path.Rectangle(p1, p2);
            self.forbiddenR.fillColor = StaticCommon.COLOR_OF_FORBIDDEN;
        };

        self.UpdateForbidden = function() {
            self.UpdateForbiddenL();
            self.UpdateForbiddenR();
        };

        self.SlidersAdjusted = function() {
            var adj = self.scrollBarH.Adjusted() || self.scrollBarV.Adjusted();
            self.scrollBarV.MakeClean();
            self.scrollBarH.MakeClean();
            return adj;
        };

        self.UpdateLastActiveSlider = function() {
            if (self.sliderVil.IsHighlighted()) {
                self.lastActiveSlider = "Vil";
            }
            if (self.sliderVol.IsHighlighted()) {
                self.lastActiveSlider = "Vol";
            }
            if (self.sliderVih.IsHighlighted()) {
                self.lastActiveSlider = "Vih";
            }
            if (self.sliderVoh.IsHighlighted()) {
                self.lastActiveSlider = "Voh";
            }
        };

        self.UpdateSliders = function() {
            self.UpdateLastActiveSlider();
            // ok, so this is involved, but not complicated.  the static
            // discipline enforces some constraints.
            // vol < vil < vih < voh;

            var nudge = 0.01; // volts
            if (self.lastActiveSlider == "Vol") {
                // !vol! < vil < vih < voh;
                if (!(self.Vol() <= self.Vil())) {
                    self.sliderVil.SetV(self.Vol() + nudge);
                }
                if (!(self.Vil() <= self.Vih())) {
                    self.sliderVih.SetV(self.Vil() + nudge);
                }
                if (!(self.Vih() <= self.Voh())) {
                    self.sliderVoh.SetV(self.Vih() + nudge);
                }
            }

            if (self.lastActiveSlider == "Vil") {
                // vol < !vil! < vih < voh;
                if (!(self.Vol() <= self.Vil())) {
                    self.sliderVol.SetV(self.Vil() - nudge);
                }
                // vil < vih, is covered by the UI mechanics.
                if (!(self.Vih() <= self.Voh())) {
                    // this is may be dead code.
                    self.sliderVoh.SetV(self.Vih() + nudge);
                }
            }

            if (self.lastActiveSlider == "Vih") {
                // vol < vil < !vih! < voh;
                // constraint: vih < voh
                if (!(self.Vih() <= self.Voh())) {
                    // vih pushes voh higher.
                    self.sliderVoh.SetV(self.Vih() + nudge);
                }
                // constraint: vil < vih is covereed by the UI.
                // constraint: vol < vil
                if (!(self.Vol() < self.Vil())) {
                    // vil pushes vol lower, this may be dead code.
                    self.sliderVol.SetV(self.Vil() - nudge);
                }
            }

            if (self.lastActiveSlider == "Voh") {
                // vol < vil < vih < !voh!;
                if (!(self.Vih() <= self.Voh())) {
                    // move vih lower
                    self.sliderVih.SetV(self.Voh() - nudge);
                }
                if (!(self.Vil() <= self.Vih())) {
                    // there was a cascade, move vil lower.
                    self.sliderVil.SetV(self.Vih() - nudge);
                }
                if (!(self.Vol() <= self.Vil())) {
                    // there was a cascade, move vol lower.
                    self.sliderVol.SetV(self.Vil() - nudge);
                }
            }

            // update the noise margin parameters
            if (self.noiseMarginObject != nil) {
                self.noiseMarginObject.SetVil(self.Vil());
                self.noiseMarginObject.SetVih(self.Vih());
                self.noiseMarginObject.SetVol(self.Vol());
                self.noiseMarginObject.SetVoh(self.Voh());
            }
        };

        self.WireMargin = function(margin) {
            // Wire in the noise margin element after initing.  This
            // design is sub optimal.
            self.noiseMarginObject = margin;
        };

        self.UpdateTransfer = function() {
            self.transferFunc.Update(paper, self);
        };

        self.initBackground();
        self.initSliders();
        self.initTranferFunc();
        return self;
    }

    // -----------------------------------------------------------------------------
    function init(top) {
        // This should be refactored into a 4th manager class that
        // controls the three elements, Plot, Schematic and Noise
        
        var canvas = document.getElementById('myCanvas');
        paper.setup(canvas);

        const leftOfColumn2 = 550;
        
        var plot = Plot(paper, 1100, 600);

        // gapSize is the space between inverters
        var gapSize = 400;
        var margin = NoiseMargin(200, leftOfColumn2, gapSize, 125);
        plot.WireMargin(margin); 

        var scm = Schematic(top, leftOfColumn2, gapSize, 100);

        var tickTock = function() {
            margin.ToggleDigitalIn();
            scm.Toggle();
            setTimeout(tickTock, 1000);
        };
        tickTock();
        
        paper.view.onFrame = function(event) {
            plot.UpdateForbidden();
            plot.UpdateSliders();

            if (plot.SlidersAdjusted()) {
                plot.UpdateTransfer();
            }

            paper.view.draw();
        };
        plot.UpdateTransfer();

        return plot;
    }
    return init(top);
}

// Noise Margin
function NoiseMargin(top, left, width, height) {
    // There is a left and right inverter. Between them is a dataline
    // that has a noise visualization.  At the input terminal of the
    // left inverter there is a digital 1 or 0, likewise for the
    // output for the right inverter.

    // The right inverter is equipped with the static discipline
    // values Vil, Vih, Vol, Voh that demonstrate how the noise margin
    // is derived.

    // After initing, this apparatus doesn't change geometry, however
    // there are moving parts.  The dataline accumulates noise over
    // its length from left to right in accordance to the static
    // discipline.  Also, the Vil, Vih, Vol, Voh indicators move and
    // are controlled from the API, therefore the following public
    // methods will be needed.

    // SetVil(volts)
    // SetVih(volts)
    // SetVol(volts)
    // SetVoh(volts)

    // SetDigitalIn(b :: bool), this will take care of changing the
    // dataline value ~b, and output value of right inverter ~~b.

    // UpdateFrame() will generate noise for the dataLine.

    const LOGIC_LEVEL_LO = StaticCommon.LOGIC_LEVEL_LO;
    const LOGIC_LEVEL_HI = StaticCommon.LOGIC_LEVEL_HI;
    const TOP = top;
    const WIDTH = width;
    const LEFT = left;
    const RIGHT = LEFT + WIDTH;
    const HEIGHT = height;
    const BOTTOM = TOP + HEIGHT;
    const GAPSIZE = 30; // the gap between parts

    // device parameters
    const WIDTH_OF_FORBIDDEN = 30;

    // properties of the inverter device.
    const DEVICE_WIDTH = 120;
    const DEVICE_HEIGHT = HEIGHT;

    function ConvertVoltsToPxY(v) {
        // convert volts to pixels as measured from the bottom of the
        // device boxes.  The bottom of the device box corresponds to
        // LOGIC_LEVEL_LO=0 volts, while the top of corresponds to
        // LOGIC_LEVEL_HI=5 volts.  The only hitch is that screen
        // coordinates have an origin 0,0 in the top-left, so we need
        // to flippit.
        const pixelsPerVolt = HEIGHT / (LOGIC_LEVEL_HI - LOGIC_LEVEL_LO);
        v = StaticCommon.Clip(v); //
        const numPixels = v * pixelsPerVolt;
        return BOTTOM - numPixels;
    }

    function SkinnyBox(left, top, bottom) {
        var p1 = new paper.Point(left, top);
        var p2 = new paper.Point(left + WIDTH_OF_FORBIDDEN, bottom);
        var box = new paper.Path.Rectangle(p1, p2);
        box.fillColor = StaticCommon.COLOR_OF_FORBIDDEN;
        return box;
    }

    function InheritSliderLabel(self, txt) {
        self.labelTxt = txt;
        self.text = new paper.PointText(new paper.Point(50, 50));
        self.text.fillColor = 'black';
        self.text.content = txt;
        self.text.fontFamily = "courier";
        self.text.fontSize = 16;

        self.SetTextX = function(x) { self.text.position.x = x; };
        self.SetTextY = function(y) { self.text.position.y = y; };
        self.TextHeight = function() {
            return self.text.bounds.height;
        };
        self.TextWidth = function() {
            return self.text.bounds.width;
        };
        self.SetTextContent = function(txt) {
            self.text.content = txt;
        };
        self.SetTextLoc = function(x, y) {
            self.SetTextX(x); self.SetTextY(y);
        };
    }

    function Inverter(left) {
        var self = {
            deviceBox: nil,
            forbInBox: nil,
            forbOutBox: nil,
            vilText: nil,
            vihText: nil,
            left: left,
            right: left + DEVICE_WIDTH,
            top: TOP,
            vilPx: BOTTOM, // These
            vihPx: TOP,    // are
            volPx: BOTTOM, // arbitarty
            vohPx: TOP,    // values to start with.
            bottom: BOTTOM
        };

        self.init = function() {
            var p1 = new paper.Point(self.left, self.top);
            var p2 = new paper.Point(self.right, self.bottom);
            self.deviceBox = new paper.Path.Rectangle(p1, p2);
            self.deviceBox.fillColor = "lightgray";
            self.replaceForbiddenBoxes();
            return self;
        };

        self.replaceForbiddenBoxes = function() {
            if (self.forbInBox != nil && self.forbInBox != nil) {
                self.forbInBox.remove();
                self.forbOutBox.remove();
            }
            self.forbInBox = SkinnyBox(self.left, self.vihPx, self.vilPx);
            self.forbOutBox = SkinnyBox(self.right-WIDTH_OF_FORBIDDEN,
                                        self.vohPx, self.volPx);
        };

        self.SetVil = function(v) {
            self.vilPx = ConvertVoltsToPxY(v);
            self.replaceForbiddenBoxes();
        };

        self.SetVih = function(v) {
            self.vihPx = ConvertVoltsToPxY(v);
            self.replaceForbiddenBoxes();
        };

        self.SetVol = function(v) {
            self.volPx = ConvertVoltsToPxY(v);
            self.replaceForbiddenBoxes();
        };

        self.SetVoh = function(v) {
            self.vohPx = ConvertVoltsToPxY(v);
            self.replaceForbiddenBoxes();
        };
        return self.init();
    }

    function InverterLine(x, txt) {
        var self = {
            labelTxt: txt,
            x: x, // px
            y: ConvertVoltsToPxY(0),
            volts: 0,
            line: nil,
            length: 0
        };
        InheritSliderLabel(self, txt);

        self.SetV = function(v) {
            self.volts = v;
            self.y = ConvertVoltsToPxY(v);
            self.moveLine();
        };

        self.init = function() {
            self.length = RIGHT - x + GAPSIZE;
            self.moveLine();
            return self;
        };

        self.Tip = function() {
            // get the end tip of the line
            var x = self.line.bounds.right;
            var y = self.line.bounds.top;
            return new paper.Point(x, y);
        };

        self.HideLine = function() {
            self.line.opacity = 0;
        };

        self.SetLabelTxtToVolts = function() {
            self.labelTxt.content = self.volts;
        };

        self.moveLine = function() {
            if (self.line != nil) {
                self.line.remove();
            }
            var from = new paper.Point(self.x, self.y);
            var to = new paper.Point(self.x+self.length, self.y);
            self.line = self.line = new paper.Path.Line(from, to);
            self.line.strokeColor = 'black';
            self.line.strokeWidth =0.5;
            self.line.dashArray = [1, 1];
            self.AdjustTextLoc();
        };

        self.AdjustTextLoc = function() {
            if (self.labelTxt === "Vil") {
                self.SetTextLoc(self.x + self.TextWidth()/2,
                                self.y + self.TextHeight()/2);
            }
            if (self.labelTxt === "Vol") {
                self.SetTextLoc(self.x + self.TextWidth()/2,
                                self.y + self.TextHeight()/2);

            }
            if (self.labelTxt === "Vih") {
                self.SetTextLoc(self.x + self.TextWidth()/2,
                                self.y - self.TextHeight()/2);
            }
            if (self.labelTxt === "Voh") {
                self.SetTextLoc(self.x + self.TextWidth()/2,
                                self.y - self.TextHeight()/2);
            }
        };

        return self.init();
    }

    // -----------------------------------------------------------------------------
    // the number of samples in a noise line.
    const NUM_NOISE_STEPS = 35;
    
    function BottomNoiseLine(vol, vil, tolerance, path) {
        var self = {
            path: nil,
            vol: vol,
            vil: vil
        };

        self.init = function() {
            var deltaY = ConvertVoltsToPxY(vol+tolerance) - ConvertVoltsToPxY(vol);
            var deltaX = RIGHT - LEFT - (2 * DEVICE_WIDTH);
            var slope = deltaY / deltaX;
            var numSteps = NUM_NOISE_STEPS;
            var dx = deltaX / numSteps;

            if (path == nil) {
                self.allocate();
            } else {
                self.path = path;
            }
            
            for (var step = 0; step <= numSteps; step++) {
                var x = LEFT + DEVICE_WIDTH + step * dx;
                var y = randomRangeInt(BOTTOM,
                                       slope * step * dx + ConvertVoltsToPxY(vol));
                self.path._segments[step]._point._x = x;
                self.path._segments[step]._point._y = y;
                
            }
            return self;
        };

        self.allocate = function() {
            console.log("Allocating BottomNoiseLine");
            var segments = [];
            var numSteps = NUM_NOISE_STEPS;
            for (var step = 0; step <= numSteps; step++) {
                var p = new paper.Point(0,0);
                segments.push(p);
            }
            self.path = new paper.Path(segments);
            self.path.strokeColor = "black";
            self.path.strokeWidth =0.5;
        };
        
        self.Hide = function() { self.path.strokeWidth = 0.0; };
        self.Show = function() { self.path.strokeWidth = 0.5; };

        return self.init();
    }

    function TopNoiseLine(voh, vih, tolerance, path) {
        // this is
        var self = {
            path: nil,
            voh: voh,
            vih: vih
        };

        self.init = function() {
            var deltaY = ConvertVoltsToPxY(vih-tolerance) - ConvertVoltsToPxY(vih);
            var deltaX = RIGHT - LEFT - (2 * DEVICE_WIDTH);
            var slope = deltaY / deltaX;
            var numSteps = NUM_NOISE_STEPS;
            var dx = deltaX / numSteps;

            if (path == nil) {
                self.allocate();
            } else {
                self.path = path;
            }

            for (var step = 0; step <= numSteps; step++) {
                var x = LEFT + DEVICE_WIDTH + step * dx;
                var y = randomRangeInt(TOP,
                                       slope * step * dx + ConvertVoltsToPxY(voh));
                self.path._segments[step]._point._x = x;
                self.path._segments[step]._point._y = y;
            }
            return self;
        };

        self.allocate = function() {
            console.log("Allocating TopNoiseLine");
            var segments = [];
            var numSteps = NUM_NOISE_STEPS;
            for (var step = 0; step <= numSteps; step++) {
                var p = new paper.Point(0,0);
                segments.push(p);
            }
            self.path = new paper.Path(segments);
            self.path.strokeColor = "black";
            self.path.strokeWidth =0.5;
        };

        self.Hide = function() { self.path.strokeWidth = 0.0; };
        self.Show = function() { self.path.strokeWidth = 0.5; };

        return self.init();
    }

    function Envelope() {
        // A rough boundary for typical noise
        // This is represented by two lines, one from VOH on left
        // inverter to VIH on the right inverter and another from VOL
        // on the left inverter to VIL on the right inverter. It also
        // serves as a visual guard indicating the linear nature of
        // how noise grows on data lines as a function of distance.

        // That is a bit misleading, an onslaught of noise out of the
        // gate is possible and allowed.
        var self = {
            topLine: nil,
            botLine: nil,
            vil:0, vol:0, vih:0, voh:0
        };

        self.init = function() {
            return self;
        };

        self.makeLine = function(from, to) {
            var line = new paper.Path.Line(from, to);
            line.strokeColor = 'grey';
            line.strokeWidth =0.5;
            line.dashArray = [2, 10];
            return line;
        };

        self.makeLines = function() {
            // top line
            if (self.topLine != nil) {
                self.topLine.remove();
            }
            var y1 = ConvertVoltsToPxY(self.voh);
            var y2 = ConvertVoltsToPxY(self.vih);
            var from = new paper.Point(LEFT + DEVICE_WIDTH, y1);
            var to = new paper.Point(RIGHT - DEVICE_WIDTH, y2);
            self.topLine = self.makeLine(from, to);

            // bottom line
            if (self.botLine != nil) {
                self.botLine.remove();
            }
            var y1 = ConvertVoltsToPxY(self.vol);
            var y2 = ConvertVoltsToPxY(self.vil);
            var from = new paper.Point(LEFT + DEVICE_WIDTH, y1);
            var to = new paper.Point(RIGHT - DEVICE_WIDTH, y2);
            self.botLine = self.makeLine(from, to);


        };
        self.SetVil = function(v) {
            self.vil = v;
            self.makeLines();
        };
        self.SetVih = function(v) {
            self.vih = v;
            self.vihPx = ConvertVoltsToPxY(v);
        };
        self.SetVol = function(v) {
            self.vol = v;
            self.volPx = ConvertVoltsToPxY(v);
        };
        self.SetVoh = function(v) {
            self.voh = v;
            self.vohPx = ConvertVoltsToPxY(v);
        };

        return self.init();
    };

    function MarginArrow(from, to, margin) {
        var self = {
            path: nil,
            text: nil,
            volts: nil
        };

        self.init = function() {
            self.path = new paper.Path.Line(from, to);
            self.path.strokeColor = "lightgreen";
            self.path.strokeWidth = 5;
            margin = margin.toFixed(2);

            var mid = (from.y + to.y) / 2;
            var nudge = 4;
            var p = new paper.Point(from.x + nudge, mid);
            self.text = new paper.PointText(p);
            self.text.fillColor = 'black';
            self.text.content = "noise tol.";
            self.text.fontFamily = "courier";
            self.text.fontSize = 16;
            self.text.position.y -= self.text.bounds.height/4;

            var p = new paper.Point(from.x + nudge, mid);
            self.volts = new paper.PointText(p);
            self.volts.fillColor = 'black';
            self.volts.content = margin + "V";
            self.volts.fontFamily = "courier";
            self.volts.fontSize = 16;
            self.volts.position.y += self.volts.bounds.height/2;

            return self;
        };
        self.Remove = function() {
            if (self.path != nil) {
                self.path.remove();
            }
            if (self.text != nil) {
                self.text.remove();
            }
            if (self.volts != nil) {
                self.volts.remove();
            }

        };
        return self.init();
    }

    function Triangle(p1, p2, p3, color) {
        // put a green triangle under the noise tolerance region.
        var self = {
            path: nil,
        };
        self.init = function() {
            self.path = new paper.Path();
            self.path.add(p1);
            self.path.add(p2);
            self.path.add(p3);
            self.path.fillColor = color;
            self.path.opacity =0.25;
            return self;
        };
        self.Remove = function() {
            if (self.path != nil) {
                self.path.remove();
            }
        };

        return self.init();
    }

    function Parts() {
        var self = {
            vil:0, vol:0, vih: 0, voh:0,
            inverterL: nil,
            inverterR: nil,
            dataLine: nil,
            lineVol: nil,
            lineVil: nil,
            lineVih: nil,
            lineVoh: nil,
            leftVol: nil,
            leftVil: nil,
            leftVih: nil,
            leftVoh: nil,
            envelope: nil,
            topNoiseLine: nil,
            botNoiseLine: nil,
            marginArrow: nil,
            digitalIn: false,
            greenTriTop: nil,
            greenTriBottom: nil
        };

        self.init = function() {
            // create
            self.inverterL = Inverter(LEFT);
            self.inverterR = Inverter(RIGHT - DEVICE_WIDTH);
            self.lineVil = InverterLine(RIGHT - DEVICE_WIDTH, "Vil");
            self.lineVih = InverterLine(RIGHT - DEVICE_WIDTH, "Vih");
            self.lineVol = InverterLine(RIGHT - GAPSIZE, "Vol");
            self.lineVoh = InverterLine(RIGHT - GAPSIZE, "Voh");
            self.leftVil = InverterLine(LEFT, "Vil");
            self.leftVih = InverterLine(LEFT, "Vih");
            self.leftVol = InverterLine(LEFT + DEVICE_WIDTH - WIDTH_OF_FORBIDDEN, "Vol");
            self.leftVoh = InverterLine(LEFT + DEVICE_WIDTH - WIDTH_OF_FORBIDDEN, "Voh");
            self.envelope = Envelope();
            self.topNoise = nil;
            self.botNoise = nil;
            return self;
        };

        self.UpdateFrame = function() {
            self.UpdateGreenTriangle();
            self.UpdateNoise();
            self.UpdateArrow();
        };

        self.MarginTop = function() {
            return self.voh - self.vih;
        };
        self.MarginBottom = function() {
            return self.vil - self.vol;
        };

        self.Tolerance = function() {
            if (self.TopMarginIsTolerance()) {
                return self.MarginTop();
            }
            return self.MarginBottom();
        };

        self.UpdateGreenTriangle = function() {
            if (self.greenTriTop != nil) {
                self.greenTriTop.Remove();
            }
            if (self.greenTriBottom != nil) {
                self.greenTriBottom.Remove();
            }
            if (self.TopMarginIsTolerance()) {
                var x1 = self.envelope.topLine.bounds.x;
                var x2 = x1 + self.envelope.topLine.bounds.width;
                var y1 = self.envelope.topLine.bounds.y;
                var y2 = y1 + self.envelope.topLine.bounds.height;
                var marginY = y2-y1;

                var p1 = new paper.Point(x1, y1);
                var p2 = new paper.Point(x2, y2);
                var p3 = new paper.Point(x2, y1);
                self.greenTriTop = Triangle(p1, p2, p3, "lightgreen");

                x1 = self.envelope.botLine.bounds.x;
                x2 = x1 + self.envelope.botLine.bounds.width;
                y1 = self.envelope.botLine.bounds.y;
                y2 = y1 + self.envelope.botLine.bounds.height;

                p1 = new paper.Point(x1, y2);
                p2 = new paper.Point(x2, y2-marginY);
                p3 = new paper.Point(x2, y2);
                self.greenTriBottom = Triangle(p1, p2, p3, "lightgreen");
            } else {
                // Bottom margin is the noise tolerance.
                // bottom triangle
                var x1 = self.envelope.botLine.bounds.x;
                var x2 = x1 + self.envelope.botLine.bounds.width;
                var y1 = self.envelope.botLine.bounds.y;
                var y2 = y1 + self.envelope.botLine.bounds.height;
                var marginY = y1 - y2;

                var p1 = new paper.Point(x1, y2);
                var p2 = new paper.Point(x2, y1);
                var p3 = new paper.Point(x2, y2);
                self.greenTriBottom = Triangle(p1, p2, p3, "lightgreen");
                // top triangle
                x1 = self.envelope.topLine.bounds.x;
                x2 = x1 + self.envelope.topLine.bounds.width;
                y1 = self.envelope.topLine.bounds.y;
                y2 = y1 + self.envelope.topLine.bounds.height;

                p1 = new paper.Point(x1, y1);
                p2 = new paper.Point(x2, y1 - marginY);
                p3 = new paper.Point(x2, y1);
                self.greenTriTop = Triangle(p1, p2, p3, "lightgreen");
            }
        };

        self.TopMarginIsTolerance = function() {
            return self.MarginTop() <= self.MarginBottom();
        };

        self.UpdateArrow = function() {
            var marginTop = self.voh - self.vih;
            var marginBot = self.vil - self.vol;

            if (self.marginArrow != nil) {
                // cleanup
                self.marginArrow.Remove();
            }

            if (marginTop <= marginBot) {
                // now the top noise margin is THE noise margin
                self.marginArrow = MarginArrow(self.lineVih.Tip(),
                                               self.lineVoh.Tip(),
                                               marginTop
                                              );
            } else {
                // now the bottom noise margin is THE noise margin
                self.marginArrow = MarginArrow(self.lineVol.Tip(),
                                               self.lineVil.Tip(),
                                               marginBot
                                              );
            }
        };

        self.UpdateNoise = function() {            
            if (self.topNoise == nil) {
                self.topNoise = TopNoiseLine(self.voh, self.vih, self.Tolerance(), nil);
            }
            if (self.botNoise == nil) {
                self.botNoise = BottomNoiseLine(self.vol, self.vil, self.Tolerance(), nil);
            }
            
            if (self.digitalIn == true) {
                self.topNoise = TopNoiseLine(self.voh, self.vih, self.Tolerance(), self.topNoise.path);
                self.topNoise.Show();
                self.botNoise.Hide();
            } else {
                self.botNoise = BottomNoiseLine(self.vol, self.vil, self.Tolerance(), self.botNoise.path);
                self.topNoise.Hide();
                self.botNoise.Show();
            }
        };

        self.fixupLeftInverterIndicators = function(indicator, v) {
            indicator.SetV(v);
            indicator.SetTextContent(v.toFixed(1));
            indicator.HideLine();
        };

        self.SetVil = function(v) {
            self.vil = v;
            // self.inverterL0...
            self.inverterL.SetVil(v);
            self.inverterR.SetVil(v);
            self.lineVil.SetV(v);
            self.fixupLeftInverterIndicators(self.leftVil, v);
            self.envelope.SetVil(v);
            self.UpdateFrame();
        };
        self.SetVih = function(v) {
            self.vih = v;
            self.inverterL.SetVih(v);
            self.inverterR.SetVih(v);
            self.lineVih.SetV(v);
            self.fixupLeftInverterIndicators(self.leftVih, v);
            self.envelope.SetVih(v);
            self.UpdateFrame();
        };
        self.SetVol = function(v) {
            self.vol = v;
            self.inverterL.SetVol(v);
            self.inverterR.SetVol(v);
            self.lineVol.SetV(v);
            self.fixupLeftInverterIndicators(self.leftVol, v);
            self.envelope.SetVol(v);
            self.UpdateFrame();
        };
        self.SetVoh = function(v) {
            self.voh = v;
            self.inverterL.SetVoh(v);
            self.inverterR.SetVoh(v);
            self.lineVoh.SetV(v);
            self.fixupLeftInverterIndicators(self.leftVoh, v);
            self.envelope.SetVoh(v);
            self.UpdateFrame();
        };

        self.ToggleDigitalIn = function() {
            self.digitalIn = !self.digitalIn;
        };

        return self.init();
    }


    return Parts();
}

// Schematic dichotomy
function Schematic(top, left, width, height) {
    const TOP = top;
    const LEFT = left;
    const WIDTH = width;
    const RIGHT = left + width;
    const HEIGHT = height;
    const BOTTOM = top + height;

    const DEVICE_WIDTH = 120;
    const DEVICE_HEIGHT = 120;

    function Inverter(x, y) {
        const svgString = "M 0 979.625 L 0 988.71875 L 0 1052.375 L 54.53125 1016 L 0 979.625 z M 54.53125 1016 C 54.53125 1019.0125 56.987538 1021.4375 60 1021.4375 C 63.012462 1021.4375 65.46875 1019.0125 65.46875 1016 C 65.46875 1012.9875 63.012462 1010.5312 60 1010.5312 C 56.987538 1010.5312 54.53125 1012.9875 54.53125 1016 z ";

        var self = {
            x: x, y: y,
            nudgeX: 65, // these are hard coded values that serve to center
            nudgeY: 60, // the inverter icon in the box, they should not change.
            box: nil,
            icon: nil
        };

        self.init = function() {
            var p1 = new paper.Point(x, y);
            var p2 = new paper.Point(x + DEVICE_WIDTH,
                                     y + DEVICE_HEIGHT);
            self.deviceBox = new paper.Path.Rectangle(p1, p2);
            self.deviceBox.fillColor = "lightgray";

            self.icon = new paper.Path(svgString);
            self.icon.position = new paper.Point(x + self.nudgeX, y + self.nudgeY);
            self.icon.strokeColor = 'black';
            self.icon.fillColor = 'white';
            self.icon.strokeWidth = 3;
            return self;
        };

        self.LeftSide = function() {
            const nudge = 2;
            return self.x + self.icon.bounds.width/2 - nudge;
        };

        self.RightSide = function() {
            const nudge = 3;
            return self.LeftSide() + self.icon.bounds.width + nudge;
        };

        return self.init();
    }

    function LineGroup() {
        var self = {
            lineL: nil,
            lineM: nil,
            lineR: nil,
            toggleFlag: false
        };

        self.init = function() {
            return self;
        };

        self.drawLine = function(x1, x2) {
            const lineWidth = 2;
            var mid = TOP + DEVICE_HEIGHT/2 + lineWidth/2 - 1;
            var from = new paper.Point(x1, mid);
            var to = new paper.Point(x2, mid);
            var line = new paper.Path.Line(from, to);
            line.strokeWidth = 2;
            line.strokeColor = new paper.Color(0,0,0);
            return line;
        };

        self.drawLines = function(invL, invR) {
            self.lineL = self.drawLine(invL.LeftSide() - DEVICE_WIDTH/2,
                                       invL.LeftSide());            
            self.lineM = self.drawLine(invL.RightSide(), invR.LeftSide());
            self.lineR = self.drawLine(invR.RightSide(),
                                       invR.RightSide() + DEVICE_WIDTH/2);
            self.Toggle();
        };

        self.Toggle = function() {            
            if (self.toggleFlag) {
                self.lineL.dashArray = [5, 5];
                self.lineM.dashArray = [];
                self.lineR.dashArray = [5, 5];
            } else {
                self.lineL.dashArray = [];
                self.lineM.dashArray = [5, 5];
                self.lineR.dashArray = [];
            }
            self.toggleFlag = !self.toggleFlag;
        };

        return self.init();
    }


    function Parts() {
        var self = {
            invLeft: Inverter(LEFT, TOP),
            invRight: Inverter(RIGHT - DEVICE_WIDTH, TOP),
            lineGroup: LineGroup()
        };
 
        self.init = function() {
            self.lineGroup.drawLines(self.invLeft, self.invRight);
            return self;
        };

        self.Toggle = function() {
            self.lineGroup.Toggle();
        };

        return self.init();
    }

    return Parts();
}

// -----------------------------------------------------------------------------
window.onload = function() {
    var plot = TransferPlot(20, 75, 400);
};

// -----------------------------------------------------------------------------
// helper functions
function randomRangeInt(a, b) {
    var delta = b - a;
    var r = Math.floor(Math.random() * delta);
    return a + r;
}

function coinFlipIsHeads() {
    return Math.random() > 0.5;
}
