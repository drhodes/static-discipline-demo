ll;var StaticCommon={};StaticCommon.MIT_RED="#a31f34",StaticCommon.LOGIC_LEVEL_LO=0,StaticCommon.LOGIC_LEVEL_HI=5,StaticCommon.COLOR_OF_FORBIDDEN=StaticCommon.MIT_RED,StaticCommon.Clip=function(n){return n<StaticCommon.LOGIC_LEVEL_LO?StaticCommon.LOGIC_LEVEL_LO:n>StaticCommon.LOGIC_LEVEL_HI?StaticCommon.LOGIC_LEVEL_HI:n},window.onload=function(){TransferPlot(310,100,400)};
ne.bounds.height,r=t-o,l=new paper.Point(e,o),a=new paper.Point(i,t),c=new paper.Point(i,o);n.greenTriBottom=s(l,a,c,"lightgreen"),e=n.envelope.topLine.bounds.x,i=e+n.envelope.topLine.bounds.width,t=n.envelope.topLine.bounds.y,o=t+n.envelope.topLine.bounds.height,l=new paper.Point(e,t),a=new paper.Point(i,t-r),c=new paper.Point(i,t),n.greenTriTop=s(l,a,c,"lightgreen")}},n.TopMarginIsTolerance=function(){return n.MarginTop()<=n.MarginBottom()},n.UpdateArrow=function(){var e=n.voh-n.vih,i=n.vil-n.vol;n.marginArrow!=nil&&n.marginArrow.Remove(),n.marginArrow=i>=e?p(n.lineVih.Tip(),n.lineVoh.Tip(),e):p(n.lineVol.Tip(),n.lineVil.Tip(),i)},n.UpdateNoise=function(){n.topNoise!=nil&&n.topNoise.Remove(),n.botNoise!=nil&&n.botNoise.Remove(),1==n.digitalIn?n.topNoise=u(n.voh,n.vih,n.Tolerance()):n.botNoise=d(n.vol,n.vil,n.Tolerance())},n.fixupLeftInverterIndicators=function(n,e){n.SetV(e),n.SetTextContent(e.toFixed(1)),n.HideLine()},n.SetVil=function(e){n.vil=e,n.inverterL.SetVil(e),n.inverterR.SetVil(e),n.lineVil.SetV(e),n.fixupLeftInverterIndicators(n.leftVil,e),n.envelope.SetVil(e),n.UpdateFrame()},n.SetVih=function(e){n.vih=e,n.inverterL.SetVih(e),n.inverterR.SetVih(e),n.lineVih.SetV(e),n.fixupLeftInverterIndicators(n.leftVih,e),n.envelope.SetVih(e),n.UpdateFrame()},n.SetVol=function(e){n.vol=e,n.inverterL.SetVol(e),n.inverterR.SetVol(e),n.lineVol.SetV(e),n.fixupLeftInverterIndicators(n.leftVol,e),n.envelope.SetVol(e),n.UpdateFrame()},n.SetVoh=function(e){n.voh=e,n.inverterL.SetVoh(e),n.inverterR.SetVoh(e),n.lineVoh.SetV(e),n.fixupLeftInverterIndicators(n.leftVoh,e),n.envelope.SetVoh(e),n.UpdateFrame()},n.ToggleDigitalIn=function(){n.digitalIn=!n.digitalIn},n.init()}const v=StaticCommon.LOGIC_LEVEL_LO,V=StaticCommon.LOGIC_LEVEL_HI,g=n,x=i,L=e,S=L+x,m=t,b=g+m,w=30,T=30,P=120;return f()}function Schematic(n,e,i,t){function o(n,e){const i="M 0 979.625 L 0 988.71875 L 0 1052.375 L 54.53125 1016 L 0 979.625 z M 54.53125 1016 C 54.53125 1019.0125 56.987538 1021.4375 60 1021.4375 C 63.012462 1021.4375 65.46875 1019.0125 65.46875 1016 C 65.46875 1012.9875 63.012462 1010.5312 60 1010.5312 C 56.987538 1010.5312 54.53125 1012.9875 54.53125 1016 z ";var t={x:n,y:e,nudgeX:65,nudgeY:60,box:nil,icon:nil};return t.init=function(){var o=new paper.Point(n,e),r=new paper.Point(n+u,e+h);return t.deviceBox=new paper.Path.Rectangle(o,r),t.deviceBox.fillColor="lightgray",t.icon=new paper.Path(i),t.icon.position=new paper.Point(n+t.nudgeX,e+t.nudgeY),t.icon.strokeColor="black",t.icon.fillColor="white",t.icon.strokeWidth=3,t},t.LeftSide=function(){const n=2;return t.x+t.icon.bounds.width/2-n},t.RightSide=function(){const n=3;return t.LeftSide()+t.icon.bounds.width+n},t.init()}function r(){var n={lineL:nil,lineM:nil,lineR:nil,toggleFlag:!1};return n.init=function(){return n},n.drawLine=function(n,e){var i=a+60+1-1,t=new paper.Point(n,i),o=new paper.Point(e,i),r=new paper.Path.Line(t,o);return r.strokeWidth=2,r.strokeColor=new paper.Color(0,0,0),r},n.drawLines=function(e,i){n.lineL=n.drawLine(0,e.LeftSide()),n.lineM=n.drawLine(e.RightSide(),i.LeftSide()),n.lineR=n.drawLine(i.RightSide(),9999),n.Toggle()},n.Toggle=function(){n.toggleFlag?(n.lineL.dashArray=[5,5],n.lineM.dashArray=[],n.lineR.dashArray=[5,5]):(n.lineL.dashArray=[],n.lineM.dashArray=[5,5],n.lineR.dashArray=[]),n.toggleFlag=!n.toggleFlag},n.init()}function l(){var n={invLeft:o(c,a),invRight:o(d-u,a),lineGroup:r()};return n.init=function(){return n.lineGroup.drawLines(n.invLeft,n.invRight),n},n.Toggle=function(){n.lineGroup.Toggle()},n.init()}const a=n,c=e,d=e+i,u=120,h=120;return l()}function randomRangeInt(n,e){var i=e-n,t=Math.floor(Math.random()*i);return n+t}function coinFlipIsHeads(){return Math.random()>.5}const nil=null;var StaticCommon={};StaticCommon.MIT_RED="#a31f34",StaticCommon.LOGIC_LEVEL_LO=0,StaticCommon.LOGIC_LEVEL_HI=5,StaticCommon.COLOR_OF_FORBIDDEN=StaticCommon.MIT_RED,StaticCommon.Clip=function(n){return n<StaticCommon.LOGIC_LEVEL_LO?StaticCommon.LOGIC_LEVEL_LO:n>StaticCommon.LOGIC_LEVEL_HI?StaticCommon.LOGIC_LEVEL_HI:n},window.onload=function(){TransferPlot(310,100,400)};
ne.bounds.height,r=t-o,l=new paper.Point(e,o),a=new paper.Point(i,t),c=new paper.Point(i,o);n.greenTriBottom=s(l,a,c,"lightgreen"),e=n.envelope.topLine.bounds.x,i=e+n.envelope.topLine.bounds.width,t=n.envelope.topLine.bounds.y,o=t+n.envelope.topLine.bounds.height,l=new paper.Point(e,t),a=new paper.Point(i,t-r),c=new paper.Point(i,t),n.greenTriTop=s(l,a,c,"lightgreen")}},n.TopMarginIsTolerance=function(){return n.MarginTop()<=n.MarginBottom()},n.UpdateArrow=function(){var e=n.voh-n.vih,i=n.vil-n.vol;n.marginArrow!=nil&&n.marginArrow.Remove(),n.marginArrow=i>=e?p(n.lineVih.Tip(),n.lineVoh.Tip(),e):p(n.lineVol.Tip(),n.lineVil.Tip(),i)},n.UpdateNoise=function(){n.topNoise!=nil&&n.topNoise.Remove(),n.botNoise!=nil&&n.botNoise.Remove(),1==n.digitalIn?n.topNoise=u(n.voh,n.vih,n.Tolerance()):n.botNoise=d(n.vol,n.vil,n.Tolerance())},n.fixupLeftInverterIndicators=function(n,e){n.SetV(e),n.SetTextContent(e.toFixed(1)),n.HideLine()},n.SetVil=function(e){n.vil=e,n.inverterL.SetVil(e),n.inverterR.SetVil(e),n.lineVil.SetV(e),n.fixupLeftInverterIndicators(n.leftVil,e),n.envelope.SetVil(e),n.UpdateFrame()},n.SetVih=function(e){n.vih=e,n.inverterL.SetVih(e),n.inverterR.SetVih(e),n.lineVih.SetV(e),n.fixupLeftInverterIndicators(n.leftVih,e),n.envelope.SetVih(e),n.UpdateFrame()},n.SetVol=function(e){n.vol=e,n.inverterL.SetVol(e),n.inverterR.SetVol(e),n.lineVol.SetV(e),n.fixupLeftInverterIndicators(n.leftVol,e),n.envelope.SetVol(e),n.UpdateFrame()},n.SetVoh=function(e){n.voh=e,n.inverterL.SetVoh(e),n.inverterR.SetVoh(e),n.lineVoh.SetV(e),n.fixupLeftInverterIndicators(n.leftVoh,e),n.envelope.SetVoh(e),n.UpdateFrame()},n.ToggleDigitalIn=function(){n.digitalIn=!n.digitalIn},n.init()}const v=StaticCommon.LOGIC_LEVEL_LO,V=StaticCommon.LOGIC_LEVEL_HI,g=n,x=i,L=e,S=L+x,m=t,b=g+m,w=30,T=30,P=120;return f()}function Schematic(n,e,i,t){function o(n,e){const i="M 0 979.625 L 0 988.71875 L 0 1052.375 L 54.53125 1016 L 0 979.625 z M 54.53125 1016 C 54.53125 1019.0125 56.987538 1021.4375 60 1021.4375 C 63.012462 1021.4375 65.46875 1019.0125 65.46875 1016 C 65.46875 1012.9875 63.012462 1010.5312 60 1010.5312 C 56.987538 1010.5312 54.53125 1012.9875 54.53125 1016 z ";var t={x:n,y:e,nudgeX:65,nudgeY:60,box:nil,icon:nil};return t.init=function(){var o=new paper.Point(n,e),r=new paper.Point(n+u,e+h);return t.deviceBox=new paper.Path.Rectangle(o,r),t.deviceBox.fillColor="lightgray",t.icon=new paper.Path(i),t.icon.position=new paper.Point(n+t.nudgeX,e+t.nudgeY),t.icon.strokeColor="black",t.icon.fillColor="white",t.icon.strokeWidth=3,t},t.LeftSide=function(){const n=2;return t.x+t.icon.bounds.width/2-n},t.RightSide=function(){const n=3;return t.LeftSide()+t.icon.bounds.width+n},t.init()}function r(){var n={lineL:nil,lineM:nil,lineR:nil,toggleFlag:!1};return n.init=function(){return n},n.drawLine=function(n,e){var i=a+60+1-1,t=new paper.Point(n,i),o=new paper.Point(e,i),r=new paper.Path.Line(t,o);return r.strokeWidth=2,r.strokeColor=new paper.Color(0,0,0),r},n.drawLines=function(e,i){n.lineL=n.drawLine(0,e.LeftSide()),n.lineM=n.drawLine(e.RightSide(),i.LeftSide()),n.lineR=n.drawLine(i.RightSide(),9999),n.Toggle()},n.Toggle=function(){n.toggleFlag?(n.lineL.dashArray=[5,5],n.lineM.dashArray=[],n.lineR.dashArray=[5,5]):(n.lineL.dashArray=[],n.lineM.dashArray=[5,5],n.lineR.dashArray=[]),n.toggleFlag=!n.toggleFlag},n.init()}function l(){var n={invLeft:o(c,a),invRight:o(d-u,a),lineGroup:r()};return n.init=function(){return n.lineGroup.drawLines(n.invLeft,n.invRight),n},n.Toggle=function(){n.lineGroup.Toggle()},n.init()}const a=n,c=e,d=e+i,u=120,h=120;return l()}function randomRangeInt(n,e){var i=e-n,t=Math.floor(Math.random()*i);return n+t}function coinFlipIsHeads(){return Math.random()>.5}const nil=null;var StaticCommon={};StaticCommon.MIT_RED="#a31f34",StaticCommon.LOGIC_LEVEL_LO=0,StaticCommon.LOGIC_LEVEL_HI=5,StaticCommon.COLOR_OF_FORBIDDEN=StaticCommon.MIT_RED,StaticCommon.Clip=function(n){return n<StaticCommon.LOGIC_LEVEL_LO?StaticCommon.LOGIC_LEVEL_LO:n>StaticCommon.LOGIC_LEVEL_HI?StaticCommon.LOGIC_LEVEL_HI:n},window.onload=function(){TransferPlot(310,100,400)};
ne.bounds.height,r=t-o,l=new paper.Point(e,o),a=new paper.Point(i,t),c=new paper.Point(i,o);n.greenTriBottom=s(l,a,c,"lightgreen"),e=n.envelope.topLine.bounds.x,i=e+n.envelope.topLine.bounds.width,t=n.envelope.topLine.bounds.y,o=t+n.envelope.topLine.bounds.height,l=new paper.Point(e,t),a=new paper.Point(i,t-r),c=new paper.Point(i,t),n.greenTriTop=s(l,a,c,"lightgreen")}},n.TopMarginIsTolerance=function(){return n.MarginTop()<=n.MarginBottom()},n.UpdateArrow=function(){var e=n.voh-n.vih,i=n.vil-n.vol;n.marginArrow!=nil&&n.marginArrow.Remove(),n.marginArrow=i>=e?p(n.lineVih.Tip(),n.lineVoh.Tip(),e):p(n.lineVol.Tip(),n.lineVil.Tip(),i)},n.UpdateNoise=function(){n.topNoise!=nil&&n.topNoise.Remove(),n.botNoise!=nil&&n.botNoise.Remove(),1==n.digitalIn?n.topNoise=u(n.voh,n.vih,n.Tolerance()):n.botNoise=d(n.vol,n.vil,n.Tolerance())},n.fixupLeftInverterIndicators=function(n,e){n.SetV(e),n.SetTextContent(e.toFixed(1)),n.HideLine()},n.SetVil=function(e){n.vil=e,n.inverterL.SetVil(e),n.inverterR.SetVil(e),n.lineVil.SetV(e),n.fixupLeftInverterIndicators(n.leftVil,e),n.envelope.SetVil(e),n.UpdateFrame()},n.SetVih=function(e){n.vih=e,n.inverterL.SetVih(e),n.inverterR.SetVih(e),n.lineVih.SetV(e),n.fixupLeftInverterIndicators(n.leftVih,e),n.envelope.SetVih(e),n.UpdateFrame()},n.SetVol=function(e){n.vol=e,n.inverterL.SetVol(e),n.inverterR.SetVol(e),n.lineVol.SetV(e),n.fixupLeftInverterIndicators(n.leftVol,e),n.envelope.SetVol(e),n.UpdateFrame()},n.SetVoh=function(e){n.voh=e,n.inverterL.SetVoh(e),n.inverterR.SetVoh(e),n.lineVoh.SetV(e),n.fixupLeftInverterIndicators(n.leftVoh,e),n.envelope.SetVoh(e),n.UpdateFrame()},n.ToggleDigitalIn=function(){n.digitalIn=!n.digitalIn},n.init()}const v=StaticCommon.LOGIC_LEVEL_LO,V=StaticCommon.LOGIC_LEVEL_HI,g=n,x=i,L=e,S=L+x,m=t,b=g+m,w=30,T=30,P=120;return f()}function Schematic(n,e,i,t){function o(n,e){const i="M 0 979.625 L 0 988.71875 L 0 1052.375 L 54.53125 1016 L 0 979.625 z M 54.53125 1016 C 54.53125 1019.0125 56.987538 1021.4375 60 1021.4375 C 63.012462 1021.4375 65.46875 1019.0125 65.46875 1016 C 65.46875 1012.9875 63.012462 1010.5312 60 1010.5312 C 56.987538 1010.5312 54.53125 1012.9875 54.53125 1016 z ";var t={x:n,y:e,nudgeX:65,nudgeY:60,box:nil,icon:nil};return t.init=function(){var o=new paper.Point(n,e),r=new paper.Point(n+u,e+h);return t.deviceBox=new paper.Path.Rectangle(o,r),t.deviceBox.fillColor="lightgray",t.icon=new paper.Path(i),t.icon.position=new paper.Point(n+t.nudgeX,e+t.nudgeY),t.icon.strokeColor="black",t.icon.fillColor="white",t.icon.strokeWidth=3,t},t.LeftSide=function(){const n=2;return t.x+t.icon.bounds.width/2-n},t.RightSide=function(){const n=3;return t.LeftSide()+t.icon.bounds.width+n},t.init()}function r(){var n={lineL:nil,lineM:nil,lineR:nil,toggleFlag:!1};return n.init=function(){return n},n.drawLine=function(n,e){var i=a+60+1-1,t=new paper.Point(n,i),o=new paper.Point(e,i),r=new paper.Path.Line(t,o);return r.strokeWidth=2,r.strokeColor=new paper.Color(0,0,0),r},n.drawLines=function(e,i){n.lineL=n.drawLine(0,e.LeftSide()),n.lineM=n.drawLine(e.RightSide(),i.LeftSide()),n.lineR=n.drawLine(i.RightSide(),9999),n.Toggle()},n.Toggle=function(){n.toggleFlag?(n.lineL.dashArray=[5,5],n.lineM.dashArray=[],n.lineR.dashArray=[5,5]):(n.lineL.dashArray=[],n.lineM.dashArray=[5,5],n.lineR.dashArray=[]),n.toggleFlag=!n.toggleFlag},n.init()}function l(){var n={invLeft:o(c,a),invRight:o(d-u,a),lineGroup:r()};return n.init=function(){return n.lineGroup.drawLines(n.invLeft,n.invRight),n},n.Toggle=function(){n.lineGroup.Toggle()},n.init()}const a=n,c=e,d=e+i,u=120,h=120;return l()}function randomRangeInt(n,e){var i=e-n,t=Math.floor(Math.random()*i);return n+t}function coinFlipIsHeads(){return Math.random()>.5}const nil=null;var StaticCommon={};StaticCommon.MIT_RED="#a31f34",StaticCommon.LOGIC_LEVEL_LO=0,StaticCommon.LOGIC_LEVEL_HI=5,StaticCommon.COLOR_OF_FORBIDDEN=StaticCommon.MIT_RED,StaticCommon.Clip=function(n){return n<StaticCommon.LOGIC_LEVEL_LO?StaticCommon.LOGIC_LEVEL_LO:n>StaticCommon.LOGIC_LEVEL_HI?StaticCommon.LOGIC_LEVEL_HI:n},window.onload=function(){TransferPlot(310,100,400)};
ne.bounds.height,r=t-o,l=new paper.Point(e,o),a=new paper.Point(i,t),c=new paper.Point(i,o);n.greenTriBottom=s(l,a,c,"lightgreen"),e=n.envelope.topLine.bounds.x,i=e+n.envelope.topLine.bounds.width,t=n.envelope.topLine.bounds.y,o=t+n.envelope.topLine.bounds.height,l=new paper.Point(e,t),a=new paper.Point(i,t-r),c=new paper.Point(i,t),n.greenTriTop=s(l,a,c,"lightgreen")}},n.TopMarginIsTolerance=function(){return n.MarginTop()<=n.MarginBottom()},n.UpdateArrow=function(){var e=n.voh-n.vih,i=n.vil-n.vol;n.marginArrow!=nil&&n.marginArrow.Remove(),n.marginArrow=i>=e?p(n.lineVih.Tip(),n.lineVoh.Tip(),e):p(n.lineVol.Tip(),n.lineVil.Tip(),i)},n.UpdateNoise=function(){n.topNoise!=nil&&n.topNoise.Remove(),n.botNoise!=nil&&n.botNoise.Remove(),1==n.digitalIn?n.topNoise=u(n.voh,n.vih,n.Tolerance()):n.botNoise=d(n.vol,n.vil,n.Tolerance())},n.fixupLeftInverterIndicators=function(n,e){n.SetV(e),n.SetTextContent(e.toFixed(1)),n.HideLine()},n.SetVil=function(e){n.vil=e,n.inverterL.SetVil(e),n.inverterR.SetVil(e),n.lineVil.SetV(e),n.fixupLeftInverterIndicators(n.leftVil,e),n.envelope.SetVil(e),n.UpdateFrame()},n.SetVih=function(e){n.vih=e,n.inverterL.SetVih(e),n.inverterR.SetVih(e),n.lineVih.SetV(e),n.fixupLeftInverterIndicators(n.leftVih,e),n.envelope.SetVih(e),n.UpdateFrame()},n.SetVol=function(e){n.vol=e,n.inverterL.SetVol(e),n.inverterR.SetVol(e),n.lineVol.SetV(e),n.fixupLeftInverterIndicators(n.leftVol,e),n.envelope.SetVol(e),n.UpdateFrame()},n.SetVoh=function(e){n.voh=e,n.inverterL.SetVoh(e),n.inverterR.SetVoh(e),n.lineVoh.SetV(e),n.fixupLeftInverterIndicators(n.leftVoh,e),n.envelope.SetVoh(e),n.UpdateFrame()},n.ToggleDigitalIn=function(){n.digitalIn=!n.digitalIn},n.init()}const v=StaticCommon.LOGIC_LEVEL_LO,V=StaticCommon.LOGIC_LEVEL_HI,g=n,x=i,L=e,S=L+x,m=t,b=g+m,w=30,T=30,P=120;return f()}function Schematic(n,e,i,t){function o(n,e){const i="M 0 979.625 L 0 988.71875 L 0 1052.375 L 54.53125 1016 L 0 979.625 z M 54.53125 1016 C 54.53125 1019.0125 56.987538 1021.4375 60 1021.4375 C 63.012462 1021.4375 65.46875 1019.0125 65.46875 1016 C 65.46875 1012.9875 63.012462 1010.5312 60 1010.5312 C 56.987538 1010.5312 54.53125 1012.9875 54.53125 1016 z ";var t={x:n,y:e,nudgeX:65,nudgeY:60,box:nil,icon:nil};return t.init=function(){var o=new paper.Point(n,e),r=new paper.Point(n+u,e+h);return t.deviceBox=new paper.Path.Rectangle(o,r),t.deviceBox.fillColor="lightgray",t.icon=new paper.Path(i),t.icon.position=new paper.Point(n+t.nudgeX,e+t.nudgeY),t.icon.strokeColor="black",t.icon.fillColor="white",t.icon.strokeWidth=3,t},t.LeftSide=function(){const n=2;return t.x+t.icon.bounds.width/2-n},t.RightSide=function(){const n=3;return t.LeftSide()+t.icon.bounds.width+n},t.init()}function r(){var n={lineL:nil,lineM:nil,lineR:nil,toggleFlag:!1};return n.init=function(){return n},n.drawLine=function(n,e){var i=a+60+1-1,t=new paper.Point(n,i),o=new paper.Point(e,i),r=new paper.Path.Line(t,o);return r.strokeWidth=2,r.strokeColor=new paper.Color(0,0,0),r},n.drawLines=function(e,i){n.lineL=n.drawLine(0,e.LeftSide()),n.lineM=n.drawLine(e.RightSide(),i.LeftSide()),n.lineR=n.drawLine(i.RightSide(),9999),n.Toggle()},n.Toggle=function(){n.toggleFlag?(n.lineL.dashArray=[5,5],n.lineM.dashArray=[],n.lineR.dashArray=[5,5]):(n.lineL.dashArray=[],n.lineM.dashArray=[5,5],n.lineR.dashArray=[]),n.toggleFlag=!n.toggleFlag},n.init()}function l(){var n={invLeft:o(c,a),invRight:o(d-u,a),lineGroup:r()};return n.init=function(){return n.lineGroup.drawLines(n.invLeft,n.invRight),n},n.Toggle=function(){n.lineGroup.Toggle()},n.init()}const a=n,c=e,d=e+i,u=120,h=120;return l()}function randomRangeInt(n,e){var i=e-n,t=Math.floor(Math.random()*i);return n+t}function coinFlipIsHeads(){return Math.random()>.5}const nil=null;var StaticCommon={};StaticCommon.MIT_RED="#a31f34",StaticCommon.LOGIC_LEVEL_LO=0,StaticCommon.LOGIC_LEVEL_HI=5,StaticCommon.COLOR_OF_FORBIDDEN=StaticCommon.MIT_RED,StaticCommon.Clip=function(n){return n<StaticCommon.LOGIC_LEVEL_LO?StaticCommon.LOGIC_LEVEL_LO:n>StaticCommon.LOGIC_LEVEL_HI?StaticCommon.LOGIC_LEVEL_HI:n},window.onload=function(){TransferPlot(310,100,400)};
ne.bounds.height,r=t-o,l=new paper.Point(e,o),a=new paper.Point(i,t),c=new paper.Point(i,o);n.greenTriBottom=s(l,a,c,"lightgreen"),e=n.envelope.topLine.bounds.x,i=e+n.envelope.topLine.bounds.width,t=n.envelope.topLine.bounds.y,o=t+n.envelope.topLine.bounds.height,l=new paper.Point(e,t),a=new paper.Point(i,t-r),c=new paper.Point(i,t),n.greenTriTop=s(l,a,c,"lightgreen")}},n.TopMarginIsTolerance=function(){return n.MarginTop()<=n.MarginBottom()},n.UpdateArrow=function(){var e=n.voh-n.vih,i=n.vil-n.vol;n.marginArrow!=nil&&n.marginArrow.Remove(),n.marginArrow=i>=e?p(n.lineVih.Tip(),n.lineVoh.Tip(),e):p(n.lineVol.Tip(),n.lineVil.Tip(),i)},n.UpdateNoise=function(){n.topNoise!=nil&&n.topNoise.Remove(),n.botNoise!=nil&&n.botNoise.Remove(),1==n.digitalIn?n.topNoise=u(n.voh,n.vih,n.Tolerance()):n.botNoise=d(n.vol,n.vil,n.Tolerance())},n.fixupLeftInverterIndicators=function(n,e){n.SetV(e),n.SetTextContent(e.toFixed(1)),n.HideLine()},n.SetVil=function(e){n.vil=e,n.inverterL.SetVil(e),n.inverterR.SetVil(e),n.lineVil.SetV(e),n.fixupLeftInverterIndicators(n.leftVil,e),n.envelope.SetVil(e),n.UpdateFrame()},n.SetVih=function(e){n.vih=e,n.inverterL.SetVih(e),n.inverterR.SetVih(e),n.lineVih.SetV(e),n.fixupLeftInverterIndicators(n.leftVih,e),n.envelope.SetVih(e),n.UpdateFrame()},n.SetVol=function(e){n.vol=e,n.inverterL.SetVol(e),n.inverterR.SetVol(e),n.lineVol.SetV(e),n.fixupLeftInverterIndicators(n.leftVol,e),n.envelope.SetVol(e),n.UpdateFrame()},n.SetVoh=function(e){n.voh=e,n.inverterL.SetVoh(e),n.inverterR.SetVoh(e),n.lineVoh.SetV(e),n.fixupLeftInverterIndicators(n.leftVoh,e),n.envelope.SetVoh(e),n.UpdateFrame()},n.ToggleDigitalIn=function(){n.digitalIn=!n.digitalIn},n.init()}const v=StaticCommon.LOGIC_LEVEL_LO,V=StaticCommon.LOGIC_LEVEL_HI,g=n,x=i,L=e,S=L+x,m=t,b=g+m,w=30,T=30,P=120;return f()}function Schematic(n,e,i,t){function o(n,e){const i="M 0 979.625 L 0 988.71875 L 0 1052.375 L 54.53125 1016 L 0 979.625 z M 54.53125 1016 C 54.53125 1019.0125 56.987538 1021.4375 60 1021.4375 C 63.012462 1021.4375 65.46875 1019.0125 65.46875 1016 C 65.46875 1012.9875 63.012462 1010.5312 60 1010.5312 C 56.987538 1010.5312 54.53125 1012.9875 54.53125 1016 z ";var t={x:n,y:e,nudgeX:65,nudgeY:60,box:nil,icon:nil};return t.init=function(){var o=new paper.Point(n,e),r=new paper.Point(n+u,e+h);return t.deviceBox=new paper.Path.Rectangle(o,r),t.deviceBox.fillColor="lightgray",t.icon=new paper.Path(i),t.icon.position=new paper.Point(n+t.nudgeX,e+t.nudgeY),t.icon.strokeColor="black",t.icon.fillColor="white",t.icon.strokeWidth=3,t},t.LeftSide=function(){const n=2;return t.x+t.icon.bounds.width/2-n},t.RightSide=function(){const n=3;return t.LeftSide()+t.icon.bounds.width+n},t.init()}function r(){var n={lineL:nil,lineM:nil,lineR:nil,toggleFlag:!1};return n.init=function(){return n},n.drawLine=function(n,e){var i=a+60+1-1,t=new paper.Point(n,i),o=new paper.Point(e,i),r=new paper.Path.Line(t,o);return r.strokeWidth=2,r.strokeColor=new paper.Color(0,0,0),r},n.drawLines=function(e,i){n.lineL=n.drawLine(0,e.LeftSide()),n.lineM=n.drawLine(e.RightSide(),i.LeftSide()),n.lineR=n.drawLine(i.RightSide(),9999),n.Toggle()},n.Toggle=function(){n.toggleFlag?(n.lineL.dashArray=[5,5],n.lineM.dashArray=[],n.lineR.dashArray=[5,5]):(n.lineL.dashArray=[],n.lineM.dashArray=[5,5],n.lineR.dashArray=[]),n.toggleFl��    toggleFlag},n.init()}function l(){var n={invLeft:o(c,a),invRight:o(d-u,a),lineGroup:r()};return n.init=function(){return n.lineGroup.drawLines(n.invLeft,n.invRight),n},n.Toggle=function(){n.lineGroup.Toggle()},n.init()}const a=n,c=e,d=e+i,u=120,h=120;return l()}function randomRangeInt(n,e){var i=e-n,t=Math.floor(Math.random()*i);return n+t}function coinFlipIsHeads(){return Math.random()>.5}const nil=null;var StaticCommon={};StaticCommon.MIT_RED="#a31f34",StaticCommon.LOGIC_LEVEL_LO=0,StaticCommon.LOGIC_LEVEL_HI=5,StaticCommon.COLOR_OF_FORBIDDEN=StaticCommon.MIT_RED,StaticCommon.Clip=function(n){return n<StaticCommon.LOGIC_LEVEL_LO?StaticCommon.LOGIC_LEVEL_LO:n>StaticCommon.LOGIC_LEVEL_HI?StaticCommon.LOGIC_LEVEL_HI:n},window.onload=function(){TransferPlot(310,100,400)};

