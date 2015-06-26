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

// FILE: Plot of the transfer function containing the user controls
function TransferPlot(top, left) {
	const LOGIC_LEVEL_LO = StaticCommon.LOGIC_LEVEL_LO;
	const LOGIC_LEVEL_HI = StaticCommon.LOGIC_LEVEL_HI;
	var PLOT_TOP = top; // 50
	var PLOT_LEFT = left; // 50
	var PLOT_WIDTH = 500;
	var PLOT_HEIGHT = 500;
	const PLOT_RIGHT = PLOT_LEFT + PLOT_WIDTH; //630;
	const PLOT_BOTTOM = PLOT_TOP + PLOT_HEIGHT;
	
	// slider thickness and breadth is hard coded in the svg string.
	const SLIDER_THICK = 10;
	const SLIDER_BREADTH = 30;
	const ACTIVE_SLIDER_COLOR = "blue";
	
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
		};

		self.UnHighlight = function() {
			self.knob.fillColor = 'black';
			self.line.strokeColor = 'lightgray';
			self._highlighted = false;
		};

		self.IsHighlighted = function() {
			return self._highlighted;
		};
	};

	// -----------------------------------------------------------------------------
	function InheritSliderLabel(self, txt) {
		//self.label = new paper.
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
	}
	
	// -----------------------------------------------------------------------------
	function ScrollBarV(paper, left, top) {
		var self = {
			path: nil,
			sliderVol: nil,
			sliderVoh: nil,
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
			self.path.opacity = .3;

			self.BackgroundOpacity = function(n) {
				self.path.opacity = n;				
			};
			// setup the event callbacks.
			self.path.on('mouseleave', function() {
				// deselect bots sliders.
				self.sliderVol.UnHighlight();
				self.sliderVoh.UnHighlight();
				self.BackgroundOpacity(.3)
			});
			
			self.path.on('mousedrag', function(evt) {
				// mark dirty
				self.MakeDirty()
				
				// move the closest slider to this mouse position.
				var y = evt.point.y;
				var slider = self.ClosestSlider(y)[0];

				// don't drag a slider if the cursor is out of range.
				if (y > left && y < PLOT_BOTTOM - SLIDER_THICK) {
					slider.MoveTo(PLOT_BOTTOM + SLIDER_THICK - y);
				}
			});
			
			self.path.on('mouseup', function(evt) {
			});

			self.path.on('mouseenter', function(evt) {
				self.BackgroundOpacity(.2);
			});
			
			self.path.on('mousemove', function(evt) {
				// Highlight the closest slider.
				var y = evt.point.y;
				var pair = self.ClosestSlider(y);
				pair[0].Highlight();
				pair[1].UnHighlight();
			});
			
			self.path.on('mousedown', function(evt) {
				// move the closest slider to this mouse position.
				var y = evt.point.y;
				var pair = self.ClosestSlider(y);
				pair[0].MoveTo(PLOT_BOTTOM+SLIDER_THICK-y);
				self.MakeDirty();
			});    
			return self;
		};

		return self.init();
	}
	
	// -----------------------------------------------------------------------------
	function ScrollBarH(paper, left, top) {
		var self = {
			path: nil,
			sliderVil: nil,
			sliderVih: nil,
		};
		InheritAdjuster(self)
		
		self.init = function() {
			// setup the path.
			var x = left;
			var y = top;
			var p1 = new paper.Point(x, y);
			var p2 = new paper.Point(x + PLOT_RIGHT - PLOT_LEFT,
									 y + SLIDER_BREADTH); 
			self.path = new paper.Path.Rectangle(p1, p2);
			self.path.fillColor = '#b3b3b3';
			self.path.opacity = .3;
			
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
			return self.x = x
		};  
		self.X = function(x) {
			return self.x
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
			// paper js doesn't offer a way to alter the origin with
			// in a shape, so its position defined at the center of
			// the sprite. Therefore, the shape the reprsents the slider knob
			
		};

		self.SetX = function(x) {
			return self.x = x
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
			self.MoveTo(px);
		};

		// Adjusted X conpensates for the knob thickness.
		self.AdjX = function() {
			return self.X() - SLIDER_THICK / 2;
		}
		
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
			return LOGIC_LEVEL_HI * (self.Y() / (PLOT_BOTTOM - PLOT_TOP))
		};

		self.SetY = function(y) {
			return self.y = PLOT_BOTTOM - y;
		};  
		self.Y = function() {
			return self.y + SLIDER_THICK / 2; 
		};

		self.Volts = function() {
			var v = LOGIC_LEVEL_HI * ((PLOT_BOTTOM - self.Y()) / PLOT_HEIGHT);
			return StaticCommon.Clip(v);
		};

		self.SetV = function(v) {
			v = StaticCommon.Clip(v);
			var ratio = v / LOGIC_LEVEL_HI;
			var py = ratio * PLOT_HEIGHT;
			self.MoveTo(py);
		};
		
		self.MoveTo = function(y) {        
			self.SetY(y);
			self.knob.position = new paper.Point(self.x, self.y);
			// draw the line
			self.UpdateLine(y);
			var nudge = 5;
			self.SetTextLoc(self.x - SLIDER_BREADTH - nudge, self.Y() - nudge)
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
		InheritSliderLabel(self, "Vol")
		
		self.init = function() {
			self.knob.rotate(-90);
		};

		self.SetY = function(y) {
			return self.y = PLOT_BOTTOM + SLIDER_THICK - y;
		};
		
		self.Y = function() {
			return self.y - SLIDER_THICK / 2;
		};
		
		self.Volts = function() {
			var v = LOGIC_LEVEL_HI * ((PLOT_BOTTOM - self.Y()) / PLOT_HEIGHT);
			return StaticCommon.Clip(v);
		};
		
		self.SetV = function(v) {
			v = StaticCommon.Clip(v);
			var ratio = v / LOGIC_LEVEL_HI;
			var px = ratio * PLOT_HEIGHT;
			self.MoveTo(SLIDER_THICK + px );
		};

		self.MoveTo = function(y) {
			y -= SLIDER_THICK / 2;
			self.SetY(y);
			self.knob.position = new paper.Point(self.x, self.y);
			// draw the line
			self.UpdateLine(y);
			var nudge = 5;
			self.SetTextLoc(self.x - SLIDER_BREADTH - nudge, self.Y() + nudge)
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
			var x2 = plot.sliderVil.X() + smidgen;
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
			sliderVil: nil,
			sliderViH: nil,
			sliderVol: nil,
			sliderVoh: nil,
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
			self.sliderVil.MoveTo(100);
			self.sliderVih.MoveTo(200);
			self.sliderVoh.MoveTo(300);
			self.sliderVol.MoveTo(100);
			
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
			var right = self.sliderVil.X() - 1;
			
			var p1 = new paper.Point(PLOT_LEFT, top+1); 
			var p2 = new paper.Point(right, bot-1);
			self.forbiddenL = new paper.Path.Rectangle(p1, p2);
			self.forbiddenL.fillColor = '#743d3d';
		};

		self.UpdateForbiddenR = function() {
			if (self.forbiddenR != nil) {
				self.forbiddenR.remove();
			}
			var top = self.sliderVoh.Y();
			var bot = self.sliderVol.Y();
			var left = self.sliderVih.X() + 1;
			var right = PLOT_RIGHT; 
			
			var p1 = new paper.Point(left, top+1);
			var p2 = new paper.Point(right, bot-1);
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
			// discipline enforces some invarients.
			// vol < vil < vih < voh;
			//console.log([self.Vol(), self.Voh()])
			
			var nudge = 0.01 // volts
			// if (self.lastActiveSlider == "Vil") {
			// 	if (self.Vih() > self.Voh()) {
			// 		self.sliderVih.SetV(self.Voh() - nudge)
			// 	}
			// 	if (self.Vil() > self.Vih()) {
			// 		self.sliderVih.SetV(self.Vil() + nudge)
			// 	}
			// 	if (self.Vol() > self.Vil()) {
			// 		self.sliderVol.SetV(self.Vil() - nudge)
			// 	}
			// }
			
			// if (self.lastActiveSlider == "Vol") {
			// 	if (self.Vih() > self.Voh()) {
			// 		self.sliderVih.SetV(self.Voh() - nudge)
			// 	}
			// 	if (self.Vil() > self.Vih()) {
			// 		self.sliderVil.SetV(self.Vih() - nudge)
			// 	}
			// 	if (self.Vol() > self.Vil()) {
			// 		self.sliderVil.SetV(self.Vol() + nudge)
			// 	}
			// 	//console.log([self.Vil(), self.Vih()])
			// }
			
			// if (self.lastActiveSlider == "Vih") {
			// 	// if (self.Vih() > self.Voh()) {
			// 	// 	self.sliderVih.SetV(self.Voh() - nudge)
			// 	// }
			// 	if (self.Vil() > self.Vih()) {
			// 		self.sliderVil.SetV(self.Vih() - nudge)
			// 	}
			// 	if (self.Vol() > self.Vil()) {
			// 		self.sliderVol.SetV(self.Vil() - nudge)
			// 	}
			// }
			
			// if (self.lastActiveSlider == "Voh") {
			// }
			
			// if (self.Vil() > self.Vih()) {
			// 	self.sliderVih.SetV(self.Vil() + nudge)
			// }
			
			
			// if (self.Vih() > self.Voh()) {
			// 	self.sliderVih.SetV(self.Voh() - nudge)
			// }
			// if (self.Vil() > self.Vih()) {
			// 	self.sliderVil.SetV(self.Vih() - nudge)
			// }
			// if (self.Vol() > self.Vil()) {
			// 	self.sliderVol.SetV(self.Vil() - nudge)
			// }


			
			
			// console.log(["vol", self.Vol()],
			// 			["vil", self.Vil()],
			// 			["vih", self.Vih()],
			// 			["voh", self.Voh()])
			
			// update the noise margin parameters
			if (self.noiseMarginObject != nil) {
				self.noiseMarginObject.SetVil(self.Vil());
				self.noiseMarginObject.SetVih(self.Vih());
				self.noiseMarginObject.SetVol(self.Vol());
				self.noiseMarginObject.SetVoh(self.Voh());
			}
			
			// this means that when the user moves a slider, the
			// invarients must be enforced every frame.  If vih is moving
			// left and bumps into the vil slider, then the vil slider has
			// to move down.  If the vil slider's voltage is less than
			// vol's voltage, then that slider also has to decrease.
			

			
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
	function init() {
		var canvas = document.getElementById('myCanvas');
		// Create an empty project and a view for the canvas:
		paper.setup(canvas);
		//paper.
		var plot = Plot(paper, 700, 1000);
		//var glitz = Fun(paper);
		
		paper.view.onFrame = function(event) {
			plot.UpdateForbidden();
			plot.UpdateSliders();
			if (plot.SlidersAdjusted()) {
				plot.UpdateTransfer();
			}
			//glitz.Step();
			paper.view.draw();
		};
		plot.UpdateTransfer();

		return plot;
	}
	return init();
}

// Noise Margin
function NoiseMargin(top, left, width, height) {
	// There is a left and right inverter. Between them is a dataline
	// that has a noise visualization.  At the input terminal of the
	// left inverter there is a digital 1 or 0, likewise for the
	// output for the right inverter.
	
	// The right inverter is also equipped with the static discipline
	// values Vil, Vih, that demonstrate how the noise margin
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
	const GAPSIZE = 20; // the gap between parts

	// device parameters
	const WIDTH_OF_FORBIDDEN = 20;
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
			vilPx: BOTTOM,
			vihPx: TOP,
			volPx: BOTTOM,
			vohPx: TOP,
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
	
	function Parts() {
		var self = {
			inverterL: nil,
			inverterR: nil,
			dataLine: nil
		};
		
		self.init = function() {
			// create 
			self.inverterL = Inverter(LEFT);
			self.inverterR = Inverter(RIGHT - DEVICE_WIDTH);
			return self;
		};


		self.SetVil = function(v) {
			// self.inverterL ...
			self.inverterL.SetVil(v);	
			self.inverterR.SetVil(v);
		};
		
		self.SetVih = function(v) {
			self.inverterL.SetVih(v);	
			self.inverterR.SetVih(v);
		};
		
		self.SetVol = function(v) {
			self.inverterL.SetVol(v);	
			self.inverterR.SetVol(v);
		};
		
		self.SetVoh = function(v) {
			self.inverterL.SetVoh(v);	
			self.inverterR.SetVoh(v);
		};
		
		self.SetDigitalIn = function(b /*bool*/) {			
		};
		
		return self.init();
	}

	return Parts();
}

// -----------------------------------------------------------------------------
window.onload = function() {
	var plot = TransferPlot(400, 100);
	// function NoiseMargin(top, left, width, height) {
	var CHANGEME = 500;
	var margin = NoiseMargin(210, 100, CHANGEME, 120);
	plot.WireMargin(margin);
	
	console.log(margin);
};

// -----------------------------------------------------------------------------
// helper functions 
function randomRangeInt(a, b) {
    var delta = b - a;
    var r = Math.floor(Math.random() * delta);
    return a + r;
}

function coinFlipIsHeads() {
	return Math.random() > .5;
}






/// 
function Fun(paper) {
    var self = {
        counter: 100,
        finalText: "6.002.x - Static Discipline.     ",
        txt:       "________________________________",
        seen: {}, // a lookup table for the indices already fixed.
        text: nil
    };
    self.text = new paper.PointText(new paper.Point(50, 40));
    self.text.fillColor = 'black';
    self.text.content = self.tempText;
    self.text.fontFamily = "courier";
    self.text.fontSize = 18;

    self.GetRandom = function() {
        var n = self.finalText.length;
        return Math.floor(Math.random() * n);
    };

    self.GetRandomChar = function() {
        var src = "zxcvnm,.asdf';kldfh[pioqwertiouery-01923458790356!@#$%^&*()_+QWERFJBNM<>?L:";
        var n = src.length;
        return src[Math.floor(Math.random() * n)];
    };
    
    self.GetRandomEx = function() {
        // get a random index not in seen.
        var choices = [];
        for (var i=0; i<self.finalText.length; i++) {
            if (self.seen[i] != true) {
                choices.push(i);
            }
        }
        var n = choices.length;
        var rIdx = Math.floor(Math.random() * n);
        return rIdx;
    };

    self.UpdateText = function(idx, c) {
        self.txt = self.txt.substring(0, idx) + c + self.txt.substring(idx+1);
        self.text.content = self.txt;        
    };

    self.ChangeUnfixedChar = function() {
        var idx = self.GetRandomEx();
        var c = self.GetRandomChar();
        self.UpdateText(idx, c);
    };
    
    
    self.Step_ = function() {
        self.counter--;
        if (self.txt == self.finalText) {
            return;
        }
        if (self.counter < 0) {
            self.text.content = self.finalText;
            return;
        }
        var r = self.GetRandom();
        var c = self.finalText[r];
        
        self.seen[r] = true;
        self.UpdateText(r, c);
        self.ChangeUnfixedChar();
    };

    self.Step = function() {
        self.Step_();
        self.Step_();
    };
    
    return self;
}

