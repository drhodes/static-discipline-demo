
// Plot of the transfer function containing the user controls
// 
function TransferPlot(top, left) {	
	const LOGIC_LEVEL_HI = 5;
	const LOGIC_LEVEL_LO = 0;
	var PLOT_TOP = top;
	var PLOT_LEFT = left;
	var PLOT_WIDTH = 580;
	var PLOT_HEIGHT = 580;
	const PLOT_RIGHT = PLOT_LEFT + PLOT_WIDTH; //630;
	const PLOT_BOTTOM = PLOT_TOP + PLOT_HEIGHT;
	const SLIDER_THICK = 10;
	const SLIDER_BREADTH = 20;
	const nil = null;
	
	// -----------------------------------------------------------------------------
	function ScrollBarV(paper, left, top) {
		var self = {
			path: nil,
			sliderVol: nil,
			sliderVoh: nil
		};

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
			var p2 = new paper.Point(x + PLOT_LEFT - SLIDER_BREADTH,
									 y + PLOT_BOTTOM - PLOT_TOP);
			
			self.path = new paper.Path.Rectangle(p1, p2);
			self.path.fillColor = '#b3b3b3';
			self.path.opacity = .3;
			
			// setup the event callbacks.
			self.path.on('mouseleave', function() {
				// deselect bots sliders.
				self.sliderVol.UnHighlight();
				self.sliderVoh.UnHighlight();
			});
			self.path.on('mousedrag', function(evt) {
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
			});    

			
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
		
		self.init = function() {
			// setup the path.
			var x = left
			var y = top
			var p1 = new paper.Point(x, y);
			var p2 = new paper.Point(x+(PLOT_RIGHT-PLOT_LEFT), y+30);
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
				pair[0].MoveTo(x-50);
			});    
			self.path.on('mousedrag', function(evt) {
				// move the closest slider to this mouse position.
				var x = evt.point.x;
				var slider = self.ClosestSlider(x)[0];

				// don't drag a slider if the cursor is out of range.
				if (x > 50 && x < 680) {
					slider.MoveTo(x-50);
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
	function sliderEvents(self) {
		self.Highlight = function() {
			self.path.fillColor = 'blue';
			self.line.strokeColor = 'blue';
		};

		self.UnHighlight = function() {
			self.path.fillColor = 'black';
			self.line.strokeColor = 'lightgray';
		};
	};

	// -----------------------------------------------------------------------------
	function SliderVih(paper) {
		var self = {        
			x:0, y:0,
			path: nil,
			line: nil,
			tag: nil
		};

		self.init = function() {
			self.path = new paper.Path("m 10,1022.3622 0,30 -10,-10 0,-10 z");
			self.path.fillColor = 'black';
			self.path.rotate(180);        
			sliderEvents(self);
			self.tag = new paper.PointText();
			
		};

		self.SetX = function(x) {
			return self.x = x + 55;
		};  
		self.X = function(x) {
			return self.x;
		};  
		
		self.MoveTo = function(x) {        
			self.SetX(x);
			var y = 645;
			self.path.position = new paper.Point(self.x, y);
			self.UpdateLine(x,y);
		};

		self.UpdateLine = function(x, y) {
			if (self.line != nil) {
				self.line.remove();
			}
			// draw the line
			var from = new paper.Point(self.x-5, y-15);
			var to = new paper.Point(self.x-5, y-595);
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
			path: nil,
			line: nil,
			paper: paper
		};

		self.init = function() {
			self.path = new paper.Path("m 10,1022.3622 0,30 -10,-10 0,-10 z");
			self.path.fillColor = 'black';
			sliderEvents(self);
		};

		self.SetX = function(x) {
			return self.x = x + 45;
		};  
		self.X = function(x) {
			return self.x;
		};  
		
		self.MoveTo = function(x) {        
			self.SetX(x);
			var y = 645;
			self.path.position = new paper.Point(self.x, y);
			self.DrawLine(y);
		};


		self.DrawLine = function(y) {
			if (self.line != nil) {
				self.line.remove();
			}
			// draw the line
			var from = new paper.Point(self.x+5, y-15);
			var to = new paper.Point(self.x+5, y-595);
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
			x:35, y:0,
			path: nil,
			line: nil,
			paper: paper
		};

		self.init = function() {
			self.path = new paper.Path("m 10,1022.3622 0,30 -10,-10 0,-10 z");
			self.path.fillColor = 'black';
			self.path.rotate(90);
			sliderEvents(self);
		};


		self.SetY = function(y) {
			return self.y = 635 - y;
		};  
		self.Y = function() {
			return self.y+5;
		};
		
		self.MoveTo = function(y) {        
			self.SetY(y);
			self.path.position = new paper.Point(self.x, self.y);
			// draw the line
			self.UpdateLine(y);
		};

		self.UpdateLine = function(y) {
			if (self.line != nil) {
				self.line.remove();
			}
			var from = new paper.Point(self.x+15, self.y+5);
			var to = new paper.Point(self.x+595, self.y+5);
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
			x:35, y:0,
			path: nil,
			line: nil,
			paper: paper
		};

		self.init = function() {
			self.path = new paper.Path("m 10,1022.3622 0,30 -10,-10 0,-10 z");
			self.path.fillColor = 'black';
			self.path.rotate(-90);
			sliderEvents(self);
		};

		self.SetY = function(y) {
			return self.y = 640 - y;
		};
		
		self.Y = function() {
			return self.y;
		};
		
		self.MoveTo = function(y) {
			y-=5;
			self.SetY(y);
			self.path.position = new paper.Point(self.x, self.y);
			// draw the line
			self.UpdateLine(y);
		};

		self.UpdateLine = function(y) {
			if (self.line != nil) {
				self.line.remove();
			}
			var from = new paper.Point(self.x+15, self.y-5);
			var to = new paper.Point(self.x+595, self.y-5);
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
			// randomPoint on segment (0, voh) -> (0, LOGIC_LEVEL_HI)
			var x1 = 50;
			var y1 = randomRangeInt(50, plot.sliderVoh.Y());
			var p1 = new paper.Point(x1, y1);
			// randomPoint on segment (vil, voh) -> (vil, LOGIC_LEVEL_HI)
			var x2 = plot.sliderVil.X() + 5;
			var y2 = randomRangeInt(50, plot.sliderVoh.Y());
			var p2 = new paper.Point(x2, y2);
			// randomPoint on segment (vih, 0) -> (vil, Vol)
			var x3 = plot.sliderVih.X() - 5;
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
			var vil = plot.sliderVil.X() + 5;
			var vih = plot.sliderVih.X() - 5;
			var ps = [];
			while(Math.random() > .5) {
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
			end:nil
		};
		
		self.initBackground = function() {
			var x = 50;
			var y = 50;
			var p1 = new paper.Point(x, y);
			var p2 = new paper.Point(x+580, y+580);
			self.path = new paper.Path.Rectangle(p1, p2);
			self.path.fillColor = '#848494';
		};

		self.initSliders = function() {
			self.sliderVil = SliderVil(paper);
			self.sliderVil.MoveTo(100);
			
			self.sliderVih = SliderVih(paper);
			self.sliderVih.MoveTo(200);
			
			self.sliderVoh = SliderVoh(paper);
			self.sliderVoh.MoveTo(300);
			
			self.sliderVol = SliderVol(paper);
			self.sliderVol.MoveTo(100);
			
			self.scrollBarH = ScrollBarH(paper, 50, 630);
			self.scrollBarV = ScrollBarV(paper, 20, 50);

			// TODO. refactor. scrollbars should own sliders.
			self.scrollBarV.sliderVol = self.sliderVol;
			self.scrollBarV.sliderVoh = self.sliderVoh;
			self.scrollBarH.sliderVil = self.sliderVil;
			self.scrollBarH.sliderVih = self.sliderVih;
		};

		self.initTranferFunc = function() {
			self.transferFunc = RandomTransferFunction();
		};
		
		self.UpdateForbiddenL = function() {
			if (self.forbiddenL != nil) {
				self.forbiddenL.remove();
			}
			var top = self.sliderVoh.Y(); 
			var bot = self.sliderVol.Y();
			var left = 50;
			var right = self.sliderVil.X();
			
			var p1 = new paper.Point(50, top+1);
			var p2 = new paper.Point(right+4, bot-6);
			self.forbiddenL = new paper.Path.Rectangle(p1, p2);
			self.forbiddenL.fillColor = '#743d3d';
		};

		self.UpdateForbiddenR = function() {
			if (self.forbiddenR != nil) {
				self.forbiddenR.remove();
			}
			var top = self.sliderVoh.Y();
			var bot = self.sliderVol.Y();
			var left = self.sliderVih.X();
			var right = 626;
			
			var p1 = new paper.Point(left-4, top+1);
			var p2 = new paper.Point(right+4, bot-6);
			self.forbiddenR = new paper.Path.Rectangle(p1, p2);
			self.forbiddenR.fillColor = '#743d3d';
		};
		
		self.UpdateForbidden = function() {
			self.UpdateForbiddenL();
			self.UpdateForbiddenR();
		};

		self.UpdateSliders = function() {
			// ok, so this is involved, but not complicated.  the static
			// discipline enforces some invarients.
			// vol < vil < vih < voh;

			// this means that when the user moves a slider, the
			// invarients must be enforced every frame.  If vih is moving
			// left and bumps into the vil slider, then the vil slider has
			// to move down.  If the vil slider's voltage is less than
			// vol's voltage, then that slider also has to decrease. 
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
			//plot.UpdateTransfer();
			
			//glitz.Step();
			paper.view.draw();
		};

		return plot;
	}

	return init();
}

// Get a reference to the canvas object
    // var canvas = document.getElementById('myCanvas');
    // // Create an empty project and a view for the canvas:
    // paper.setup(canvas);
    // var plot = Plot(paper, 700, 700);
    // var glitz = Fun(paper);
    
    // paper.view.onFrame = function(event) {
    //     plot.UpdateForbidden();
    //     plot.UpdateSliders();
    //     //plot.UpdateTransfer();
        
    //     glitz.Step();
    //     paper.view.draw();
    // };    

// -----------------------------------------------------------------------------
window.onload = function() {
	var plot = TransferPlot(50, 50);
};

// -----------------------------------------------------------------------------
// -------------------------------------------------------
// helper functions 
function randomRangeInt(a, b) {
    var delta = b - a;
    var r = Math.floor(Math.random() * delta);
    return a + r;
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

